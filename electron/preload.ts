import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld('electron', {
  openLinkInBrowser: (url:string) => ipcRenderer.invoke('open-linkIn-browser', url)
});
