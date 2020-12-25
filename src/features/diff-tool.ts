import constate from "constate";
import { useEffect, useMemo, useState } from "react";
import { useAsync } from "react-async-hook";
import { comparePDFs, PagePair } from "../comparator";
import { PdfParser } from "../pdf-parser";
import { range } from "../utils/range";

function useFile(): [File | undefined, (file: File) => void] {
  return useState<File>();
}

export const [PdfFileLProvider, useSetPdfFileL, usePdfParserL] = constate(
  useFile,
  ([, setFile]: ReturnType<typeof useFile>) => setFile,
  ([file]: ReturnType<typeof useFile>) =>
    file ? new PdfParser(file) : undefined
);

export const [PdfFileRProvider, useSetPdfFileR, usePdfParserR] = constate(
  useFile,
  ([, setFile]: ReturnType<typeof useFile>) => setFile,
  ([file]: ReturnType<typeof useFile>) =>
    file ? new PdfParser(file) : undefined
);

export function usePagePairs(): PagePair[] {
  const parserL = usePdfParserL();
  const parserR = usePdfParserR();

  const [pagePairs, setPagePairs] = useState<PagePair[]>([]);

  useEffect(() => {
    if (!parserL || !parserR) return;
    setPagePairs([]);
    (async () => {
      for await (const r of comparePDFs(parserL, parserR)) {
        setPagePairs((s) => [...s, r]);
      }
    })();
  }, [parserL, parserR]);

  return pagePairs;
}

function usePages(
  parser: PdfParser | undefined,
  pairedPages: (number | undefined)[]
): (number | undefined)[] {
  const { result: pages } = useAsync(renderPages, [parser, pairedPages]);
  return pages ?? [];
}
async function renderPages(
  parser: PdfParser | undefined,
  pairedPages: (number | undefined)[]
) {
  if (!parser) return;
  const doc = await parser.parse();
  const maxPairedPage = pairedPages.reduce<number>(
    (m, p) => (p ? Math.max(m, p) : m),
    -Infinity
  );
  const restPages = range(Math.max(1, maxPairedPage + 1), doc.numPages + 1);
  return [...pairedPages, ...restPages];
}
export function usePagesL() {
  const pagePairs = usePagePairs();
  return usePages(
    usePdfParserL(),
    useMemo(() => pagePairs.map((p) => p.left), [pagePairs])
  );
}
export function usePagesR() {
  const pagePairs = usePagePairs();
  return usePages(
    usePdfParserR(),
    useMemo(() => pagePairs.map((p) => p.right), [pagePairs])
  );
}
