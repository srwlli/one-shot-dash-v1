/**
 * Shared Electron API Types
 * Used by both main process and renderer process
 */

/**
 * Platform information exposed to renderer
 */
export interface ElectronPlatformInfo {
  isElectron: true;
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;
}

/**
 * Window control API
 */
export interface ElectronWindowAPI {
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
}

/**
 * Theme management API
 */
export interface ElectronThemeAPI {
  get: () => Promise<"light" | "dark">;
  set: (theme: "light" | "dark" | "system") => Promise<boolean>;
  onChanged: (callback: (theme: string) => void) => () => void;
}

/**
 * File system result types
 */
export interface FileSystemResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface FileReadResult {
  success: boolean;
  content?: string;
  error?: string;
}

export interface FileBinaryResult {
  success: boolean;
  data?: Buffer;
  error?: string;
}

export interface FileEntry {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  modifiedAt: number;
  createdAt: number;
}

export interface FileListResult {
  success: boolean;
  files?: FileEntry[];
  error?: string;
}

export interface FileExistsResult {
  success: boolean;
  exists?: boolean;
  error?: string;
}

export interface FileWatchChangeEvent {
  type: "change" | "rename";
  path: string;
  content?: string;
}

/**
 * File system API
 */
export interface ElectronFileSystemAPI {
  showOpenDialog: (options: {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: { name: string; extensions: string[] }[];
    properties?: (
      | "openFile"
      | "openDirectory"
      | "multiSelections"
      | "showHiddenFiles"
    )[];
  }) => Promise<{ canceled: boolean; filePaths: string[] }>;

  showSaveDialog: (options: {
    title?: string;
    defaultPath?: string;
    buttonLabel?: string;
    filters?: { name: string; extensions: string[] }[];
  }) => Promise<{ canceled: boolean; filePath?: string }>;

  readFile: (filePath: string) => Promise<FileReadResult>;
  readBinary: (filePath: string) => Promise<FileBinaryResult>;
  writeFile: (
    filePath: string,
    data: string
  ) => Promise<{ success: boolean; error?: string }>;
  listDirectory: (dirPath: string) => Promise<FileListResult>;
  exists: (filePath: string) => Promise<FileExistsResult>;
  watchFile: (
    filePath: string,
    watchId: string
  ) => Promise<{ success: boolean; error?: string }>;
  unwatchFile: (watchId: string) => Promise<{ success: boolean }>;
  onFileChange: (
    watchId: string,
    callback: (event: FileWatchChangeEvent) => void
  ) => () => void;
}

/**
 * Notifications API
 */
export interface ElectronNotificationsAPI {
  show: (title: string, body: string, options?: object) => Promise<boolean>;
}

/**
 * App info API
 */
export interface ElectronAppAPI {
  getVersion: () => Promise<string>;
  getName: () => Promise<string>;
}

/**
 * Complete Electron API interface
 * Exposed via contextBridge to renderer process
 */
export interface ElectronAPI {
  platform: ElectronPlatformInfo;
  window: ElectronWindowAPI;
  theme: ElectronThemeAPI;
  fs: ElectronFileSystemAPI;
  notifications: ElectronNotificationsAPI;
  app: ElectronAppAPI;
}

/**
 * Type guard to check if running in Electron
 */
export function isElectron(): boolean {
  return (
    typeof window !== "undefined" &&
    "electronAPI" in window &&
    (window as { electronAPI?: ElectronAPI }).electronAPI?.platform
      ?.isElectron === true
  );
}

/**
 * Get the Electron API if available
 */
export function getElectronAPI(): ElectronAPI | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as { electronAPI?: ElectronAPI }).electronAPI;
}

/**
 * Augment Window interface for TypeScript
 */
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
