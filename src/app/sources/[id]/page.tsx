import { Separator } from "@/components/ui/separator";
import CustomPost from "@/components/molecules/customPost";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteSource, editSource } from "./sourceUtils";
import Loading from "./loading";
import type { SourceItem } from "@/storage/types";
import GridLayout from "@/components/layouts/grid";
import EditDialog from "./editDialog";
import { useResourceFetcher } from "@/hooks/useResourceFetcher";
import GlobalError from "@/app/globalError";
import { REFRESH_INTERVALS, TIME_SORT } from "@/utils/constants";
import { CustomDropDown } from "@/components/molecules/customDropDown";

export default function SingleSource() {
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sourceData, setSourceData] = useState<SourceItem | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const {
    sources,
    isLoading,
    error,
    fetchSources,
    fetchFeedsBySource,
    rssItems,
  } = useResourceFetcher();

  const router = useNavigate();
  const params = useParams();

  const filtered = useMemo(() => {
    const filtered = [...rssItems];
    filtered.sort((a, b) => {
      const d1 = new Date(a.pubDate).getTime();
      const d2 = new Date(b.pubDate).getTime();
      return sortOrder === "asc" ? d1 - d2 : d2 - d1;
    });
    return filtered;
  }, [rssItems, sortOrder]);

  const handleEdit = () => {
    if (sourceData) {
      editSource(params.id as string, sourceData);
      setIsEditDialogOpen(false);
      router("/sources");
    }
  };

  const handleDelete = () => {
    deleteSource(params.id as string);
    router("/sources");
  };

  const handleRefreshIntervalEdit = (value: string) => {
    const source = sourceData;
    if (source) {
      source.refreshInterval = Number(value);
      editSource(params.id as string, source);
    }
  };

  useEffect(() => {
    const currentSource = sources.find(
      (source: SourceItem) => source.id === params.id
    );
    if (currentSource) {
      setSourceData(currentSource);
      setTitle(currentSource.name);
      setBanner(currentSource.bannerUrl);
      //setGradient(currentSource.gradient as SetStateAction<string>);
      fetchFeedsBySource(currentSource.id);
    }
  }, [sources]);

  useEffect(() => {
    fetchSources();
  }, [params.id]);

  const GridView = () => {
    return (
      <GridLayout>
        {filtered.map((newsItem, index) => (
          <CustomPost
            href={newsItem.link}
            key={index}
            data={{
              title: newsItem.title,
              shortDescription: newsItem.description,
              imageUrl: newsItem.thumbnail || newsItem.enclosure.url || banner,
              date: new Date(newsItem.pubDate).toDateString(),
              tags: [],
              author: newsItem.resource_title,
              id: newsItem.id || "",
            }}
            variant="default"
          />
        ))}
      </GridLayout>
    );
  };

  if (isLoading) return <Loading />;
  if (error) return <GlobalError error={error} />;

  return (
    <div className="min-h-[100dvh] max-w-full mx-auto flex flex-col">
      <Separator className="mb-4" />
      <p className="text-6xl md:text-8xl lg:text-9xl font-semibold text-center">
        {title}
      </p>
      <Separator className="mt-4" />
      <div className="flex flex-col md:flex-row  px-8 mt-8 gap-4 items-center justify-between w-full">
        <div className="flex flex-row gap-4">
          <CustomDropDown
            label="Sort by Time"
            handleChange={(value: string) => {
              setSortOrder(value as "desc" | "asc");
            }}
            options={TIME_SORT}
            defaultValue={sortOrder}
            placeholder="Sort by Time"
          />
          <CustomDropDown
            label="Refresh Interval "
            options={REFRESH_INTERVALS}
            handleChange={handleRefreshIntervalEdit}
            defaultValue={sourceData?.refreshInterval + ""}
            placeholder="Refresh Interval"
          />
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant="default"
            size="default"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button variant="outline" size="default" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>
      <EditDialog
        handleSaveEdit={handleEdit}
        isEditDialogOpen={isEditDialogOpen}
        setSourceData={setSourceData}
        sourceData={sourceData}
        setIsEditDialogOpen={setIsEditDialogOpen}
      />
      <GridView />
    </div>
  );
}
