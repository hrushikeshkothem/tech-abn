self.onmessage = async (event) => {
  self.postMessage("👋 Worker started logging");

  const dataArray = event.data.sources;
  const skipLastSyncCheck = event.data.skipCheck;
  const proxyServer = event.data.proxyServer;
  const relaxation = event.data.relaxation;
  const completedStatus = event.data.completedStages;
  const now = Date.now();

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("rss_db", 3);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("feeds")) {
          db.createObjectStore("feeds", { keyPath: "link" });
        }
        if (!db.objectStoreNames.contains("sources")) {
          db.createObjectStore("sources", { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function addFeeds(items) {
    const db = await openDB();
    const tx = db.transaction("feeds", "readwrite");
    const store = tx.objectStore("feeds");

    for (const item of items) {
      try {
        await store.put(item);
      } catch (err) {
        console.error("Error inserting into feeds", err);
      }
    }

    await tx.done;
    db.close();
  }

  async function updateSourceFetchTime(sourceId, timestamp) {
    const db = await openDB();
    const tx = db.transaction("sources", "readwrite");
    const store = tx.objectStore("sources");

    try {
      const existing = await new Promise((resolve, reject) => {
        const req = store.get(sourceId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (existing) {
        const updated = { ...existing, last_fetch_time: timestamp };
        await new Promise((resolve, reject) => {
          const putReq = store.put(updated);
          putReq.onsuccess = () => resolve("Ok");
          putReq.onerror = () => reject(putReq.error);
        });
      }
    } catch (err) {
      console.error("Error updating fetch time", err);
    }

    await new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }

  async function fetchAndStoreSource(item) {
    const lastFetch = item.last_fetch_time
      ? new Date(item.last_fetch_time).getTime()
      : 0;
    const refreshIntervalMs = item.refresh_interval * 3600 * 1000;
    if (
      skipLastSyncCheck ||
      !lastFetch ||
      now - lastFetch >= refreshIntervalMs
    ) {
      try {
        const response = await fetch(proxyServer + item.url);
        const json = await response.json();
        const newItems = [];
        for (const entry of json?.items || []) {
          const pubDate = new Date(entry.pubDate).getTime();
          if (!lastFetch || pubDate > lastFetch) {
            entry.sourceId = item.id;
            newItems.push(entry);
          }
        }
        if (newItems.length > 0) {
          await addFeeds(newItems);
        }
        await updateSourceFetchTime(item.id, now);
        self.postMessage({
          key: item.id,
          statusShipper: true,
          status: {
            done: false,
            stage: i,
            total: dataArray.length,
            percentage: Math.round(((i + 1) / dataArray.length) * 100),
          },
        });
        return { id: item.id, inserted: newItems.length };
      } catch (err) {
        return { id: item.id, inserted: 0, error: String(err) };
      }
    } else {
      return { id: item.id, skipped: true };
    }
  }

  const results = [];

  let i = 0;
  for (const item of dataArray) {
    if (completedStatus > i) {
      i++;
      continue;
    }
    const result = await fetchAndStoreSource(item);
    results.push(result);
    self.postMessage({
      key: item.id,
      statusShipper: true,
      status: {
        done: false,
        stage: i + 1,
        total: dataArray.length,
        percentage: Math.round(((i + 1) / dataArray.length) * 100),
      },
    });
    await delay(relaxation);
    i++;
  }

  self.postMessage({
    done: true,
    summary: results,
  });
};
