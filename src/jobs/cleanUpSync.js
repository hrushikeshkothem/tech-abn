self.onmessage = async (e) => {
  const { start, retention, hardClean } = e.data;
  if (start === true) {
    self.postMessage({
      statusShipper: true,
      status: {
        done: false,
        stage: 0,
        total: 1,
        percentage: 0,
        message: `🧹 Cleanup started: Using manual pubDate parsing`,
      },
    });

    const retention_ms = 1000 * 60 * 60 * 24 * retention; 
    const cutoffDate = Date.now() - retention_ms;

    const openDB = async () =>
      new Promise((resolve, reject) => {
        const req = indexedDB.open("rss_db", 3);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

    try {
      const db = await openDB();
      const tx = db.transaction("feeds", "readwrite");
      const store = tx.objectStore("feeds");

      const req = store.openCursor();
      let deletedCount = 0;

      req.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          const pubDateStr = cursor.value?.pubDate;
          const pubDateTimestamp = new Date(pubDateStr).getTime();

          if (hardClean || (!isNaN(pubDateTimestamp) && pubDateTimestamp <= cutoffDate)) {
            cursor.delete();
            deletedCount++;
          }

          cursor.continue();
        } else {
          self.postMessage({
            done: true,
            count: deletedCount,
            message: `✅ Cleanup complete. ${deletedCount} old feed(s) removed.`,
          });
          db.close();
        }
      };

      req.onerror = () => {
        self.postMessage({
          done: false,
          count: 0,
          message: "❌ Failed while reading object store cursor.",
        });
        db.close();
      };
    } catch (err) {
      self.postMessage({
        done: false,
        count: 0,
        message: `❌ Cleanup failed: ${err.message || err}`,
      });
    }
  }
};
