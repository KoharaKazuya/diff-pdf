import constate from "constate";
import { useAsync } from "react-async-hook";
import { usePdfFileL, usePdfFileR } from "./pdf-file";

function usePdfParserLInner() {
  const file = usePdfFileL();
  const { result } = useAsync(getPdfParserInstance, [file]);
  return result;
}
export const [PdfParserLProvider, usePdfParserL] = constate(usePdfParserLInner);

function usePdfParserRInner() {
  const file = usePdfFileR();
  const { result } = useAsync(getPdfParserInstance, [file]);
  return result;
}
export const [PdfParserRProvider, usePdfParserR] = constate(usePdfParserRInner);

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
