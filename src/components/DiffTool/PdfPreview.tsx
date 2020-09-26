import { View } from "@adobe/react-spectrum";
import React, { useEffect, useState } from "react";
import type { PdfParser } from "../../pdf-parser";
import { PdfPage } from "../shared/PdfPage";

type Props = {
  parser: PdfParser;
  pairedPages: (number | undefined)[];
  gridColumnStart: number;
};

export default function PdfPreview({
  parser,
  pairedPages,
  gridColumnStart,
}: Props) {
  const pages = usePages(parser, pairedPages);

  return (
    <>
      {pages.map((p, i) => (
        <View gridColumnStart={`${gridColumnStart}`} gridRowStart={`${i + 1}`}>
          <PdfPage parser={parser} index={p} />
        </View>
      ))}
    </>
  );
}

function usePages(parser: Props["parser"], pairedPages: Props["pairedPages"]) {
  const [pages, setPages] = useState<(number | undefined)[]>([]);

  useEffect(() => {
    parser.parse().then((doc) => {
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
