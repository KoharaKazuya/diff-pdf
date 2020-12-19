import { View } from "@adobe/react-spectrum";

export default function About() {
  return (
    <View padding="size-200">
      2つの PDF
      を画像比較し、差分を強調表示するツールです。比較したい2つのファイルを選択し、しばらく待ってください。このツールでは
      PDF
      の比較は完全にローカルのみで実行し、ファイルをアップロードすることはありません。
    </View>
  );
}
