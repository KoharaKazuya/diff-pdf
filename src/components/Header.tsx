import { Flex, Header as SpectrumHeader, Heading } from "@adobe/react-spectrum";
import Link from "next/link";

export default function Header() {
  return (
    <SpectrumHeader>
      <Flex marginStart="size-200" gap="size-200" alignItems="baseline">
        <Link href="/" style={{ color: "#933", textDecoration: "none" }}>
          <Heading level={1}>Diff PDF</Heading>
        </Link>
        <Link href="/about" style={{ color: "#933", textDecoration: "none" }}>
          About
        </Link>
      </Flex>
    </SpectrumHeader>
  );
}
