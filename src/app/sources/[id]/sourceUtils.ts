import { storage } from "@/storage/main";
import type { SourceItem } from "@/storage/types";

export const deleteSource = async (source_id: string) => {
  await storage.deleteSource(source_id);
};

export const editSource = async (source_id: string, sourceData: SourceItem) => {
  await storage.updateSource(source_id, sourceData);
};
