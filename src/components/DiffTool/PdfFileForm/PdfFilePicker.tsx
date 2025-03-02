import { Item, Picker, Text, View } from "@adobe/react-spectrum";
import { Key, useState } from "react";
import type { PdfFileMeta } from "../../../browser-storage";
import { useStorage } from "../../../state/browser-storage";
import { usePdfFileMetas } from "../../../state/pdf-file-metas";
import InputFile from "./PdfFilePicker/InputFile";

type Props = {
  onPick?: (file: File) => void;
};

export default function PdfFilePicker({ onPick }: Props) {
  const [metas, onAccept, selectedPdfId, onSelectionChange] =
    usePdfSelection(onPick);

  return (
    <View>
      <Picker
        label="ファイルを選択"
        items={metas ?? []}
        isLoading={!metas}
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
      <InputFile onAccept={onAccept} />
    </View>
  );
}

function usePdfSelection(onPick: Props["onPick"]) {
  const [selectedPdfId, setSelectedPdfId] = useState<PdfFileMeta["id"]>();
  const storage = useStorage();

  const onAccept = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    onPick?.(file);
    storage?.addPdfFile(file).then((id) => {
      setSelectedPdfId(id);
    });
  };

  const metas = usePdfFileMetas();
  const onSelectionChange = (key: Key) => {
    const meta = metas?.find((pdf) => String(pdf.id) === String(key));
    setSelectedPdfId(meta?.id);
    if (meta) storage?.getPdfFile(meta.id).then((file) => onPick?.(file));
  };

  return [metas, onAccept, selectedPdfId, onSelectionChange] as const;
}
