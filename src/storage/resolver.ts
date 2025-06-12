import { electronStorageProvider } from "./electron/electron.provider";
import type { StorageProvider } from "./provider";
import { webStorageProvider } from "./web/web.provider";

export function storageResolver(): StorageProvider {
  const isElectron =
    typeof window !== "undefined" &&
    window.process &&
    (window.process as any).type === "renderer";
  if (isElectron) {
    return electronStorageProvider;
  }
  return webStorageProvider;
}
