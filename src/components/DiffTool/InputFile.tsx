import { Text, View } from "@adobe/react-spectrum";
import FileAdd from "@spectrum-icons/workflow/FileAdd";
import { InputHTMLAttributes } from "react";
import { useDropzone } from "react-dropzone";

type Props = Pick<InputHTMLAttributes<HTMLInputElement>, "accept"> & {
  onAccept?: (files: File[]) => void;
};

export default function InputFile({ accept, onAccept }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onAccept,
  });

  return (
    <div {...getRootProps()}>
      <input accept={accept} {...getInputProps()} />
      <View padding="size-100">
        <FileAdd />
        <Text marginStart="size-50">
          {isDragActive
            ? "ここにファイルをドロップ"
            : "ここにファイルをドラッグ＆ドロップするか、クリックしてファイルを選択してください"}
        </Text>
      </View>
    </div>
  );
}
