import {
  Ban,
  BookCheck,
  CircleCheckBig,
  Clock,
  Github,
  Globe,
  HardDrive,
  LayoutPanelLeft,
  LibraryBig,
  Palette,
  Repeat2,
  Rss,
  ServerCrash,
  Settings,
  Settings2,
  SlidersHorizontal,
  Timer,
  Trash2,
  Volume2,
  VolumeOff,
} from "lucide-react";

function SourceDescription() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        ➕ Add a New Source:{" "}
        <span className="text-blue-600">"Source Configuration"</span>
      </h2>

      <p className="text-gray-700 dark:text-gray-300">
        Provide a <strong>Source title</strong>, <strong>RSS feed URL</strong>,
        and an optional <strong>banner image</strong> to personalize your
        source.
      </p>

      <p className="text-gray-700 dark:text-gray-300">
        📰 <strong>What is RSS?</strong> It stands for{" "}
        <em>Really Simple Syndication</em> — a format that allows apps like TABN
        to fetch updates from blogs, news sites, and podcasts automatically.
      </p>

      <p className="text-gray-700 dark:text-gray-300">
        📬 This means you get the latest posts delivered directly to your feed,
        without needing to visit each site manually.
      </p>

      <p className="text-green-600 dark:text-green-400 font-medium">
        ✅ <strong>Not limited to RSS:</strong> As long as your proxy server
        returns data in the expected format, TABN will handle it just fine —
        whether it's Atom, JSON, or custom scraped content.
      </p>

      <p className="text-blue-600 dark:text-blue-400">
        👉{" "}
        <a
          href="https://www.w3.org/TR/rss/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Learn more from the official RSS documentation
        </a>
      </p>
    </div>
  );
}

function ConfigureIntervalDescription() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        ⏱️ Refresh Interval:{" "}
        <span className="text-blue-600">"Stay in Sync"</span>
      </h2>

      <p className="text-gray-700 dark:text-gray-300">
        📰 RSS feeds are updated by publishers over time — sometimes every few
        minutes, sometimes once a day.
      </p>

      <p className="text-gray-700 dark:text-gray-300">
        To make sure you never miss fresh content, <strong>TABN</strong> checks
        each feed’s URL regularly using a smart refresh system.
      </p>

      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
        <li>
          🔁 The{" "}
          <span className="text-blue-600 font-medium">refresh interval</span>{" "}
          defines how often to re-check a feed for new content.
        </li>
        <li>🛠️ Default is once per day — adjustable per source.</li>
      </ul>

      <p className="text-green-600 dark:text-green-400 font-medium">
        ✅ You stay up to date without unnecessary checks — efficient, flexible,
        and always in your control.
      </p>
    </div>
  );
}

function SyncOnOpenDescription() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        🔒 Privacy-First Syncing:{" "}
        <span className="text-blue-600">"Sync on Open"</span>
      </h2>

      <p className="text-gray-700 dark:text-gray-300">
        Tabn respects your privacy — we don’t ask for elevated permissions or
        run background jobs.
      </p>

      <p className="text-gray-700 dark:text-gray-300">
        Instead, we use a <strong>Web Worker-powered "Sync on Open"</strong>{" "}
        approach that runs seamlessly when you launch the app.
      </p>

      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
        <li>⚙️ A Web Worker kicks off in the background on app open.</li>
        <li>⏱️ It checks each RSS source’s last fetch time.</li>
        <li>🔁 If it’s past the refresh interval, it fetches new posts.</li>
        <li>🚀 Feeds are processed one by one — without blocking the UI.</li>
      </ul>

      <p className="text-green-600 dark:text-green-400 font-medium">
        ✅ Once done, your feed is up to date — without extra permissions.
      </p>
    </div>
  );
}

function CleanupSyncDescription() {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        🧹 Smart Storage Management:{" "}
        <span className="text-blue-600">"Clean up Sync"</span>
      </h2>

      <p className="text-gray-700 dark:text-gray-300">
        Tabn follows a <strong>local-first/client-first approach</strong> — no
        cloud databases or expensive servers. All your feed data is stored in
        your browser’s{" "}
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
          localStorage & IndexedDB
        </code>
        .
      </p>

      <p className="text-gray-700 dark:text-gray-300">
        But since it has limited space, we've built a smart retention system
        called <strong>CleanupSync</strong> 🧼.
      </p>

      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
        <li>
          📆 Feeds older than <strong>retention period</strong> are
          automatically flushed.
        </li>
      </ul>

      <p className="text-green-600 dark:text-green-400 font-medium">
        ✅ With CleanupSync, your feed data stays fresh, fast, and
        storage-friendly — all while staying 100% local.
      </p>
    </div>
  );
}

export const howItWorks = [
  {
    title: "Add a Source",
    description: <SourceDescription />,
    Icon: <BookCheck className="h-7 w-7 text-primary" />,
  },
  {
    title: "Configure Interval",
    description: <ConfigureIntervalDescription />,
    Icon: <SlidersHorizontal className="h-7 w-7 text-primary" />,
  },
  {
    title: "Sync on Open",
    description: <SyncOnOpenDescription />,
    Icon: <Repeat2 className="h-7 w-7 text-primary" />,
  },
  {
    title: "Auto Cleanup",
    description: <CleanupSyncDescription />,
    Icon: <Trash2 className="h-7 w-7 text-primary" />,
  },
];

