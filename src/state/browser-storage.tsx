import { createContext, ReactNode, use, useEffect, useState } from "react";
import {
  BrowserStorage,
  detectIndexedDBAccess,
  MemoryStorage,
  Storage,
} from "../browser-storage";

const StorageContext = createContext<Storage | undefined>(undefined);

export function StorageProvider({ children }: { children?: ReactNode }) {
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

  return <StorageContext value={storage}>{children}</StorageContext>;
}

export function useStorage() {
  return use(StorageContext);
}
