import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";
import * as url from "url";

const MODE = process.env.MODE || "dev";

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      webviewTag: true,
    },
  });

  if (MODE === "dev") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "../../dist/index.html"), // adjust if needed
        protocol: "file:",
        slashes: true,
      })
    );
  }

  win.on("closed", () => {
    win = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


ipcMain.handle('open-linkIn-browser',  async (_, data) => {
    shell.openExternal(data as string)
});