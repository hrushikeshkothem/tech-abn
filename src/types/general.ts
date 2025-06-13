export type TypePost = {
  imageUrl: string;
  title: string;
  shortDescription: string;
  tags?: { name: string; color: string }[];
  author: string;
  date: string;
  id: string;
  gradient?: string;
};

export type Sample_Source = {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  category: string;
  color: string;
  banner_url: string;
};

export type PostVariant = "default" | "compact";