export const whyDifferent = [
  {
    Icon: <Github className="h-10 w-10 text-primary" />,
    title: "Open Source",
    description: "Transparent code. Fork it, tweak it, improve it.",
  },
  {
    Icon: <HardDrive className="h-10 w-10 text-primary" />,
    title: "Local First",
    description: "Your data lives on your device, not the cloud.",
  },
  {
    Icon: <Ban className="h-10 w-10 text-primary" />,
    title: "No Logins Required",
    description: "No accounts. No friction. Just launch and go.",
  },
  {
    Icon: <LayoutPanelLeft className="h-10 w-10 text-primary" />,
    title: "Clutter-Free",
    description: "Built for focus. No ads. No noisy distractions.",
  },
  {
    Icon: <ServerCrash className="h-10 w-10 text-primary" />,
    title: "No Background Services",
    description: "Sync & cleanup only when you open the app.",
  },
  {
    Icon: <Settings2 className="h-10 w-10 text-primary" />,
    title: "Minimal Permissions",
    description: "No intrusive background access required.",
  },
  {
    Icon: <CircleCheckBig className="h-10 w-10 text-primary" />,
    title: "Swipeable Cards",
    description: "Tinder-style for quick, fun browsing.",
  },
  {
    Icon: <LibraryBig className="h-10 w-10 text-primary" />,
    title: "Dev-Centric Feeds",
    description: "Handpicked blogs, changelogs, and tool updates.",
  },
];

export const SAMPLE_RSS_SOURCES = [
  {
    id: "1749271830571_kuknp2nil",
    title: "Netflix Engineering",
    subtitle: "Tech blogs & articles from Netflix",
    url: "https://netflixtechblog.com/feed",
    category: "Engineering Blogs",
    color: "from-indigo-500 to-blue-500",
    bannerUrl:
      "https://images.ctfassets.net/y2ske730sjqp/1aONibCke6niZhgPxuiilC/2c401b05a07288746ddf3bd3943fbc76/BrandAssets_Logos_01-Wordmark.jpg",
  },
  {
    id: "1749271682670_vr1baeyuq",
    title: "Uber Engineering",
    subtitle: "Tech blogs & articles from Uber",
    url: "https://www.uber.com/en-IN/blog/rss/",
    category: "Engineering Blogs",
    color: "from-yellow-500 to-orange-500",
    bannerUrl:
      "https://s23.q4cdn.com/407969754/files/doc_multimedia/2025/6/1009805621/Uber_Logo_Black_RGB.jpg",
  },
  {
    id: "1749271926423_mrsl3ojhh",
    title: "Kubernetes",
    subtitle: "News and updates from Kubernetes",
    url: "https://kubernetes.io/feed.xml",
    category: "Cloud Native",
    color: "from-green-500 to-teal-500",
    bannerUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/1055px-Kubernetes_logo_without_workmark.svg.png",
  },
  {
    id: "1749272005969_baw2upu46",
    title: "Grafana",
    subtitle: "Monitoring, observability, and dashboards",
    url: "https://grafana.com/blog/index.xml",
    category: "DevOps",
    color: "from-red-500 to-pink-500",
    bannerUrl:
      "https://grafana.com/media/blog/grafana-gartner-2024/grafana-labs-leader-meta.png",
  },
  {
    id: "1749272121740_3d6vzpjra",
    title: "Fedora Distro",
    subtitle: "Community updates and open source news",
    url: "https://communityblog.fedoraproject.org/feed/",
    category: "Linux",
    color: "from-indigo-500 to-blue-500",
    bannerUrl:
      "https://us1.discourse-cdn.com/fedoraproject/original/2X/8/8345b72eae66fe71a6a439e533452cb7da6b7d56.png",
  },
  {
    id: "1749272497091_t07xhd0a2",
    title: "React Dev",
    subtitle: "Official blog of React",
    url: "https://react.dev/rss.xml",
    category: "Frontend",
    color: "from-indigo-500 to-purple-600",
    bannerUrl: "https://react.dev/images/og-community.png",
  },
  {
    id: "1749273342838_4uhv5ctb0",
    title: "Helm Blogs",
    subtitle: "Blog posts from the Helm team",
    url: "https://helm.sh/blog/index.xml",
    category: "Cloud Native",
    color: "from-sky-400 to-blue-600",
    bannerUrl: "https://helm.sh/blog/images/happy-5th.png",
  },
  {
    id: "1749273476757_lkw2yosep",
    title: "React Native Dev",
    subtitle: "Official blog for React Native developers",
    url: "https://reactnative.dev/blog/rss.xml",
    category: "Mobile Development",
    color: "from-teal-400 to-cyan-500",
    bannerUrl: "https://reactnative.dev/img/logo-share.png",
  },
  {
    id: "1749273602311_7hsawb9cc",
    title: "Product Hunt",
    subtitle: "Latest product launches and startup trends",
    url: "https://www.producthunt.com/feed",
    category: "Startups",
    color: "from-yellow-400 to-orange-500",
    bannerUrl:
      "https://ph-files.imgix.net/5073c396-a15c-4de9-8cd2-3ff42759ff3c.png",
  },
  {
    id: "1749280349376_0qsxqcoab",
    title: "Hugging Face",
    subtitle: "AI & ML innovations from Hugging Face",
    url: "https://huggingface.co/blog/feed.xml",
    category: "AI/ML",
    color: "from-sky-400 to-blue-600",
    bannerUrl: "https://huggingface.co/front/thumbnails/blog.png",
  },
  {
    id: "1749283192661_fdekxdxw6",
    title: "TechCrunch Security",
    subtitle: "Security news and analysis from TechCrunch",
    url: "https://techcrunch.com/category/security/feed/",
    category: "Security",
    color: "from-red-500 to-pink-500",
    bannerUrl:
      "https://techcrunch.com/wp-content/uploads/2018/04/tc-logo-2018-square-reverse2x.png",
  },
  {
    id: "1749353549011_zvohienbg",
    title: "Vercel Blogs",
    subtitle: "Latest updates from the Vercel team",
    url: "https://vercel.com/atom",
    category: "Frontend",
    color: "from-teal-400 to-cyan-500",
    bannerUrl:
      "https://repository-images.githubusercontent.com/659798237/9a6acdfe-6f48-47a7-9420-08047878569c",
  },
  {
    id: "1749382167315_uydoqu9lu",
    title: "GameSpot",
    subtitle: "Gaming news, reviews and announcements",
    url: "https://www.gamespot.com/feeds/news",
    category: "Gaming",
    color: "from-red-500 to-pink-500",
    bannerUrl:
      "https://www.gamespot.com/a/uploads/screen_kubrick/1575/15759911/3530384-screen%20shot%202019-05-06%20at%201.50.14%20pm.png",
  },
  {
    id: "1749523990156_avgfzjecj",
    title: "Ubuntu OS",
    subtitle: "Updates and blogs from Ubuntu team",
    url: "https://ubuntu.com/blog/feed",
    category: "Linux",
    color: "from-orange-400 to-red-600",
    bannerUrl: "https://i.ytimg.com/vi/9DHUyz54flA/maxresdefault.jpg",
  },
  {
    id: "1749524504153_ryt5h4n75",
    title: "Reddit Wallpapers",
    subtitle: "A feed of beautiful wallpapers from Reddit",
    url: "https://www.reddit.com/r/wallpapers/.rss",
    category: "Wallpapers",
    color: "from-yellow-400 to-orange-500",
    bannerUrl:
      "https://redditinc.com/hs-fs/hubfs/Reddit%20Inc/Brand/Redditinc_Thumbnail_Brand_Logo.png",
  },
];

