import CustomPost from "@/components/molecules/customPost";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import { TIME_SORT } from "@/utils/constants";
import GridLayout from "@/components/layouts/grid";
import { useResourceFetcher } from "@/hooks/useResourceFetcher";
import Loading from "./loading";
import GlobalError from "../globalError";
import { CustomDropDown } from "@/components/molecules/customDropDown";

export default function Saved() {
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  useEffect(() => {
    fetchSources();
    fetchSavedFeeds();
  }, []);
  const {
    sources,
    savedPosts,
    fetchSources,
    fetchSavedFeeds,
    isLoading,
    error,
  } = useResourceFetcher();
  
  const filteredPosts = useMemo(() => {
    const sourceMap: Record<string, string> = Object.fromEntries(
      sources.map((s) => [s.id, s.bannerUrl])
    );
    let filtered = [...savedPosts];
    if (selectedSource !== "all") {
      filtered = filtered.filter((p) => p.source_id === selectedSource);
    }
    filtered.sort((a, b) => {
      const d1 = new Date(a.date).getTime();
      const d2 = new Date(b.date).getTime();
      return sortOrder === "asc" ? d1 - d2 : d2 - d1;
    });
    return filtered.map((post) => ({
      ...post,
      banner_image_url: sourceMap[post.source_id],
    }));
  }, [savedPosts, selectedSource, sortOrder, sources]);

  const GridView = () => {
    return (
      <GridLayout>
        {filteredPosts.map((newsItem) => (
          <CustomPost
            variant="default"
            href={newsItem.href}
            key={newsItem.href}
            data={{
              title: newsItem.title,
              shortDescription: newsItem.shortDescription || "",
              imageUrl: newsItem.imageUrl || "",
              date: newsItem.date,
              tags: [],
              author: newsItem.date,
              id: newsItem.id,
            }}
            isSaved={true}
          />
        ))}
      </GridLayout>
    );
  };

  if (isLoading) return <Loading />;
  if (error) return <GlobalError error={error} />;
  if (filteredPosts.length === 0) {
    return (
      <div className="w-full text-center py-12 text-gray-500 dark:text-gray-400">
        No saved posts found.
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-full mx-auto flex flex-col">
      <Separator className="md:mt-8" />
      <p className="text-5xl md:text-6xl lg:text-7xl font-semibold text-center py-8">
        Saved Posts
      </p>
      <Separator className="mb-8" />
      <div className="flex flex-wrap justify-between gap-4 px-8">
        <CustomDropDown
          label="Filter by source"
          handleChange={setSelectedSource}
          options={sources}
          customOptions={[{ value: "all", label: "All" }]}
          defaultValue="all"
          placeholder="All Sources"
        />
        <CustomDropDown
          label="Sort by Time"
          handleChange={(value) => setSortOrder(value as "asc" | "desc")}
          options={TIME_SORT}
          defaultValue="desc"
          placeholder="Sort by Time"
        />
      </div>
      <GridView />
    </div>
  );
}
