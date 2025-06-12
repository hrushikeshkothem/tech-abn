self.onmessage = async (e) => {
  const { importData } = e.data;
  const totalStages = 3;
  self.postMessage({
    statusShipper: true,
    status: {
      done: false,
      stage: 0,
      total: totalStages,
      percentage: Math.round((0 / totalStages) * 100),
      message: `📥 Import started`,
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
  const importStore = async (db, storeName, data, stage, stageName) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      self.postMessage({
        statusShipper: true,
        status: {
          done: false,
          stage: stage,
          total: totalStages,
          percentage: Math.round((stage / totalStages) * 100),
          message: `⏭️ Skipping ${stageName} (no data)`,
        },
      });
      return 0;
    }
    self.postMessage({
      statusShipper: true,
      status: {
        done: false,
        stage: stage,
        total: totalStages,
        percentage: Math.round((stage / totalStages) * 100),
        message: `⏳ Importing ${stageName}`,
      },
    });
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    let importedCount = 0;
    for (const item of data) {
      try {
        await new Promise((resolve, reject) => {
          const req = store.put(item);
          req.onsuccess = () => {
            importedCount++;
            resolve();
          };
          req.onerror = () => reject(req.error);
        });
      } catch (error) {
        console.warn(`Failed to import item to ${storeName}:`, error);
      }
    }
    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    self.postMessage({
      statusShipper: true,
      status: {
        done: false,
        stage: stage,
        total: totalStages,
        percentage: Math.round((stage / totalStages) * 100),
        message: `✅ Imported ${stageName} (${importedCount} items)`,
      },
    });
    return importedCount;
  };

  const addLastSyncTimeToSources = async (db) => {
    const tx = db.transaction("sources", "readwrite");
    const store = tx.objectStore("sources");
    const now = Date.now();
    const req = store.openCursor();
    return new Promise((resolve, reject) => {
      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const source = cursor.value;
          source.lastSyncTime = now;
          cursor.update(source);
          cursor.continue();
        } else {
          resolve();
        }
      };
      req.onerror = () => reject(req.error);
    });
  };

  try {
    self.postMessage({
      statusShipper: true,
      status: {
        done: false,
        stage: 1,
        total: totalStages,
        percentage: Math.round((1 / totalStages) * 100),
        message: `🔍 Parsing import data`,
      },
    });
    let parsedData;
    try {
      parsedData = JSON.parse(importData);
    } catch (parseError) {
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }
    await delay(500);
    const db = await openDB();
    let sourcesImported = 0;
    let savedPostsImported = 0;
    if (parsedData.sources) {
       const isPostsImporting = parsedData.feeds && Array.isArray(parsedData.feeds) && parsedData.feeds.length > 0
      parsedData.sources.forEach(source => {
        source.active = true
        source.last_fetch_time = isPostsImporting ? source.last_fetch_time : null
      });
      sourcesImported = await importStore(db, "sources", parsedData.sources, 2, "sources");
      await delay(1000);
    }
    if (parsedData.saved_posts) {
      savedPostsImported = await importStore(db, "saved_posts", parsedData.saved_posts, 2, "saved posts");
      await delay(1000);
    }
    let feedsImported = 0;
    let hasFeeds = false;
    if (parsedData.feeds && Array.isArray(parsedData.feeds) && parsedData.feeds.length > 0) {
      hasFeeds = true;
      feedsImported = await importStore(db, "feeds", parsedData.feeds, 3, "feeds");
      await delay(1000);
      if (sourcesImported > 0) {
        self.postMessage({
          statusShipper: true,
          status: {
            done: false,
            stage: 3,
            total: totalStages,
            percentage: Math.round((3 / totalStages) * 100),
            message: `⏳ Adding last sync time to sources`,
          },
        });
        await addLastSyncTimeToSources(db);
        await delay(500);
      }
    } else {
      self.postMessage({
        statusShipper: true,
        status: {
          done: false,
          stage: 3,
          total: totalStages,
          percentage: Math.round((3 / totalStages) * 100),
          message: `⏭️ No feeds to import, skipping last sync time`,
        },
      });
    }

    db.close();
    const summary = [];
    if (sourcesImported > 0) summary.push(`${sourcesImported} sources`);
    if (savedPostsImported > 0) summary.push(`${savedPostsImported} saved posts`);
    if (feedsImported > 0) summary.push(`${feedsImported} feeds`);
    self.postMessage({
      done: true,
      message: `🎉 Import completed: ${summary.join(', ')}`,
      imported: {
        sources: sourcesImported,
        savedPosts: savedPostsImported,
        feeds: feedsImported,
        hasLastSyncTime: hasFeeds && sourcesImported > 0
      }
    });
  } catch (err) {
    self.postMessage({
      statusShipper: true,
      status: {
        done: false,
        stage: 0,
        total: totalStages,
        percentage: 0,
        message: `❌ Import failed: ${err.message || err}`,
      },
    });
  }
};