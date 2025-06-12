<?php
require_once './lib/SimplePie.php';

$allowed_origins = ['https://tabn.hrushispace.com', 'http://localhost:5173', 'http://localhost:4173'];
$rate_limit_count = 50;
$rate_limit_minutes = 1;
$storage_file = __DIR__. '/rss_proxy_rate_limit.json';
$method_cache_file = __DIR__. '/rss_method_cache.json';

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rate_data = file_exists($storage_file) ? json_decode(file_get_contents($storage_file), true) : [];

if (!isset($rate_data[$ip])) {
    $rate_data[$ip] = [];
}
$rate_data[$ip] = array_filter($rate_data[$ip], fn($ts) => $ts > time() - $rate_limit_minutes * 60);
if (count($rate_data[$ip]) >= $rate_limit_count) {
    http_response_code(429);
    echo json_encode(['status' => 'error', 'error' => 'Rate limit exceeded']);
    exit;
}
$rate_data[$ip][] = time();
file_put_contents($storage_file, json_encode($rate_data));

if (!isset($_GET['url'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'error' => 'Missing RSS URL']);
    exit;
}
$rss_url = $_GET['url'];

if (!filter_var($rss_url, FILTER_VALIDATE_URL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'error' => 'Invalid URL']);
    exit;
}

// Method cache management
function loadMethodCache() {
    global $method_cache_file;
    if (!file_exists($method_cache_file)) {
        return [];
    }
    $cache = json_decode(file_get_contents($method_cache_file), true);
    return is_array($cache) ? $cache : [];
}

function saveMethodCache($cache) {
    global $method_cache_file;
    file_put_contents($method_cache_file, json_encode($cache, JSON_PRETTY_PRINT));
}

function getCacheKey($url) {
    $parsed = parse_url($url);
    return ($parsed['host'] ?? '') . ($parsed['path'] ?? '');
}



function tryFeedParsing($rss_url, $attempt = 1) {
    $feed = new SimplePie();
    $feed->set_feed_url($rss_url);
    $feed->set_timeout(30);
    $feed->enable_cache(false);
    $feed->force_feed(true);
    
    // Different configuration attempts
    switch ($attempt) {
        case 1:
            // Minimal configuration - works for many feeds including Uber
            break;
            
        case 2:
            // Basic user agent only
            $feed->set_useragent('Mozilla/5.0 (compatible; RSS Reader)');
            break;
            
        case 3:
            // Standard browser user agent
            $feed->set_useragent('Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0');
            break;
            
        case 4:
            // Full browser simulation (for picky feeds) - but without problematic options
            $feed->set_useragent('Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0');
            $feed->set_curl_options([
                CURLOPT_HTTPHEADER => [
                    'Accept: application/rss+xml, application/xml, text/xml, */*',
                    'Accept-Language: en-US,en;q=0.9',
                    'Connection: keep-alive',
                    'Referer: https://www.hrushispace.com/',
                ],
                CURLOPT_FOLLOWLOCATION => true, 
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
            ]);
            break;
            
        case 5:
            // Full configuration with all headers (last resort)
            $feed->set_useragent('Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0');
            $feed->set_curl_options([
                CURLOPT_HTTPHEADER => [
                    'Accept: application/rss+xml, application/xml, text/xml, */*',
                    'Accept-Language: en-US,en;q=0.9',
                    'Accept-Encoding: gzip, deflate',
                    'Connection: keep-alive',
                    'Referer: https://www.hrushispace.com/',
                    'Upgrade-Insecure-Requests: 1',
                ],
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYPEER => true,
                CURLOPT_SSL_VERIFYHOST => 2,
            ]);
            break;
    }
    
    $feed->init();
    return $feed;
}

$method_cache = loadMethodCache();
$cache_key = getCacheKey($rss_url);

$feed = null;
$last_error = '';
$successful_attempt = 0;
$used_cache = false;
$cache_fallback = false;

