import constate from "constate";
import { useState } from "react";

function usePdfFileStateInner(): [File | undefined, (file: File) => void] {
  return useState<File>();
}

export const [PdfFileLStateProvider, usePdfFileL, useSetPdfFileL] = constate(
  usePdfFileStateInner,
  ([file]) => file,
  ([, setFile]) => setFile
);

export const [PdfFileRStateProvider, usePdfFileR, useSetPdfFileR] = constate(
  usePdfFileStateInner,
  ([file]) => file,
  ([, setFile]) => setFile
);
