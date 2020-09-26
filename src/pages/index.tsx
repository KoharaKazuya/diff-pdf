import Head from "next/head";
import React from "react";
import { App } from "../components/app";

export default function Home() {
  return (
    <>
      <Head>
        <title>Diff PDF</title>
      </Head>

      <p>
        2つの PDF
        を画像比較し、差分を強調表示するツールです。比較したい2つのファイルを選択し、しばらく待ってください。このツールでは
        PDF
        の比較は完全にローカルのみで実行し、ファイルをアップロードすることはありません。
      </p>

      <App />
    </>
  );
}