if (isset($method_cache[$cache_key]) && isset($method_cache[$cache_key]['method'])) {
    $cached_method = $method_cache[$cache_key]['method'];
    $feed = tryFeedParsing($rss_url, $cached_method);
    if (!$feed->error()) {
        $successful_attempt = $cached_method;
        $used_cache = true;
        $method_cache[$cache_key]['timestamp'] = time();
        $method_cache[$cache_key]['success_count'] = ($method_cache[$cache_key]['success_count'] ?? 0) + 1;
        saveMethodCache($method_cache);
    } else {
        $cache_fallback = true;
        $last_error = $feed->error();
    }
}

if (!$used_cache || $cache_fallback) {
    for ($attempt = 1; $attempt <= 5; $attempt++) {
        if ($cache_fallback && isset($cached_method) && $attempt == $cached_method) {
            continue;
        }
        $feed = tryFeedParsing($rss_url, $attempt);
        if (!$feed->error()) {
            $successful_attempt = $attempt;
            $method_cache[$cache_key] = [
                'method' => $attempt,
                'timestamp' => time(),
                'success_count' => ($method_cache[$cache_key]['success_count'] ?? 0) + 1,
                'url_sample' => $rss_url 
            ];
            saveMethodCache($method_cache);
            break;
        }
        $last_error = $feed->error();
        if (strpos($last_error, '404') !== false || 
            strpos($last_error, '403') !== false ||
            strpos($last_error, 'DNS') !== false) {
            break;
        }
    }
}

if ($feed->error()) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error', 
        'error' => 'Failed to parse feed: ' . $last_error,
        'attempts_made' => $attempt ?? 0,
        'url' => $rss_url,
        'cache_info' => [
            'used_cache' => $used_cache,
            'cache_fallback' => $cache_fallback,
            'cached_method' => $cached_method ?? null
        ]
    ]);
    exit;
}

function cleanText($text) {
    return $text ? trim(html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8')) : '';
}

function formatDate($timestamp) {
    return $timestamp ? date('Y-m-d H:i:s', $timestamp) : '';
}

$normalized = [
    'status' => 'ok',
    'feed' => [
        'url' => $rss_url,
        'title' => cleanText($feed->get_title()),
        'link' => cleanText($feed->get_link()),
        'author' => cleanText($feed->get_author() ? $feed->get_author()->get_name() : ''),
        'description' => cleanText($feed->get_description()),
        'image' => cleanText($feed->get_image_url())
    ],
    'items' => []
];

if (isset($_GET['debug']) && $_GET['debug'] === '1') {
    $normalized['debug'] = [
        'successful_attempt' => $successful_attempt,
        'used_cache' => $used_cache,
        'cache_fallback' => $cache_fallback,
        'cached_method' => $cached_method ?? null,
        'cache_key' => $cache_key,
        'cache_stats' => $method_cache[$cache_key] ?? null
    ];
}

$items = $feed->get_items();
foreach ($items as $item) {
    $categories = [];
    if ($item->get_categories()) {
        foreach ($item->get_categories() as $category) {
            $categories[] = cleanText($category->get_term());
        }
    }
    $enclosure = [];
    if ($item->get_enclosure()) {
        $enc = $item->get_enclosure();
        $enclosure = [
            'url' => cleanText($enc->get_link()),
            'type' => cleanText($enc->get_type()),
            'length' => cleanText($enc->get_length())
        ];
    }
    $thumbnail = '';
    if ($item->get_enclosure() && $item->get_enclosure()->get_thumbnail()) {
        $thumbnail = cleanText($item->get_enclosure()->get_thumbnail());
    }
    $author = '';
    if ($item->get_author()) {
        $author = cleanText($item->get_author()->get_name());
    }
    $content = cleanText($item->get_content());
    $description = cleanText($item->get_description());
    if (empty($content)) {
        $content = $description;
    }
    $itemData = [
        'title' => cleanText($item->get_title()),
        'pubDate' => formatDate($item->get_date('U')),
        'link' => cleanText($item->get_link()),
        'guid' => cleanText($item->get_id() ?: $item->get_link()),
        'author' => $author,
        'thumbnail' => $thumbnail,
        'description' => $description,
        'content' => $content,
        'enclosure' => $enclosure,
        'categories' => array_values(array_unique($categories))
    ];
    $normalized['items'][] = $itemData;
}

echo json_encode($normalized, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>