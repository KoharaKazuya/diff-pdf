import constate from "constate";
import { useMemo } from "react";
import { useAsync } from "react-async-hook";
import type { PdfParser } from "../pdf-parser";
import { range } from "../utils/range";
import { useFilteredPagePairs } from "./filtered-page-pairs";
import { usePdfParserL, usePdfParserR } from "./pdf-parser";

function useFilteredPages(
  parser: PdfParser | undefined,
  pairedPages: (number | undefined)[] | undefined
): (number | undefined)[] {
  const { result } = useAsync(
    async (
      parser: PdfParser | undefined,
      pairedPages: (number | undefined)[] | undefined
    ) => {
      if (!parser) return [];
      if (pairedPages) return pairedPages;
      const doc = await parser.parse();
      const pageNum = doc.numPages;
      return range(1, pageNum + 1);
    },
    [parser, pairedPages]
  );
  return result ?? [];
}

function usePagesLInner() {
  const pagePairs = useFilteredPagePairs();
  return useFilteredPages(
    usePdfParserL(),
    useMemo(() => pagePairs?.map((p) => p.left), [pagePairs])
  );
}
export const [PagesLProvider, usePagesL] = constate(usePagesLInner);

function usePagesRInner() {
  const pagePairs = useFilteredPagePairs();
  return useFilteredPages(
    usePdfParserR(),
    useMemo(() => pagePairs?.map((p) => p.right), [pagePairs])
  );
}
export const [PagesRProvider, usePagesR] = constate(usePagesRInner);
