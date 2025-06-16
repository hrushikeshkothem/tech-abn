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
