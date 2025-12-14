import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { registerIpcHandlers } from "./ipc";

// Determine if running in development mode
// Use only app.isPackaged to avoid conflicts with user's NODE_ENV
const isDev = !app.isPackaged;

// Keep a global reference of the window object
let mainWindow: BrowserWindow | null = null;

/**
 * Create the main application window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Business Dashboard",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    // Modern window styling
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 15, y: 15 },
    backgroundColor: "#0a0a0a",
    show: false, // Don't show until ready
  });

  // Register IPC handlers
  registerIpcHandlers(ipcMain, mainWindow);

  // Load the appropriate URL based on environment
  if (isDev) {
    // Development: load from Next.js dev server
    const devUrl = process.env.DEV_URL || "http://localhost:3000";
    mainWindow.loadURL(devUrl);

    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from static export in extraResources
    const prodPath = path.join(process.resourcesPath, "web", "out", "index.html");
    mainWindow.loadFile(prodPath);
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  // Handle window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open external links in default browser
    if (url.startsWith("http://") || url.startsWith("https://")) {
      require("electron").shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

// Create window when Electron is ready
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create window when dock icon is clicked
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, url) => {
    // Only allow navigation within the app
    const appUrl = isDev ? "http://localhost:3000" : "file://";
    if (!url.startsWith(appUrl)) {
      event.preventDefault();
    }
  });
});
