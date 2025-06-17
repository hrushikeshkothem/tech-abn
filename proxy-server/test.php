<?php
function fetchPreviewImage($url) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        CURLOPT_TIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_HEADER => false,
        CURLOPT_RANGE => '0-8192', 
    ]);

    $html = curl_exec($ch);

    curl_close($ch);

    if (!$html) return null;

    $headEnd = stripos($html, '</head>');
    $headHtml = $headEnd !== false ? substr($html, 0, $headEnd + 7) : $html;

    libxml_use_internal_errors(true);
    $doc = new DOMDocument();
    $doc->loadHTML($headHtml);

    $metaTags = $doc->getElementsByTagName('meta');

    $candidates = [
        'og:image',
        'og:preview',
        'twitter:image',
        'image',
    ];

    foreach ($metaTags as $tag) {
        if ($tag->hasAttribute('property')) {
            $prop = strtolower($tag->getAttribute('property'));
            if (in_array($prop, $candidates) && $tag->hasAttribute('content')) {
                return $tag->getAttribute('content');
            }
        }
        if ($tag->hasAttribute('name')) {
            $name = strtolower($tag->getAttribute('name'));
            if (in_array($name, $candidates) && $tag->hasAttribute('content')) {
                return $tag->getAttribute('content');
            }
        }
    }

    return null;
}

$image = fetchPreviewImage("https://techcrunch.com/2025/06/14/23andme-files-for-bankruptcy-how-to-delete-your-data/");
echo "<img src="."$image". " />"; 
?>