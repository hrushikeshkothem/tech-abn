import type { SavedPost, SourceItem } from "./types";

export interface StorageProvider {
  getSources(): Promise<SourceItem[]>;
  getAllSources(): Promise<SourceItem[]>;
  addSource(source: SourceItem): Promise<void>;
  updateSource(sourceId: string, data: Partial<SourceItem>): Promise<void>;
  deleteSource(sourceId: string): Promise<void>;

  getSavedPosts(): Promise<SavedPost[]>;
  savePost(post: SavedPost): Promise<void>;
  deletePost(postId: string): Promise<void>;

  clearAll(): Promise<void>;

  getTheme(): any;
  setTheme(value: string): void;

  getGenericItem(key: string): Promise<any>;
  setGenericItem(key: string, data: string): Promise<void>;

  getSourcesForSync(): Promise<any>;

  getPosts(sourceId: string): Promise<any>;
  getLatest(interval: any, sourcesWhiteList: any[]): Promise<any>;
  fetchSourceBannerMap(): Promise<any>;

  setAdvancedOptions(server?:string, retention?: string, relaxation?: string): Promise<any>;
  getAdvancedOptions(): Promise<any>;

  search(searchTerm: string): Promise<any>;
}