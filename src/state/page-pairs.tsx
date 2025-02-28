import { createContext, ReactNode, use, useEffect, useState } from "react";
import { comparePDFs, PagePair } from "../comparator";
import { usePdfParserL, usePdfParserR } from "./pdf-parser";

const PagePiarsContext = createContext<PagePair[] | undefined>(undefined);

export function PagePairsProvider({ children }: { children: ReactNode }) {
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
    })().catch((e) => {
      console.warn(e);
      alert(
        "PDF の比較に失敗しました。不正な PDF が選択された可能性があります。",
      );
    });
  }, [parserL, parserR]);

  return <PagePiarsContext value={pagePairs}>{children}</PagePiarsContext>;
}

export function usePagePairs() {
  return use(PagePiarsContext);
}
