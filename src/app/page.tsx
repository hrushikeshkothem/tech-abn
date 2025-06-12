import { Separator } from "@/components/ui/separator";
import SectionHeader from "../components/molecules/sectionHeader";
import CustomPost from "../components/molecules/customPost";
import {
  GalleryHorizontal,
  LayoutGrid,
  ChevronDown,
  Calendar,
  Filter,
} from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import type { NewsItem } from "@/storage/types";
import {
  GRID_MODE,
  INTERACTIVE_MODE,
  INTERVALOPTIONS,
  VISIBLE_CARD_COUNT,
} from "@/utils/constants";
import SwipeCard from "@/components/molecules/SwipeCard";
import GridLayout from "@/components/layouts/grid";
import InteractiveLayout from "@/components/layouts/interactive";
import { useSwipeGestures } from "@/hooks/useGestureHandler";
import { useResourceFetcher } from "@/hooks/useResourceFetcher";
import Loading from "./loading";
import GlobalError from "./globalError";
import EmptyState from "./empty";

export default function Home() {
  const [currentMode, setCurrentMode] = useState(GRID_MODE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [removedItems, setRemovedItems] = useState<NewsItem[]>([]);
  const [selectedInterval, setSelectedInterval] = useState("2d");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  const { rssItems, sources, fetchFeeds, fetchSources, isLoading, error } = useResourceFetcher(selectedInterval, selectedSources);

  const { handleSwipeLeft, handleSwipeRight, handleSwipeUp, handleUndo } = useSwipeGestures(
      currentMode,
      rssItems,
      currentIndex,
      setCurrentIndex,
      removedItems,
      setRemovedItems
    );

  useEffect(() => {
    if (currentMode === INTERACTIVE_MODE) {
      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case "d":
          case "ArrowRight":
            event.preventDefault();
            handleSwipeRight();
            break;
          case "a":
          case "ArrowLeft":
            event.preventDefault();
            handleSwipeLeft();
            break;
          case "w":
          case "ArrowUp":
            event.preventDefault();
            handleSwipeUp();
            break;
          case "s":
          case "ArrowDown":
            event.preventDefault();
            handleUndo();
            break;
          case "Enter":
            if (rssItems.length > 0) {
              window.open(rssItems[currentIndex].link, "_blank");
            }
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [rssItems, currentMode, currentIndex]);

  useEffect(() => {
    fetchSources();
  }, []);

  useEffect(() => {
    const select:string[] = []
    sources.forEach((source)=>{
      select.push(source.id)
    })
    setSelectedSources(select)
  },[sources])

  useEffect(() => {
    if (sources.length > 0) {
      fetchFeeds();
    }
  }, [selectedInterval, selectedSources, sources]);

  const selectedIntervalLabel = useMemo(() => {
    return (
      INTERVALOPTIONS.find((opt) => opt.value === selectedInterval)?.label ||
      "Select interval"
    );
  }, [selectedInterval]);

  const IntervalFilter = useCallback(
    () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">{selectedIntervalLabel}</span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {INTERVALOPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setSelectedInterval(option.value)}
              className={selectedInterval === option.value ? "bg-accent" : ""}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    [selectedInterval]
  );

  const SourceFilter = useCallback(() => {
    const handleSelectAllSources = () => {
      if (selectedSources.length === sources.length) {
        setSelectedSources([]);
      } else {
        setSelectedSources(sources.map((source) => source.id));
      }
    };

    const handleSourceToggle = (sourceId: string) => {
      setSelectedSources((prev) =>
        prev.includes(sourceId)
          ? prev.filter((id) => id !== sourceId)
          : [...prev, sourceId]
      );
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">
              Sources ({selectedSources.length})
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-64 max-h-80 overflow-y-auto"
        >
          <DropdownMenuItem onClick={handleSelectAllSources}>
            {selectedSources.length === sources.length
              ? "Deselect All"
              : "Select All"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {sources.map((source) => (
            <DropdownMenuCheckboxItem
              key={source.id}
              checked={selectedSources.includes(source.id)}
              onCheckedChange={() => handleSourceToggle(source.id)}
            >
              {source.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [sources, selectedSources]);

  const ModeSelector = () => (
    <>
      <GalleryHorizontal
        size={20}
        onClick={() => setCurrentMode(INTERACTIVE_MODE)}
        className={`${
          currentMode === INTERACTIVE_MODE
            ? "text-gray-900 dark:text-gray-100"
            : "text-gray-400 dark:text-gray-400"
        } cursor-pointer flex hover:text-gray-600 transition-colors`}
      />
      <LayoutGrid
        size={20}
        onClick={() => setCurrentMode(GRID_MODE)}
        className={`${
          currentMode === GRID_MODE
            ? "text-gray-900 dark:text-gray-100"
            : "text-gray-400 dark:text-gray-400"
        } cursor-pointer hover:text-gray-600 transition-colors`}
      />
    </>
  );

  const InteractiveView = () => {
    const visibleItems = rssItems.slice(
      currentIndex,
      currentIndex + VISIBLE_CARD_COUNT
    );
    return (
      <InteractiveLayout
        handleSwipeLeft={handleSwipeLeft}
        handleSwipeUp={handleSwipeUp}
        handleSwipeRight={handleSwipeRight}
        handleUndo={handleUndo}
        rssItemslength={rssItems.length}
      >
        {visibleItems.map((item, index) => {
          const zIndex = VISIBLE_CARD_COUNT - index; 
          return (
            <SwipeCard
              currentIndex={currentIndex}
              handleSwipeLeft={handleSwipeLeft}
              handleSwipeRight={handleSwipeRight}
              handleSwipeUp={handleSwipeUp}
              index={index}
              item={item}
              zIndex={zIndex}
              key={item.link}
            />
          );
        })}
      </InteractiveLayout>
    );
  };

  const GridView = () => (
    <GridLayout>
      {rssItems.map((item) => (
        <CustomPost
          href={item.link}
          key={item.link}
          data={{
              title: item.title,
              shortDescription: item.description,
              imageUrl:
                item.thumbnail || item.enclosure.url || item.banner_image_url,
              date: new Date(item.pubDate).toDateString(),
              tags: [],
              author: "RSS Feed",
              id: "#",
            }}
          variant="default"
        />
      ))}
    </GridLayout>
  );

  if (isLoading) return <Loading />;
  if (error) return <GlobalError error={error} />;

  return (
    <div className="min-h-[100dvh] max-w-full mx-auto flex flex-col justify-center">
      <Separator />
      <SectionHeader
        className="mt-8 px-4"
        title="Latest"
        btnText=""
        btnLink="#"
      >
        <div className="flex flex-1 gap-4 items-center justify-end mx-4 mt-8 flex-wrap">
          <IntervalFilter />
          <SourceFilter />
          <Separator orientation="vertical" className="h-6" />
          <ModeSelector />
        </div>
      </SectionHeader>
      {rssItems.length === 0 ? (
        <EmptyState 
          selectedSources={selectedSources}
          selectedInterval={selectedInterval}
        />
      ) : (
        <>
          {currentMode === GRID_MODE && <GridView />}
          {currentMode === INTERACTIVE_MODE && <InteractiveView />}
        </>
      )}
    </div>
  );
}
