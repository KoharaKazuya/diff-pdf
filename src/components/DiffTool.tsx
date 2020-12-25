import type { ReactNode } from "react";
import type { PagePair } from "../comparator";
import {
  usePagePairs,
  usePagesL,
  usePagesR,
  usePdfParserL,
  usePdfParserR,
} from "../features/diff-tool";
import type { PdfParser } from "../pdf-parser";
import GridTable from "./DiffTool/GridTable";
import NoMatch from "./DiffTool/NoMatch";
import PageFrame from "./DiffTool/PageFrame";
import PdfFileForm from "./DiffTool/PdfFileForm";
import PdfPage from "./DiffTool/PdfPage";
import Image from "./Image";

export default function DiffTool() {
  const parserL = usePdfParserL();
  const parserR = usePdfParserR();

  const pagePairs = usePagePairs();

  const pagesL = usePagesL();
  const pagesR = usePagesR();

  return (
    <>
      <PdfFileForm />
      <GridTable
        left={parserPages(parserL, pagesL)}
        center={pairPages(pagePairs, parserL, parserR)}
        right={parserPages(parserR, pagesR)}
      />
    </>
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
  pairs: PagePair[],
  parserL: PdfParser | undefined,
  parserR: PdfParser | undefined
) {
  return pairs.map((pair, i) => (
    <PageFrame key={`${parserL?.id}-${parserR?.id}-${i}`}>
      {"diff" in pair ? (
        <Image data={pair.diff} aria-label="PDF page difference" />
      ) : (
        <NoMatch />
      )}
    </PageFrame>
  ));
}
