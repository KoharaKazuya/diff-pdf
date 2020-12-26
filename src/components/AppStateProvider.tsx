import type { ReactNode } from "react";
import { BrowserStorageProvider } from "../features/browser-storage";
import {
  IsDiffPagesOnlyProvider,
  PdfFileLProvider,
  PdfFileRProvider,
} from "../features/diff-tool";
import { UserSettingsProvider } from "../features/user-settings";

type Props = {
  children: ReactNode;
};

export default function AppStateProvider({ children }: Props) {
  return (
    <BrowserStorageProvider>
      <UserSettingsProvider>
        <PdfFileLProvider>
          <PdfFileRProvider>
            <IsDiffPagesOnlyProvider>{children}</IsDiffPagesOnlyProvider>
          </PdfFileRProvider>
        </PdfFileLProvider>
      </UserSettingsProvider>
    </BrowserStorageProvider>
  );
}
