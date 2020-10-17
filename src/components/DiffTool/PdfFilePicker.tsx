import { Item, Picker, Text, View } from "@adobe/react-spectrum";
import { Key, useEffect, useReducer, useState } from "react";
import type { PdfFileMeta } from "../../pdf-storage";
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
          <Item key={pdf.id} textValue={`${pdf.name} - ${pdf.registeredAt}`}>
            <Text>{pdf.name}</Text>
            <Text slot="description">{pdf.registeredAt.toLocaleString()}</Text>
          </Item>
        ))}
      </Picker>
    </View>
  );
}

function usePdfSelection(onPick: Props["onPick"]) {
  const [pdfs, setPdfs] = useState<PdfFileMeta[]>([]);
  const [selectedPdfId, setSelectedPdfId] = useState<
    PdfFileMeta["id"] | undefined
  >(undefined);
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

  const onSelectionChange = (key: Key) => {
    const meta = pdfs.find((pdf) => String(pdf.id) === String(key));
    setSelectedPdfId(meta?.id);
    if (meta) storage.get(meta.id).then((file) => onPick?.(file));
  };

  return [pdfs, onAccept, selectedPdfId, onSelectionChange] as const;
}
