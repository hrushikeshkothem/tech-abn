import {
  PROXY_SERVER_KEY,
  RELAXATION_PERIOD,
  RETENTION_PERIOD,
  THEME_KEY,
} from "../constants";
import type { StorageProvider } from "../provider";
import type { SyncSourceItem } from "../types";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("rss_db", 3);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("feeds")) {
        const feedStore = db.createObjectStore("feeds", { keyPath: "link" });
        feedStore.createIndex("pubDate", "pubDate");
      }
      if (!db.objectStoreNames.contains("sources")) {
        db.createObjectStore("sources", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("saved_posts")) {
        db.createObjectStore("saved_posts", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const webStorageProvider: StorageProvider = {
  async getSources() {
    const db = await openDB();
    const tx = db.transaction("sources", "readonly");
    const store = tx.objectStore("sources");
    const sources: any[] = [];
    const req = store.openCursor();
    return new Promise((resolve) => {
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          if (cursor.value.active == true) {
            sources.push(cursor.value);
          }
          cursor.continue();
        } else {
          db.close();
          resolve(sources);
        }
      };
      req.onerror = () => {
        db.close();
        resolve([]);
      };
    });
  },

  async getAllSources() {
    const db = await openDB();
    const tx = db.transaction("sources", "readonly");
    const store = tx.objectStore("sources");
    const sources: any[] = [];
    const req = store.openCursor();
    return new Promise((resolve) => {
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          sources.push(cursor.value);
          cursor.continue();
        } else {
          db.close();
          resolve(sources);
        }
      };
      req.onerror = () => {
        db.close();
        resolve([]);
      };
    });
  },

  async addSource(source) {
    const db = await openDB();
    const existingSources = await this.getAllSources()
    for(const currSource of existingSources){
      if(currSource.url === source.url){
        db.close();
        return;
      }
    }
    const tx = db.transaction("sources", "readwrite");
    source.active = true;
    tx.objectStore("sources").put(source);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },

  async updateSource(sourceId, data) {
    const sources = await this.getAllSources();
    const updated = sources.map((s) =>
      s.id === sourceId ? { ...s, ...data } : s
    );
    const db = await openDB();
    const tx = db.transaction("sources", "readwrite");
    const store = tx.objectStore("sources");
    updated.forEach((s) => store.put(s));
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },

  async deleteSource(sourceId) {
    const db = await openDB();
    const tx = db.transaction("sources", "readwrite");
    tx.objectStore("sources").delete(sourceId);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },

  async getSavedPosts() {
    const db = await openDB();
    const tx = db.transaction("saved_posts", "readonly");
    const store = tx.objectStore("saved_posts");
    const posts: any[] = [];
    const req = store.openCursor();
    return new Promise((resolve) => {
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          posts.push(cursor.value);
          cursor.continue();
        } else {
          db.close();
          resolve(posts);
        }
      };
      req.onerror = () => {
        db.close();
        resolve([]);
      };
    });
  },

  async savePost(post) {
    const savedPosts = await this.getSavedPosts();
    for (const savedPost of savedPosts) {
      if (savedPost.href === post.href) return;
    }
    const db = await openDB();
    const tx = db.transaction("saved_posts", "readwrite");
    tx.objectStore("saved_posts").put(post);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },

  async deletePost(postId) {
    const db = await openDB();
    const tx = db.transaction("saved_posts", "readwrite");
    tx.objectStore("saved_posts").delete(postId);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  },

  async clearAll() {
    const db = await openDB();
    const tx1 = db.transaction("sources", "readwrite");
    tx1.objectStore("sources").clear();
    const tx2 = db.transaction("saved_posts", "readwrite");
    tx2.objectStore("saved_posts").clear();
    await new Promise<void>((resolve, reject) => {
      tx1.oncomplete = () => resolve();
      tx1.onerror = () => reject(tx1.error);
    });
    await new Promise<void>((resolve, reject) => {
      tx2.oncomplete = () => resolve();
      tx2.onerror = () => reject(tx2.error);
    });
    db.close();
  },

  getTheme() {
    return localStorage.getItem(THEME_KEY);
  },

  setTheme(value) {
    this.setGenericItem(THEME_KEY, value);
  },

  async getGenericItem(key) {
    return localStorage.getItem(key);
  },

  async setGenericItem(key, data) {
    localStorage.setItem(key, data);
  },

  async getSourcesForSync() {
    const sources = await this.getSources();
    const transformedSource: SyncSourceItem[] = [];
    const db = await openDB();
    const tx = db.transaction("sources", "readonly");
    const store = tx.objectStore("sources");

    for (const source of sources) {
      const id = source.id;
      const url = source.url;
      const refresh_interval = source.refreshInterval;
      const last_fetch_time = await new Promise<string>((resolve) => {
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          if (getReq.result?.last_fetch_time) {
            resolve(new Date(getReq.result.last_fetch_time).toISOString());
          } else {
            const fourteenDaysAgo = new Date(
              Date.now() - 365 * 24 * 60 * 60 * 1000
            );
            resolve(fourteenDaysAgo.toISOString());
          }
        };
        getReq.onerror = () => {
          const fallback = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          resolve(fallback.toISOString());
        };
      });
      transformedSource.push({ id, url, refresh_interval, last_fetch_time });
    }
    db.close();
    return transformedSource;
  },

  async getPosts(sourceId) {
    const db = await openDB();
    const tx = db.transaction("feeds", "readonly");
    const store = tx.objectStore("feeds");
    const posts: any[] = [];
    const index = store.index("pubDate");
    const req = index.openCursor(null, "prev");
    return new Promise((resolve) => {
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const value = cursor.value;
          if (value.sourceId === sourceId) {
            posts.push(value);
          }
          cursor.continue();
        } else {
          db.close();
          resolve(posts);
        }
      };
      req.onerror = () => {
        db.close();
        resolve([]);
      };
    });
  },

  async getLatest(interval: string, sourcesWhiteList: string[] = []) {
    const sourcesMap = await this.fetchSourceBannerMap();

    const db = await openDB();
    const tx = db.transaction("feeds", "readonly");
    const store = tx.objectStore("feeds");

    let cutoffDate = new Date(0);

    if (interval) {
      const now = Date.now();
      const match = interval.match(/^(\d+)([dh])$/);
      if (match) {
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const ms = unit === "d" ? value * 86400_000 : value * 3600_000;
        cutoffDate = new Date(now - ms);
      }
    }

    const index = store.index("pubDate");
    const posts: any[] = [];

    return new Promise((resolve) => {
      const cursorReq = index.openCursor(null, "prev");
      cursorReq.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor) {
          db.close();
          resolve(posts);
          return;
        }
        const post = cursor.value;
        const postDate = new Date(post.pubDate);
        if (
          postDate >= cutoffDate &&
          (sourcesWhiteList.length === 0 ||
            sourcesWhiteList.includes(post.sourceId))
        ) {
          const banner_image_url = sourcesMap.get(post.sourceId) || "";
          posts.push({ ...post, banner_image_url });
        }
        if (posts.length >= 100) {
          db.close();
          resolve(posts);
        } else {
          cursor.continue();
        }
      };

      cursorReq.onerror = () => {
        db.close();
        resolve([]);
      };
    });
  },

  async fetchSourceBannerMap() {
    const db = await openDB();
    const txSources = db.transaction("sources", "readonly");
    const storeSources = txSources.objectStore("sources");
    const sourcesMap = new Map<string, string>();
    const sourceCursor = storeSources.openCursor();

    await new Promise<void>((resolve) => {
      sourceCursor.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const source = cursor.value;
          sourcesMap.set(source.id, source.bannerUrl || "");
          cursor.continue();
        } else {
          resolve();
        }
      };
      sourceCursor.onerror = () => resolve();
    });

    return sourcesMap;
  },

  async search(searchTerm: string) {
    const term = searchTerm.toLowerCase();
    const db = await openDB();

    const [sources, posts, savedPosts] = await Promise.all([
      new Promise<{ id: string; title: string }[]>((resolve) => {
        const tx = db.transaction("sources", "readonly");
        const store = tx.objectStore("sources");
        const cursorReq = store.openCursor();
        const results: any[] = [];

        cursorReq.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            const value = cursor.value;
            if (value.name?.toLowerCase().includes(term)) {
              results.push({ id: value.id, title: value.name });
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        cursorReq.onerror = () => resolve([]);
      }),

      new Promise<{ link: string; title: string }[]>((resolve) => {
        const tx = db.transaction("feeds", "readonly");
        const store = tx.objectStore("feeds");
        const cursorReq = store.openCursor();
        const results: any[] = [];

        cursorReq.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            const value = cursor.value;
            if (value.title?.toLowerCase().includes(term)) {
              results.push({ link: value.link, title: value.title });
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        cursorReq.onerror = () => resolve([]);
      }),

      new Promise<{ link: string; title: string }[]>((resolve) => {
        const tx = db.transaction("saved_posts", "readonly");
        const store = tx.objectStore("saved_posts");
        const cursorReq = store.openCursor();
        const results: any[] = [];

        cursorReq.onsuccess = (e) => {
          const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            const value = cursor.value;
            if (value.title?.toLowerCase().includes(term)) {
              results.push({ link: value.href, title: value.title });
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        cursorReq.onerror = () => resolve([]);
      }),
    ]);

    db.close();

    return {
      sources,
      posts,
      savedPosts,
    };
  },

  async setAdvancedOptions(server, retention, relaxation) {
    if (server) {
      await this.setGenericItem(PROXY_SERVER_KEY, server);
    }
    if (retention) {
      await this.setGenericItem(RETENTION_PERIOD, retention);
    }
    if (relaxation) {
      await this.setGenericItem(RELAXATION_PERIOD, relaxation);
    }
  },

  async getAdvancedOptions() {
    const server = await this.getGenericItem(PROXY_SERVER_KEY);
    const retention = parseFloat(
      (await this.getGenericItem(RETENTION_PERIOD)) || "0"
    );
    const relaxation = parseFloat(
      (await this.getGenericItem(RELAXATION_PERIOD)) || "0"
    );
    return { server, retention, relaxation };
  },
};
