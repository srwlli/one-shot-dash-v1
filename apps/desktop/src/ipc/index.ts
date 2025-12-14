import {
  IpcMain,
  BrowserWindow,
  app,
  dialog,
  Notification,
  nativeTheme,
} from "electron";
import * as fs from "fs/promises";

/**
 * Register all IPC handlers
 */
export function registerIpcHandlers(
  ipcMain: IpcMain,
  mainWindow: BrowserWindow
): void {
  // Window controls
  ipcMain.handle("window:minimize", () => {
    mainWindow.minimize();
  });

  ipcMain.handle("window:maximize", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle("window:close", () => {
    mainWindow.close();
  });

  ipcMain.handle("window:isMaximized", () => {
    return mainWindow.isMaximized();
  });

  // Theme management
  ipcMain.handle("theme:get", () => {
    return nativeTheme.shouldUseDarkColors ? "dark" : "light";
  });

  ipcMain.handle("theme:set", (_event, theme: "light" | "dark" | "system") => {
    nativeTheme.themeSource = theme;
    return true;
  });

  // Listen for system theme changes
  nativeTheme.on("updated", () => {
    mainWindow.webContents.send(
      "theme:changed",
      nativeTheme.shouldUseDarkColors ? "dark" : "light"
    );
  });

  // File system operations
  ipcMain.handle(
    "fs:showOpenDialog",
    async (_event, options: Electron.OpenDialogOptions) => {
      const result = await dialog.showOpenDialog(mainWindow, options);
      return result;
    }
  );

  ipcMain.handle(
    "fs:showSaveDialog",
    async (_event, options: Electron.SaveDialogOptions) => {
      const result = await dialog.showSaveDialog(mainWindow, options);
      return result;
    }
  );

  ipcMain.handle("fs:readFile", async (_event, filePath: string) => {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      return { success: true, content };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle(
    "fs:writeFile",
    async (_event, filePath: string, data: string) => {
      try {
        await fs.writeFile(filePath, data, "utf-8");
        return { success: true };
      } catch (error) {
        return { success: false, error: String(error) };
      }
    }
  );

  // Notifications
  ipcMain.handle(
    "notifications:show",
    (_event, title: string, body: string, _options?: object) => {
      if (Notification.isSupported()) {
        const notification = new Notification({ title, body });
        notification.show();
        return true;
      }
      return false;
    }
  );

  // App info
  ipcMain.handle("app:getVersion", () => {
    return app.getVersion();
  });

  ipcMain.handle("app:getName", () => {
    return app.getName();
  });
}
