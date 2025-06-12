export interface SourceItem {
  id: string;
  name: string;
  url: string;
  bannerUrl: string;
  refreshInterval: number;
  createdAt: string;
  gradient?: string;
  active?: boolean;
}

export interface SavedPost {
  id: string;
  title: string;
  href: string;
  shortDescription: string;
  date: string;
  imageUrl: string;
  source_id: string;
  className?: string;
  tags: string[];
  variant?: string;
}

export interface NewsItem {
  post_id: string;
  id: string;
  title: string;
  description: string;
  resource_id: string;
  pubDate: string;
  link: string;
  banner_image_url: string;
  resource_title: string;
  thumbnail: string;
  enclosure?: any;
}

export interface SyncSourceItem {
  id: string;
  refresh_interval: number;
  url: string;
  last_fetch_time: string;
}
