import constate from "constate";
import { useMemo } from "react";
import type { PagePair } from "../comparator";
import { useIsDiffPagesOnlyState } from "./is-diff-pages-only";
import { usePagePairs } from "./page-pairs";

function useFilteredPagePairsInner(): PagePair[] | undefined {
  const pagePairs = usePagePairs();
  const [isDiffPagesOnly] = useIsDiffPagesOnlyState();

  const filteredPagePairs = useMemo(
    () =>
      isDiffPagesOnly
        ? pagePairs?.filter((pair) => !("score" in pair) || pair.score !== 1)
        : pagePairs,
    [pagePairs, isDiffPagesOnly]
  );

  return filteredPagePairs;
}
export const [FilteredPagePairsProvider, useFilteredPagePairs] = constate(
  useFilteredPagePairsInner
);