export const THEMES = [
  {
    id: "light",
    name: "Light",
    icon: "☀️",
    description: "Clean and bright interface",
    gradient: "from-yellow-200 to-orange-200",
    preview: "bg-white border-gray-200",
  },
  {
    id: "dark",
    name: "Dark",
    icon: "🌙",
    description: "Easy on the eyes",
    gradient: "from-slate-600 to-slate-800",
    preview: "bg-slate-900 border-slate-700",
  },
  {
    id: "system",
    name: "System",
    icon: "💻",
    description: "Follow system preference",
    gradient: "from-orange-200 to-slate-700",
    preview:
      "bg-[linear-gradient(to_right,white_0%,white_50%,black_50%,black_100%)] border-gray-400",
  },
];

export const SoundOptions = [
  {
    enabled: true,
    icon: Volume2,
    title: "Enabled",
    subtitle: "Delightful sounds",
    color: "from-green-500 to-emerald-600",
  },
  {
    enabled: false,
    icon: VolumeOff,
    title: "Silent",
    subtitle: "Quiet focus",
    color: "from-gray-400 to-gray-600",
  },
];

export const AdvancedOptions = [
  {
    icon: Globe,
    label: "Proxy Server",
    key: "proxyServer",
    type: "text",
    placeholder: "Hyperlink to your proxy server",
  },
  {
    icon: Clock,
    label: "Retention Period (days)",
    key: "retentionPeriod",
    type: "number",
    min: 1,
    max: 365,
  },
  {
    icon: Timer,
    label: "Relaxation Time (seconds)",
    key: "relaxationTime",
    type: "number",
    min: 1,
    max: 60,
  },
];

export const setupSteps = [
  { title: "Select Sources", icon: Rss, color: "from-blue-500 to-cyan-500" },
  {
    title: "Choose Theme",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Audio Settings",
    icon: Volume2,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Advanced Options",
    icon: Settings,
    color: "from-orange-500 to-red-500",
  },
];

export const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 400 : -400,
    opacity: 0,
    scale: 0.95,
  }),
};
