import constate from "constate";
import { useEffect } from "react";
import { useAsync } from "react-async-hook";
import type { Storage } from "../browser-storage";
import { useStorage } from "./browser-storage";

function usePdfFileMetasInner() {
  const storage = useStorage();

  const { result, execute } = useAsync(
    async (storage: Storage | undefined) => {
      if (!storage) return;
      const metas = await storage.getAllPdfFiles();
      metas.reverse();
      return metas;
    },
    [storage]
  );

  useEffect(
    () =>
      storage?.onChangePdf(() => {
        execute(storage);
      }),
    [storage]
  );

  return result;
}
export const [PdfFileMetasProvider, usePdfFileMetas] = constate(
  usePdfFileMetasInner
);
