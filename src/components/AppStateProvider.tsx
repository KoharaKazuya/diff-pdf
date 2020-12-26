import type { ReactNode } from "react";
import {
  IsDiffPagesOnlyProvider,
  PdfFileLProvider,
  PdfFileRProvider,
} from "../features/diff-tool";
import { PdfStorageProvider } from "../features/pdf-storage";

type Props = {
  children: ReactNode;
};

export default function AppStateProvider({ children }: Props) {
  return (
    <PdfStorageProvider>
      <PdfFileLProvider>
        <PdfFileRProvider>
          <IsDiffPagesOnlyProvider>{children}</IsDiffPagesOnlyProvider>
        </PdfFileRProvider>
      </PdfFileLProvider>
    </PdfStorageProvider>
  );
}
