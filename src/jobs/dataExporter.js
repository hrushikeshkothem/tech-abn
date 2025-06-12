self.onmessage = async (e) => {
  const { exportSources, exportSavedPosts, exportFeeds } = e.data;

  const totalStages =
    Number(exportSources) +
    Number(exportSavedPosts) +
    (exportFeeds && exportSources ? 1 : 0);

  self.postMessage({
    statusShipper: true,
    status: {
      done: false,
      stage: 0,
      total: totalStages,
      percentage: Math.round((0 / totalStages) * 100),
      message: `📦 Export started`,
    },
  });
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const openDB = async () => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("rss_db", 3);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  const exportStore = async (db, storeName, stage) => {
    self.postMessage({
      statusShipper: true,
      status: {
        done: false,
        stage: stage,
        total: totalStages,
        percentage: Math.round((stage / totalStages) * 100),
        message: `⏳ Exporting ${storeName}`,
      },
    });
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const result = [];
    const req = store.openCursor();
    return new Promise((resolve, reject) => {
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          self.postMessage({
            statusShipper: true,
            status: {
              done: false,
              stage: stage,
              total: totalStages,
              percentage: Math.round((stage / totalStages) * 100),
              message: `✅ Exported ${storeName} (${result.length} items)`,
            },
          });
          resolve(result);
        }
      };
      req.onerror = () => {
        self.postMessage({
          statusShipper: true,
          status: {
            done: false,
            stage: stage,
            total: totalStages,
            percentage: Math.round((stage / totalStages) * 100),
            message: `❌ Failed to export ${storeName}`,
          },
        });
        resolve(result);
      };
    });
  };

  try {
    const db = await openDB();
    const exportData = {};
    let stage = 1;
    if (exportSources) {
      exportData.sources = await exportStore(db, "sources", stage);
      stage++;
      await delay(1500);
    }
    if (exportSavedPosts) {
      exportData.saved_posts = await exportStore(db, "saved_posts", stage);
      stage++;
      await delay(1500);
    }
    if (exportFeeds && exportSources) {
      exportData.feeds = await exportStore(db, "feeds", stage);
      stage++;
      await delay(1500);
    } else if (exportFeeds && !exportSources) {
      self.postMessage({
        statusShipper: true,
        status: {
          done: false,
          stage: stage,
          total: totalStages,
          percentage: Math.round((stage / totalStages) * 100),
          message: `⚠️ Cannot export feeds without exporting sources`,
        },
      });
    }
    db.close();
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    self.postMessage({
      done: true,
      blob,
      message: "🎉 Export completed",
    });
  } catch (err) {
    self.postMessage({
      statusShipper: true,
      status: {
        done: false,
        stage: 0,
        total: totalStages,
        percentage: Math.round((0 / totalStages) * 100),
        message: `❌ Export failed: ${err.message || err}`,
      },
    });
  }
};
