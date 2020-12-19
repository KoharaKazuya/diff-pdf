import { Flex, Header as SpectrumHeader, Heading } from "@adobe/react-spectrum";
import Link from "next/link";

export default function Header() {
  return (
    <SpectrumHeader>
      <Flex marginStart="size-200" gap="size-200" alignItems="baseline">
        <Link href="/">
          <a>
            <Heading level={1}>Diff PDF</Heading>
          </a>
        </Link>
        <Link href="/about">
          <a>About</a>
        </Link>
      </Flex>
    </SpectrumHeader>
  );
}
