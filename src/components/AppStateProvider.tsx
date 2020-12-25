import type { ReactNode } from "react";
import { PdfFileLProvider, PdfFileRProvider } from "../features/diff-tool";
import { PdfStorageProvider } from "../features/pdf-storage";

type Props = {
  children: ReactNode;
};

export default function AppStateProvider({ children }: Props) {
  return (
    <PdfStorageProvider>
      <PdfFileLProvider>
        <PdfFileRProvider>{children}</PdfFileRProvider>
      </PdfFileLProvider>
    </PdfStorageProvider>
  );
}
