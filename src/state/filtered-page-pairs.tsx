import { createContext, ReactNode, use, useMemo } from "react";
import type { PagePair } from "../comparator";
import { useIsDiffPagesOnlyState } from "./is-diff-pages-only";
import { usePagePairs } from "./page-pairs";

const FilteredPagePairsContext = createContext<PagePair[] | undefined>(undefined);

export function FilteredPagePairsProvider({ children }: { children?: ReactNode }) {
  const pagePairs = usePagePairs();
  const [isDiffPagesOnly] = useIsDiffPagesOnlyState();

  const filteredPagePairs = useMemo(
    () =>
      isDiffPagesOnly
        ? pagePairs?.filter((pair) => !("score" in pair) || pair.score !== 1)
        : pagePairs,
    [pagePairs, isDiffPagesOnly]
  );

  return (
    <FilteredPagePairsContext value={filteredPagePairs}>
      {children}
    </FilteredPagePairsContext>
  );
}

export function useFilteredPagePairs() {
  return use(FilteredPagePairsContext);
}