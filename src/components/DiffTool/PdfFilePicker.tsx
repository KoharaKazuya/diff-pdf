import { Item, Picker, Text, View } from "@adobe/react-spectrum";
import React, { useEffect, useReducer, useState } from "react";
import type { Pdf } from "../../pdf-storage";
import InputFile from "./InputFile";
import { usePdfStorageContext } from "./PdfStorageProvider";

type Props = {
  onPick?: (file: File) => void;
};

export default function PdfFilePicker({ onPick }: Props) {
  const [pdfs, onAccept, selectedPdfId, onSelectionChange] = usePdfSelection(
    onPick
  );

  return (
    <View>
      <InputFile accept=".pdf,application/pdf" onAccept={onAccept} />
      <Picker
        label="以前に使用したファイルを選択"
        selectedKey={selectedPdfId}
        onSelectionChange={onSelectionChange}
      >
        {pdfs.map((pdf) => (
          <Item
            key={pdf.id}
            textValue={`${pdf.file.name} - ${pdf.registeredAt}`}
          >
            <Text>{pdf.file.name}</Text>
            <Text slot="description">{pdf.registeredAt.toLocaleString()}</Text>
          </Item>
        ))}
      </Picker>
    </View>
  );
}

function usePdfSelection(onPick: Props["onPick"]) {
  const [pdfs, setPdfs] = useState<Pdf[]>([]);
  const [selectedPdfId, setSelectedPdfId] = useState<Pdf["id"] | undefined>(
    undefined
  );
  const [updator, forceUpdate] = useReducer((s) => s + 1, 0);
  const storage = usePdfStorageContext();

  useEffect(() => {
    storage.getAll().then((pdfs) => setPdfs(pdfs));
  }, [storage, updator]);

  const onAccept = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    onPick?.(file);
    storage.add(file).then((id) => {
      setSelectedPdfId(id);
      forceUpdate();
    });
  };

  const onSelectionChange = (key: unknown) => {
    const selectedPdf = pdfs.find((pdf) => pdf.id === key);
    setSelectedPdfId(selectedPdf?.id);
    if (selectedPdf) onPick?.(selectedPdf.file);
  };

  return [pdfs, onAccept, selectedPdfId, onSelectionChange] as const;
}
