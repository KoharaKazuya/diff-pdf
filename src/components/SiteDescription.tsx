import { Heading } from "@adobe/react-spectrum";

export default function SiteDescription() {
  return (
    <>
      <section>
        <Heading level={3}>使い方</Heading>
        <p>
          このサイトは2つの PDF
          を画像比較し、差分を強調表示します。比較したい2つのファイルを選択し、しばらく待ってください。
        </p>
      </section>
      <section>
        <Heading level={3}>プライバシー</Heading>
        <p>
          このサイトでは PDF
          の比較は完全にローカルのみで実行し、ファイルをアップロードすることはありません。
        </p>
      </section>
      <section>
        <Heading level={3}>対応ブラウザ</Heading>
        <p>
          サポートしているブラウザはデスクトップの Chrome, Firefox, Safari, Edge
          の最新版です。 それ以外のブラウザでは不具合が発生する場合があります。
        </p>
      </section>
      <section>
        <Heading level={3}>オフライン利用</Heading>
        <p>
          デスクトップの Chrome および Edge
          を使用している場合、このサイトをアプリとしてインストールすることで全ての機能をオフラインで利用することができます
          (詳細:
          <a
            href="https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DDesktop&hl=ja"
            target="_blank"
          >
            Chrome
          </a>
          ,{" "}
          <a
            href="https://www.windows10info.net/edge/chromium_edge_instsite.html"
            target="_blank"
          >
            Edge
          </a>
          )。
        </p>
      </section>
      <section>
        <Heading level={3}>ライセンス</Heading>
        <p>
          ソースコード:{" "}
          <a href="https://github.com/KoharaKazuya/diff-pdf" target="_blank">
            GitHub
          </a>
          , 不具合報告:{" "}
          <a
            href="https://github.com/KoharaKazuya/diff-pdf/issues"
            target="_blank"
          >
            GitHub Issues
          </a>
        </p>
        <p>© 2021 KoharaKazuya.</p>
      </section>
    </>
  );
}
