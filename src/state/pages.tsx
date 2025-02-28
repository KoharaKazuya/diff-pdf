import { createContext, ReactNode, use, useMemo } from "react";
import { useAsync } from "react-async-hook";
import type { PdfParser } from "../pdf-parser";
import { range } from "../utils/range";
import { useFilteredPagePairs } from "./filtered-page-pairs";
import { usePdfParserL, usePdfParserR } from "./pdf-parser";

function useFilteredPages(
  parser: PdfParser | undefined,
  pairedPages: (number | undefined)[] | undefined,
): (number | undefined)[] {
  const { result } = useAsync(
    async (
      parser: PdfParser | undefined,
      pairedPages: (number | undefined)[] | undefined,
    ) => {
      if (!parser) return [];
      if (pairedPages) return pairedPages;
      const doc = await parser.parse();
      const pageNum = doc.numPages;
      return range(1, pageNum + 1);
    },
    [parser, pairedPages],
  );
  return result ?? [];
}

const PagesLContext = createContext<(number | undefined)[]>([]);

export function PagesLProvider({ children }: { children: ReactNode }) {
  const pagePairs = useFilteredPagePairs();
  const filteredPages = useFilteredPages(
    usePdfParserL(),
    useMemo(() => pagePairs?.map((p) => p.left), [pagePairs]),
  );
  return <PagesLContext value={filteredPages}>{children}</PagesLContext>;
}

export function usePagesL() {
  return use(PagesLContext);
}

const PagesRContext = createContext<(number | undefined)[]>([]);

export function PagesRProvider({ children }: { children: ReactNode }) {
  const pagePairs = useFilteredPagePairs();
  const filteredPages = useFilteredPages(
    usePdfParserR(),
    useMemo(() => pagePairs?.map((p) => p.right), [pagePairs]),
  );
  return <PagesRContext value={filteredPages}>{children}</PagesRContext>;
}

export function usePagesR() {
  return use(PagesRContext);
}
