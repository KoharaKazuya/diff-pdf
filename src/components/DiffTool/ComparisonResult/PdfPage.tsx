import { Text } from "@adobe/react-spectrum";
import { useAsync } from "react-async-hook";
import type { PdfParser } from "../../../pdf-parser";
import Image from "../../Image";

type Props = {
  parser: PdfParser;
  index: number;
};

export default function PdfPage({ parser, index }: Props) {
  const { result: image } = useAsync(
    async (parser: PdfParser, index: number) => {
      const doc = await parser.parse();
      const page = await doc.getPage(index);
      const image = await page.render();
      return image;
    },
    [parser, index],
  );

  return image ? (
    <Image data={image} aria-label={`PDF page ${index}`} />
  ) : (
    <Text>Loading...</Text>
  );
}
