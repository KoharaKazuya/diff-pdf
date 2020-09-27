import { Text } from "@adobe/react-spectrum";
import React, { useEffect, useState } from "react";
import type { PdfParser } from "../../pdf-parser";
import Centerize from "../shared/Centerize";
import Image from "../shared/Image";

type Props = {
  parser: PdfParser;
  index: number;
};

export function PdfPage({ parser, index }: Props) {
  const [image, setImage] = useState<ImageData>();

  useEffect(() => {
    parser
      .parse()
      .then((doc) => doc.getPage(index))
      .then((page) => page.render())
      .then((image) => setImage(image));
  }, [parser, index]);

  return (
    <Centerize>
      {image ? <Image data={image} /> : <Text>Loading...</Text>}
    </Centerize>
  );
}
