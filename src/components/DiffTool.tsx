import { Form, Grid } from "@adobe/react-spectrum";
import React, { useEffect, useMemo, useState } from "react";
import type { PagePair } from "../comparator";
import { comparePDFs } from "../comparator";
import { PdfParser } from "../pdf-parser";
import GridStack from "./DiffTool/GridStack";
import InputFile from "./DiffTool/InputFile";
import NoMatch from "./DiffTool/NoMatch";
import { PdfPage } from "./DiffTool/PdfPage";
import Centerize from "./shared/Centerize";
import Image from "./shared/Image";

export default function DiffTool() {
  const [parserL, setParserL] = useState<PdfParser>();
  const [parserR, setParserR] = useState<PdfParser>();

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

  const createChangeHandler = (setParser: (parser: PdfParser) => void) => (
    files: File[]
  ) => {
    if (files.length === 0) return;
    const file = files[0];

    const parser = new PdfParser(file);
    setParser(parser);
  };

  const pagesL = usePages(
    parserL,
    useMemo(() => pagePairs.map((p) => p.left), [pagePairs])
  );
  const pagesR = usePages(
    parserR,
    useMemo(() => pagePairs.map((p) => p.right), [pagePairs])
  );

  return (
    <>
      <Form>
        <Grid columns={["1fr", "1fr"]}>
          <InputFile
            accept=".pdf,application/pdf"
            onAccept={createChangeHandler(setParserL)}
          />
          <InputFile
            accept=".pdf,application/pdf"
            onAccept={createChangeHandler(setParserR)}
          />
        </Grid>
      </Form>
      <Grid columns={["1fr", "1fr", "1fr"]}>
        <GridStack gridColumnStart="1">
          {parserL &&
            pagesL.map((p, i) =>
              p !== undefined ? (
                <PdfPage
                  key={`${parserL.id}-p${p}`}
                  parser={parserL}
                  index={p}
                />
              ) : (
                <NoMatch key={`${parserL.id}-undefined${i}`} />
              )
            )}
        </GridStack>
        <GridStack gridColumnStart="2">
          {pagePairs.map((pair, i) =>
            "diff" in pair ? (
              <Centerize key={`${parserL?.id}-${parserR?.id}-${i}`}>
                <Image data={pair.diff} />
              </Centerize>
            ) : (
              <NoMatch key={`${parserL?.id}-${parserR?.id}-${i}`} />
            )
          )}
        </GridStack>
        <GridStack gridColumnStart="3">
          {parserR &&
            pagesR.map((p, i) =>
              p !== undefined ? (
                <PdfPage
                  key={`${parserR.id}-p${p}`}
                  parser={parserR}
                  index={p}
                />
              ) : (
                <NoMatch key={`${parserR.id}-undefined${i}`} />
              )
            )}
        </GridStack>
      </Grid>
    </>
  );
}

function usePages(
  parser: PdfParser | undefined,
  pairedPages: (number | undefined)[]
) {
  const [pages, setPages] = useState<(number | undefined)[]>([]);

  useEffect(() => {
    parser?.parse().then((doc) => {
      const maxPairedPage = pairedPages.reduce<number>(
        (m, p) => (p ? Math.max(m, p) : m),
        -Infinity
      );

      const restPages = Array.from(
        { length: doc.numPages },
        (_, i) => i + 1
      ).filter((p) => p > maxPairedPage);

      setPages([...pairedPages, ...restPages]);
    });
  }, [parser, pairedPages]);

  return pages;
}
