import type { ReactNode } from "react";
import type { PagePair } from "../../comparator";
import type { PdfParser } from "../../pdf-parser";
import { useFilteredPagePairs } from "../../state/filtered-page-pairs";
import { usePagesL, usePagesR } from "../../state/pages";
import { usePdfParserL, usePdfParserR } from "../../state/pdf-parser";
import Image from "../Image";
import GridTable from "./ComparisonResult/GridTable";
import NoMatch from "./ComparisonResult/NoMatch";
import PageFrame from "./ComparisonResult/PageFrame";
import PdfPage from "./ComparisonResult/PdfPage";

export default function ComparisonResult() {
  const parserL = usePdfParserL();
  const parserR = usePdfParserR();

  const pagePairs = useFilteredPagePairs();

  const pagesL = usePagesL();
  const pagesR = usePagesR();

  return (
    <GridTable
      left={parserPages(parserL, pagesL)}
      center={pairPages(pagePairs, parserL, parserR)}
      right={parserPages(parserR, pagesR)}
    />
  );
}

function parserPages(
  parser: PdfParser | undefined,
  pages: (number | undefined)[]
): ReactNode[] | undefined {
  if (!parser) return;
  return pages.map((p, i) =>
    p !== undefined ? (
      <PageFrame key={`${parser.id}-p${p}`} label={p}>
        <PdfPage parser={parser} index={p} />
      </PageFrame>
    ) : (
      <PageFrame key={`${parser.id}-undefined${i}`}>
        <NoMatch />
      </PageFrame>
    )
  );
}

function pairPages(
  pairs: PagePair[] | undefined,
  parserL: PdfParser | undefined,
  parserR: PdfParser | undefined
) {
  return (pairs ?? []).map((pair, i) => {
    const label =
      "score" in pair ? (pair.score === 1 ? "一致" : "差分") : undefined;
    return (
      <PageFrame
        key={`${parserL?.id}-${parserR?.id}-${i}`}
        label={label}
        frameColor={
          label === "一致" ? "green" : label === "差分" ? "red" : "gray"
        }
      >
        {"diff" in pair ? (
          <Image data={pair.diff} aria-label="PDF page difference" />
        ) : (
          <NoMatch />
        )}
      </PageFrame>
    );
  });
}
