import { useState } from "react";
import { storage } from "@/storage/main";
import type { NewsItem, SavedPost, SourceItem } from "@/storage/types";
import type { Sample_Source } from "@/types/general";

export function useResourceFetcher(
  selectedInterval?: string,
  selectedSources?: string[]
) {
  const [rssItems, setRssItems] = useState<NewsItem[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [samepleSource, setSampleSource] = useState<Sample_Source[]>([]);

  const fetchAllSources = async () => {
     try {
      setIsLoading(true);
      const result = await storage.getAllSources();
      setSources(result);
    } catch (err) {
      console.error("Error fetching sources", err);
      setError("Source fetch failed");
    } finally {
      setIsLoading(false);
    }
  }

  const fetchSources = async () => {
    try {
      setIsLoading(true);
      const result = await storage.getSources();
      setSources(result);
    } catch (err) {
      console.error("Error fetching sources", err);
      setError("Source fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSamplesSources = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("https://api.tabn.hrushispace.com/sample_rss_sources");
      const result = await res.json();
      setSampleSource(result.body.resources as Sample_Source[]);
    } catch (err) {
      console.error("Error fetching sources", err);
      setError("Source fetch failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchFeedsBySource = async (id: string) => {
    try {
      setIsLoading(true);
      const posts = await storage.getPosts(id);
      setRssItems(posts);
    } catch (err) {
      console.error("Error fetching RSS feeds", err);
      setError("Feed fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedFeeds = async () => {
    try {
      setIsLoading(true);
      const posts = await storage.getSavedPosts();
      setSavedPosts(posts);
    } catch (err) {
      console.error("Error fetching RSS feeds", err);
      setError("Feed fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeeds = async () => {
    try {
      setIsLoading(true);
      const latest = await storage.getLatest(
        selectedInterval,
        selectedSources || []
      );
      setRssItems(latest);
    } catch (err) {
      console.error("Error fetching RSS feeds", err);
      setError("Feed fetch failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rssItems,
    sources,
    savedPosts,
    samepleSource,
    setRssItems,
    setSources,
    setSavedPosts,
    fetchFeeds,
    fetchSources,
    fetchAllSources,
    fetchFeedsBySource,
    fetchSavedFeeds,
    fetchSamplesSources,
    isLoading,
    error,
  };
}
