import { Text } from "@adobe/react-spectrum";
import React, { InputHTMLAttributes } from "react";
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
      {isDragActive ? (
        <Text>Drop the files here ...</Text>
      ) : (
        <Text>Drag 'n' drop some files here, or click to select files</Text>
      )}
    </div>
  );
}
