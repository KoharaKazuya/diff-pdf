import { Form, Grid, View } from "@adobe/react-spectrum";
import React, { ChangeEvent, useEffect, useState } from "react";
import type { PagePair } from "../comparator";
import { comparePDFs } from "../comparator";
import { PdfParser } from "../pdf-parser";
import PdfPreview from "./DiffTool/PdfPreview";
import Image from "./shared/Image";
import { PdfEmptyPage } from "./shared/PdfPage";

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
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    const parser = new PdfParser(file);
    setParser(parser);
  };

  return (
    <>
      <Form>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={createChangeHandler(setParserL)}
        />
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={createChangeHandler(setParserR)}
        />
      </Form>
      <Grid columns={["1fr", "1fr", "1fr"]}>
        {parserL && (
          <PdfPreview
            parser={parserL}
            pairedPages={pagePairs.map((p) => p.left)}
            gridColumnStart={1}
          />
        )}
        {pagePairs.map((pair, i) => (
          <View gridColumnStart="2" gridRowStart={`${i + 1}`}>
            {"diff" in pair ? <Image data={pair.diff} /> : <PdfEmptyPage />}
          </View>
        ))}
        {parserR && (
          <PdfPreview
            parser={parserR}
            pairedPages={pagePairs.map((p) => p.right)}
            gridColumnStart={3}
          />
        )}
      </Grid>
    </>
  );
}
