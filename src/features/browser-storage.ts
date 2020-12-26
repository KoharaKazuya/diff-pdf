import constate from "constate";
import { useMemo } from "react";
import { BrowserStorage } from "../browser-storage";

function useBrowserStorageValue() {
  return useMemo(() => new BrowserStorage(), []);
}

export const [BrowserStorageProvider, useBrowserStorage] = constate(
  useBrowserStorageValue
);
