import { createContext, use, useState } from "react";

function usePdfFileStateInner(): [File | undefined, (file: File) => void] {
  return useState<File>();
}

const PdfFileLContext = createContext<File | undefined>(undefined);
const SetPdfFileLContext = createContext<(file: File) => void>(() => {});

export function PdfFileLStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [file, setFile] = useState<File>();
  return (
    <PdfFileLContext value={file}>
      <SetPdfFileLContext value={setFile}>{children}</SetPdfFileLContext>
    </PdfFileLContext>
  );
}

export function usePdfFileL() {
  return use(PdfFileLContext);
}
export function useSetPdfFileL() {
  return use(SetPdfFileLContext);
}

const PdfFileRContext = createContext<File | undefined>(undefined);
const SetPdfFileRContext = createContext<(file: File) => void>(() => {});

export function PdfFileRStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [file, setFile] = usePdfFileStateInner();
  return (
    <PdfFileRContext value={file}>
      <SetPdfFileRContext value={setFile}>{children}</SetPdfFileRContext>
    </PdfFileRContext>
  );
}

export function usePdfFileR() {
  return use(PdfFileRContext);
}
export function useSetPdfFileR() {
  return use(SetPdfFileRContext);
}
