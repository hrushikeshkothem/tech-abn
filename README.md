# Tabn

<p align="center">
  <img src="public/logo.png" alt="Tabn Logo" width="80" />
</p>

<p align="center">
  <strong>Tabn</strong> is an open-source, offline-first, background-worker-powered reading tool that supports syncing content from RSS and custom sources with full local control.
</p>

<p align="center">
  <a href="https://github.com/hrushikeshkothem/tech-abn/">
    <img alt="Build Status" src="https://img.shields.io/github/actions/workflow/status/hrushikeshkothem/tech-abn/deploy.yml?branch=main" />
  </a>
  <a href="https://github.com/hrushikeshkothem/tech-abn/">
    <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-green.svg" />
  </a>
  <a href="https://github.com/hrushikeshkothem/tech-abn/">
    <img alt="Stars" src="https://img.shields.io/github/stars/hrushikeshkothem/tech-abn?style=social" />
  </a>
  <a href="https://github.com/hrushikeshkothem/tech-abn/">
    <img alt="Issues" src="https://img.shields.io/github/issues/hrushikeshkothem/tech-abn" />
  </a>
  <a href="https://tabn.hrushispace.com" target="_blank">
    <img alt="Live Demo" src="https://img.shields.io/badge/demo-live-blue?logo=firefox-browser" />
  </a>
</p>

---

## 🌟 Overview

**Tabn** is a modern reading and sync tool that gives you full control of your content, built with performance, privacy, and extensibility in mind.

- ✅ Offline-first — stores everything in your browser using IndexedDB
- 🔄 Background sync using Web Workers
- 🧵 Clean job queue system for seamless tasks
- 📤 Import/export full content archive
- 🔌 Supports RSS and custom source logic
- 🖥 Electron desktop version in progress
- 🔐 No analytics or tracking — your data stays with you

---

## ✨ Features

- **Offline-First Architecture**  
  Uses IndexedDB to store content locally.

- **Background Worker System**  
  Tasks like fetching, syncing, or exporting run in the background.

- **Job Queue**  
  Ensures tasks are performed sequentially and efficiently.

- **Import / Export**  
  Backup or move your entire reading history anytime.

- **Custom Sources**  
  Beyond RSS: plug in your own fetch logic.

- **Electron App (Upcoming)**  
  Desktop app with complete offline capabilities and enhanced power features.

---

## 📦 Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS  
- **Build Tool:** Vite  
- **Data Handling:** IndexedDB  
- **Background Processing:** Web Workers, Job Queue  
- **Server (optional):** PHP (SimplePie-based) proxy for RSS fetching  
- **Desktop (WIP):** Electron

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hrushikeshk/tabn.git
cd tabn
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Dev Server

```bash
npm run dev
```

### 4. Start RSS Proxy Server (Optional)

If you're using RSS and want to bypass CORS issues:

```bash
php -S localhost:8080 -t proxy-server
```

---

## 🖥 Electron Desktop (WIP)

Basic support for Electron is under development.

```bash
cd electron
npm install
npm run build
```

---

## 🛡 Privacy Focus

Tabn does **not** track users, send analytics, or share any data externally.  
Everything stays on your device unless you explicitly export it.

---

## 📁 Folder Structure

```
tabn/
├── public/              # Static assets
├── src/                 # React source code
│   ├── components/      # UI components
│   ├── workers/         # Web workers
│   ├── jobs/            # Job queue system
│   ├── utils/           # Helpers
│   └── ...
├── proxy-server/        # PHP RSS proxy (optional)
├── electron/            # Desktop wrapper (WIP)
└── README.md
```

---

## 📈 Roadmap

- [x] IndexedDB storage
- [x] Background web workers
- [x] RSS support via proxy
- [x] Import/export support
- [x] Job queueing system
- [ ] Electron Desktop App
- [ ] Plugin system for custom sources
- [ ] Power user mode with custom JavaScript fetch logic

---

## 🤝 Contributing

Contributions are welcome and appreciated.

To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a new Pull Request

---

## 📄 License

MIT License © [Hrushikesh Kothem](https://github.com/hrushikeshkothem)