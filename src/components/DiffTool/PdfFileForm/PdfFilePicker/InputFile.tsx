import { Flex, Text } from "@adobe/react-spectrum";
import FileAdd from "@spectrum-icons/workflow/FileAdd";
import type { InputHTMLAttributes } from "react";
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
      <Flex
        height="size-6000"
        alignItems="center"
        justifyContent="center"
        margin="size-100"
      >
        <FileAdd flex="0 0 auto" />
        <Text marginStart="size-50">
          {isDragActive
            ? "ここにファイルをドロップ"
            : "ここにファイルをドラッグ＆ドロップするか、クリックしてファイルを選択してください"}
        </Text>
      </Flex>
    </div>
  );
}
