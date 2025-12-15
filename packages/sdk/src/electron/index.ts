/**
 * Electron API exports
 * Shared types and utilities for Electron integration
 */

export type {
  ElectronAPI,
  ElectronPlatformInfo,
  ElectronWindowAPI,
  ElectronThemeAPI,
  ElectronFileSystemAPI,
  ElectronNotificationsAPI,
  ElectronAppAPI,
  FileSystemResult,
  FileReadResult,
  FileBinaryResult,
  FileEntry,
  FileListResult,
  FileExistsResult,
  FileWatchChangeEvent,
} from "./types";

export { isElectron, getElectronAPI } from "./types";
