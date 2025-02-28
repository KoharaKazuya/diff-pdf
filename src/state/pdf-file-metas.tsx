import { createContext, ReactNode, use, useEffect } from "react";
import { useAsync } from "react-async-hook";
import type { PdfFileMeta, Storage } from "../browser-storage";
import { useStorage } from "./browser-storage";

const PdfFileMetasContext = createContext<PdfFileMeta[] | undefined>(undefined);

export function PdfFileMetasProvider({ children }: { children: ReactNode }) {
  const storage = useStorage();

  const { result, execute } = useAsync(
    async (storage: Storage | undefined) => {
      if (!storage) return;
      const metas = await storage.getAllPdfFiles();
      metas.reverse();
      return metas;
    },
    [storage],
  );

  useEffect(
    () =>
      storage?.onChangePdf(() => {
        execute(storage);
      }),
    [storage],
  );

  return <PdfFileMetasContext value={result}>{children}</PdfFileMetasContext>;
}

export function usePdfFileMetas() {
  return use(PdfFileMetasContext);
}
