import { createContext, use } from "react";
import { useAsync } from "react-async-hook";
import { PdfParser } from "../pdf-parser";
import { usePdfFileL, usePdfFileR } from "./pdf-file";

const PdfParserLContext = createContext<PdfParser | undefined>(undefined);

export function PdfParserLProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const file = usePdfFileL();
  const { result } = useAsync(getPdfParserInstance, [file]);
  return <PdfParserLContext value={result}>{children}</PdfParserLContext>;
}

export function usePdfParserL() {
  return use(PdfParserLContext);
}

const PdfParserRContext = createContext<PdfParser | undefined>(undefined);

export function PdfParserRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const file = usePdfFileR();
  const { result } = useAsync(getPdfParserInstance, [file]);
  return <PdfParserRContext value={result}>{children}</PdfParserRContext>;
}

export function usePdfParserR() {
  return use(PdfParserRContext);
}

let pdfParserModule: Promise<typeof import("../pdf-parser")> | undefined;
function fetchPdfParserModule() {
  if (!pdfParserModule)
    pdfParserModule = import(/* webpackPrefetch: true */ "../pdf-parser");
  return pdfParserModule;
}
async function getPdfParserInstance(file: File | undefined) {
  if (!file) return;
  const { PdfParser } = await fetchPdfParserModule();
  return new PdfParser(file);
}
