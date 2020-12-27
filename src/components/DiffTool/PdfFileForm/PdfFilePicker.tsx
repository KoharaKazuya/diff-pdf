import { Item, Picker, Text, View } from "@adobe/react-spectrum";
import { Key, useEffect, useState } from "react";
import { useAsync } from "react-async-hook";
import type { PdfFileMeta, Storage } from "../../../browser-storage";
import { useBrowserStorage } from "../../../features/browser-storage";
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
  const storage = useBrowserStorage();

  const onAccept = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    onPick?.(file);
    storage?.addPdfFile(file).then((id) => {
      setSelectedPdfId(id);
    });
  };

  const pdfs = usePDFs();
  const onSelectionChange = (key: Key) => {
    const meta = pdfs?.find((pdf) => String(pdf.id) === String(key));
    setSelectedPdfId(meta?.id);
    if (meta) storage?.getPdfFile(meta.id).then((file) => onPick?.(file));
  };

  return [pdfs, onAccept, selectedPdfId, onSelectionChange] as const;
}

function usePDFs() {
  const storage = useBrowserStorage();

  const { result, execute } = useAsync(getPDFs, [storage]);

  useEffect(
    () =>
      storage?.onChangePdf(() => {
        execute(storage);
      }),
    [storage]
  );

  return result;
}

async function getPDFs(storage: Storage | undefined) {
  if (!storage) return;
  const metas = await storage.getAllPdfFiles();
  metas.reverse();
  return metas;
}
