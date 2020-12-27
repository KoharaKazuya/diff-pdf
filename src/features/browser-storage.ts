import constate from "constate";
import { useEffect, useState } from "react";
import {
  BrowserStorage,
  detectIndexedDBAccess,
  MemoryStorage,
  Storage,
} from "../browser-storage";

function useBrowserStorageValue(): Storage | undefined {
  const [storage, setStorage] = useState<Storage>();

  useEffect(() => {
    detectIndexedDBAccess().then((available) => {
      if (available) {
        setStorage(new BrowserStorage());
      } else {
        setStorage(new MemoryStorage());
        console.warn("cannot use IndexedDB, so use fallback storage on memory");
      }
    });
  }, []);

  return storage;
}

export const [BrowserStorageProvider, useBrowserStorage] = constate(
  useBrowserStorageValue
);
