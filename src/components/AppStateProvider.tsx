import type { FC } from "react";
import { StorageProvider } from "../state/browser-storage";
import { FilteredPagePairsProvider } from "../state/filtered-page-pairs";
import { IsDiffPagesOnlyStateProvider } from "../state/is-diff-pages-only";
import { PagePairsProvider } from "../state/page-pairs";
import { PagesLProvider, PagesRProvider } from "../state/pages";
import {
  PdfFileLStateProvider,
  PdfFileRStateProvider,
} from "../state/pdf-file";
import { PdfFileMetasProvider } from "../state/pdf-file-metas";
import { PdfParserLProvider, PdfParserRProvider } from "../state/pdf-parser";
import { UserSettingsStateProvider } from "../state/user-settings";

const STATE_PROVIDERS: FC<{ children: React.ReactNode }>[] = [
  StorageProvider,
  UserSettingsStateProvider,
  PdfFileMetasProvider,
  PdfFileLStateProvider,
  PdfFileRStateProvider,
  PdfParserLProvider,
  PdfParserRProvider,
  IsDiffPagesOnlyStateProvider,
  PagePairsProvider,
  FilteredPagePairsProvider,
  PagesLProvider,
  PagesRProvider,
].reverse();

type Props = {
  children: React.ReactNode;
};

export default function AppStateProvider({ children }: Props) {
  let element = children;
  for (const StateProvider of STATE_PROVIDERS) {
    element = <StateProvider>{element}</StateProvider>;
  }
  return element;
}
