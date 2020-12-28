import constate from "constate";
import { useEffect, useState } from "react";
import { comparePDFs, PagePair } from "../comparator";
import { usePdfParserL, usePdfParserR } from "./pdf-parser";

function usePagePairsInner(): PagePair[] | undefined {
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
        "PDF の比較に失敗しました。不正な PDF が選択された可能性があります。"
      );
    });
  }, [parserL, parserR]);

  return pagePairs;
}
export const [PagePairsProvider, usePagePairs] = constate(usePagePairsInner);
