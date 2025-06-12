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

export type PostVariant = "default" | "compact";