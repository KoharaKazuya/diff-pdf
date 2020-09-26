import { View } from "@adobe/react-spectrum";
import React, { useEffect, useState } from "react";
import type { PdfParser } from "../../pdf-parser";
import Image from "./Image";

type Props = {
  parser: PdfParser;
  index?: number;
};

export function PdfPage({ parser, index }: Props) {
  const [image, setImage] = useState<ImageData>();

  useEffect(() => {
    if (index === undefined) {
      setImage(undefined);
    } else {
      parser
        .parse()
        .then((doc) => doc.getPage(index))
        .then((page) => page.render())
        .then((image) => setImage(image));
    }
  }, [parser, index]);

  if (!image) return <PdfEmptyPage />;
  return <Image data={image} />;
}

export function PdfEmptyPage() {
  return <View>Empty</View>;
}
