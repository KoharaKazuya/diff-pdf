import { createContext, ReactNode, useContext, useMemo } from "react";
import { PdfStorage } from "../../pdf-storage";

const PdfStorageContext = createContext<PdfStorage | undefined>(undefined);

type Props = {
  children?: ReactNode;
};

export default function PdfStorageProvider({ children }: Props) {
  const storage = useMemo(() => new PdfStorage(), []);

  return (
    <PdfStorageContext.Provider value={storage}>
      {children}
    </PdfStorageContext.Provider>
  );
}

export function usePdfStorageContext() {
  const storage = useContext(PdfStorageContext);
  if (!storage)
    throw new Error(
      "usePdfStorageContext を使うには上位のコンポーネントを <PdfStorageProvider> 要素でラップする必要があります"
    );
  return storage;
}
