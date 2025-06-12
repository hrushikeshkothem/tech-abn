import { useEffect } from "react";
import type { NewsItem } from "@/storage/types";
import { INTERACTIVE_MODE } from "@/utils/constants";
import IDgenerator from "@/utils/IDgen";
import { storage } from "@/storage/main";
import { toast } from "./useToast";

export function useSwipeGestures(
  currentMode: number,
  rssItems: NewsItem[],
  currentIndex: number,
  setCurrentIndex: (i: number) => void,
  removedItems: NewsItem[],
  setRemovedItems: (items: NewsItem[]) => void
) {
  const pass = () => {
    if (rssItems.length === 0) return;
    const newRemoved = [...removedItems, rssItems[currentIndex]];
    setRemovedItems(newRemoved);
    setCurrentIndex(currentIndex < rssItems.length - 1 ? currentIndex + 1 : 0);
  };

  const save = async () => {
    const saveData = {
      variant: "default",
      imageUrl: rssItems[currentIndex].banner_image_url,
      title: rssItems[currentIndex].title,
      shortDescription: rssItems[currentIndex].description,
      tags: [],
      author: rssItems[currentIndex].resource_title,
      date: new Date(rssItems[currentIndex].pubDate).toDateString(),
      className: "",
      href: rssItems[currentIndex].link,
      source_id: rssItems[currentIndex].resource_id,
      id: IDgenerator(),
    };
    await storage.savePost(saveData);
    toast({
      title: "Saved!",
      description: "This post has been saved to your device.",
      duration: 1000,
    });
    pass();
  };

  const handleSwipeLeft = pass;
  const handleSwipeRight = save;
  const handleSwipeUp = pass;

  const handleUndo = () => {
    if (removedItems.length === 0) return;
    setRemovedItems(removedItems.slice(0, -1));
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : rssItems.length - 1);
  };

  useEffect(() => {
    if (currentMode !== INTERACTIVE_MODE) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
        case "a":
          handleSwipeLeft();
          break;
        case "ArrowRight":
        case "d":
          handleSwipeRight();
          break;
        case "ArrowUp":
        case "w":
          handleSwipeUp();
          break;
        case "ArrowDown":
        case "s":
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
  }, [rssItems, currentMode, currentIndex, removedItems]);

  return {
    handleSwipeLeft,
    handleSwipeRight,
    handleSwipeUp,
    handleUndo,
  };
}
