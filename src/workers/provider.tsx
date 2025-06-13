import { storage } from "@/storage/main";

export interface WorkerProvider {
  init(): Worker | null;
  run(data: any): Promise<boolean>;
  progressHandler(data: any): any;
}

export const getSyncOnOpenWorker: WorkerProvider = {
  init() {
    let syncOnOpenWorkerInstance: Worker | null = null;
    syncOnOpenWorkerInstance = new Worker(
      new URL("../jobs/syncOnOpen.js", import.meta.url),
      { type: "module" }
    );
    return syncOnOpenWorkerInstance;
  },
  async run({ workHandler, skipCheck, proxyServer, relaxation }) {
    const sources = await storage.getSourcesForSync();
    const checkPendingSync = sessionStorage.getItem("SyncStatus");
    const completedStages = parseInt(checkPendingSync as string) || 0;
    const data = {
      sources,
      completedStages,
      skipCheck: skipCheck != undefined ? skipCheck : false,
      proxyServer:
        proxyServer == undefined
          ? "https://rss.tabn.hrushispace.com/?url="
          : proxyServer,
      relaxation: relaxation == undefined ? 1000 : relaxation * 1000,
    };
    workHandler.postMessage(data);
    return true;
  },
  progressHandler(data) {
    if (data?.statusShipper) {
      const percent = data.status.percentage;
      const statusText = `Stage ${data.status.stage} of ${data.status.total} - ${percent}%`;
      const isComplete = false;
      sessionStorage.setItem("SyncStatus", `${data.status.stage}`);
      return { percent, statusText, isComplete };
    } else if (data?.done) {
      const percent = 100;
      const statusText = "Sync Complete!";
      const isComplete = true;
      sessionStorage.removeItem("SyncStatus");
      sessionStorage.setItem("sessionSync", "true");
      return { percent, statusText, isComplete };
    }
  },
};

export const getDataExporterWorker: WorkerProvider = {
  init() {
    let dataExporterWorker: Worker | null = null;
    dataExporterWorker = new Worker(
      new URL("../jobs/dataExporter.js", import.meta.url),
      { type: "module" }
    );
    return dataExporterWorker;
  },
  async run({ workHandler, exportSources, exportSavedPosts, exportFeeds }) {
    if (!exportSources && !exportSavedPosts && !exportFeeds) return false;
    const data = {
      exportSources,
      exportSavedPosts,
      exportFeeds,
    };
    workHandler.postMessage(data);
    return true;
  },
  progressHandler(data) {
    if (data?.statusShipper) {
      const percent = data.status.percentage;
      const statusText = data.status.message;
      const isComplete = false;
      sessionStorage.setItem("SyncStatus", `${data.status.stage}`);
      return { percent, statusText, isComplete };
    } else if (data?.done) {
      const percent = 100;
      const statusText = data.message;
      const isComplete = true;
      sessionStorage.removeItem("SyncStatus");
      const url = URL.createObjectURL(data.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rss_backup.json";
      a.click();
      URL.revokeObjectURL(url);
      return { percent, statusText, isComplete };
    }
  },
};

export const getCleanUpSyncWorker: WorkerProvider = {
  init() {
    let CleanUpSyncWorkerInstance: Worker | null = null;
    CleanUpSyncWorkerInstance = new Worker(
      new URL("../jobs/cleanUpSync.js", import.meta.url),
      { type: "module" }
    );
    return CleanUpSyncWorkerInstance;
  },
  async run({ workHandler, retention, hardClean }) {
    const data = {
      start: true,
      retention: retention === undefined ? 30 : retention,
      hardClean: hardClean == undefined ? false : true,
    };
    workHandler.postMessage(data);
    return true;
  },
  progressHandler(data) {
    if (data?.done) {
      const percent = 100;
      const statusText = data.message;
      const isComplete = true;
      sessionStorage.removeItem("SyncStatus");
      return { percent, statusText, isComplete };
    } else {
      const percent = 0;
      const statusText = data.status.message;
      const isComplete = false;
      sessionStorage.setItem("SyncStatus", `${data.status.stage}`);
      return { percent, statusText, isComplete };
    }
  },
};

export const getDataImporterWorker: WorkerProvider = {
  init() {
    let dataExporterWorker: Worker | null = null;
    dataExporterWorker = new Worker(
      new URL("../jobs/dataImporter.js", import.meta.url),
      { type: "module" }
    );
    return dataExporterWorker;
  },
  async run({ workHandler, importData }) {
    const data = {
      importData,
    };
    workHandler.postMessage(data);
    return true;
  },
  progressHandler(data) {
    if (data?.statusShipper) {
      const percent = data.status.percentage;
      const statusText = data.status.message;
      const isComplete = false;
      sessionStorage.setItem("SyncStatus", `${data.status.stage}`);
      return { percent, statusText, isComplete };
    } else if (data?.done) {
      const percent = 100;
      const statusText = data.message;
      const isComplete = true;
      sessionStorage.removeItem("SyncStatus");
      return { percent, statusText, isComplete };
    }
  },
};
