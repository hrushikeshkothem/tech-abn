/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StorageProvider } from "../provider";
import type { SourceItem, SavedPost } from "../types";

export const electronStorageProvider: StorageProvider = {
  async getSources(): Promise<SourceItem[]> {
    return [];
  },
  async getAllSources() {
    return [];
  },
  async addSource(_source) {},
  async updateSource(_id, _data) {},
  async deleteSource(_id) {},
  async getSavedPosts(): Promise<SavedPost[]> {
    return [];
  },
  async savePost(_post) {},
  async deletePost(_id) {},
  async clearAll() {},
  getTheme() {},
  setTheme(_value) {},
  async getGenericItem(_key) {},
  async setGenericItem(_key, _data) {},

  async getSourcesForSync() {},

  async getPosts(_sourceId) {},
  async getLatest(_interval, _sourcesWhiteList) {},

  async fetchSourceBannerMap() {},
  async search(_searchTerm) {},

  async setAdvancedOptions(_server, _retention, _relaxation) {},

  async getAdvancedOptions() {},
};
