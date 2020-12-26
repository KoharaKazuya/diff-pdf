import constate from "constate";
import { useEffect, useMemo, useState } from "react";
import { useAsync } from "react-async-hook";
import { comparePDFs, PagePair } from "../comparator";
import type { PdfParser } from "../pdf-parser";
import { range } from "../utils/range";

let pdfParserModule: Promise<typeof import("../pdf-parser")> | undefined;
function fetchPdfParserModule() {
  if (!pdfParserModule)
    pdfParserModule = import(/* webpackPrefetch: true */ "../pdf-parser");
  return pdfParserModule;
}
async function getPdfParserInstance(file: File | undefined) {
  if (!file) return;
  const { PdfParser } = await fetchPdfParserModule();
  return new PdfParser(file);
}

function useFile(): [File | undefined, (file: File) => void] {
  return useState<File>();
}

export const [PdfFileLProvider, useSetPdfFileL, usePdfFileL] = constate(
  useFile,
  ([, setFile]: ReturnType<typeof useFile>) => setFile,
  ([file]: ReturnType<typeof useFile>) => file
);

export function usePdfParserL() {
  const file = usePdfFileL();
  const { result } = useAsync(getPdfParserInstance, [file]);
  return result;
}

export const [PdfFileRProvider, useSetPdfFileR, usePdfFileR] = constate(
  useFile,
  ([, setFile]: ReturnType<typeof useFile>) => setFile,
  ([file]: ReturnType<typeof useFile>) => file
);

export function usePdfParserR() {
  const file = usePdfFileR();
  const { result } = useAsync(getPdfParserInstance, [file]);
  return result;
}

function useIsDiffPagesOnly() {
  return useState(false);
}

export const [IsDiffPagesOnlyProvider, useDiffPagesOnlyState] = constate(
  useIsDiffPagesOnly
);

export function usePagePairs(): PagePair[] | undefined {
  const parserL = usePdfParserL();
  const parserR = usePdfParserR();

  const [pagePairs, setPagePairs] = useState<PagePair[]>();

  useEffect(() => {
    if (!parserL || !parserR) return;
    let pairs: PagePair[] = [];
    setPagePairs(pairs);
    (async () => {
      for await (const r of comparePDFs(parserL, parserR)) {
        pairs = [...pairs, r];
        setPagePairs(pairs);
      }
    })();
  }, [parserL, parserR]);

  const [isDiffPagesOnly] = useDiffPagesOnlyState();
  const filteredPagePairs = useMemo(
    () =>
      isDiffPagesOnly
        ? pagePairs?.filter((pair) => !("score" in pair) || pair.score !== 1)
        : pagePairs,
    [pagePairs, isDiffPagesOnly]
  );

  return filteredPagePairs;
}

function usePages(
  parser: PdfParser | undefined,
  pairedPages: (number | undefined)[] | undefined
): (number | undefined)[] {
  const { result } = useAsync(getPages, [parser, pairedPages]);
  return result ?? [];
}
async function getPages(
  parser: PdfParser | undefined,
  pairedPages: (number | undefined)[] | undefined
) {
  if (!parser) return [];
  if (pairedPages) return pairedPages;
  const doc = await parser.parse();
  const pageNum = doc.numPages;
  return range(1, pageNum + 1);
}
export function usePagesL() {
  const pagePairs = usePagePairs();
  return usePages(
    usePdfParserL(),
    useMemo(() => pagePairs?.map((p) => p.left), [pagePairs])
  );
}
export function usePagesR() {
  const pagePairs = usePagePairs();
  return usePages(
    usePdfParserR(),
    useMemo(() => pagePairs?.map((p) => p.right), [pagePairs])
  );
}
