import { Item, Picker, Text, View } from "@adobe/react-spectrum";
import { Key, useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import { usePdfStorage } from "../../../features/pdf-storage";
import type { PdfFileMeta, PdfStorage } from "../../../pdf-storage";
import InputFile from "./PdfFilePicker/InputFile";

type Props = {
  onPick?: (file: File) => void;
};

export default function PdfFilePicker({ onPick }: Props) {
  const [pdfs, onAccept, selectedPdfId, onSelectionChange] = usePdfSelection(
    onPick
  );

  return (
    <View>
      <Picker
        label="ファイルを選択"
        items={pdfs ?? []}
        isLoading={!pdfs}
        selectedKey={String(selectedPdfId)}
        onSelectionChange={onSelectionChange}
        margin="size-100"
      >
        {(pdf) => (
          <Item key={pdf.id} textValue={`${pdf.name} - ${pdf.registeredAt}`}>
            <Text>{pdf.name}</Text>
            <Text slot="description">{pdf.registeredAt.toLocaleString()}</Text>
          </Item>
        )}
      </Picker>
      <InputFile accept=".pdf,application/pdf" onAccept={onAccept} />
    </View>
  );
}

function usePdfSelection(onPick: Props["onPick"]) {
  const [selectedPdfId, setSelectedPdfId] = useState<PdfFileMeta["id"]>();
  const storage = usePdfStorage();

  const onAccept = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    onPick?.(file);
    storage.add(file).then((id) => {
      setSelectedPdfId(id);
    });
  };

  const pdfs = usePDFs();
  const onSelectionChange = (key: Key) => {
    const meta = pdfs?.find((pdf) => String(pdf.id) === String(key));
    setSelectedPdfId(meta?.id);
    if (meta) storage.get(meta.id).then((file) => onPick?.(file));
  };

  return [pdfs, onAccept, selectedPdfId, onSelectionChange] as const;
}

function usePDFs() {
  const storage = usePdfStorage();

  const { result, execute } = useAsync(getPDFs, [storage]);

  useEffect(
    () =>
      storage.onChange(() => {
        execute(storage);
      }),
    [storage]
  );

  return result;
}

async function getPDFs(storage: PdfStorage) {
  return await storage.getAll();
}
