import constate from "constate";
import { useMemo } from "react";
import { PdfStorage } from "../pdf-storage";

function usePdfStorageValue() {
  return useMemo(() => new PdfStorage(), []);
}

export const [PdfStorageProvider, usePdfStorage] = constate(usePdfStorageValue);
