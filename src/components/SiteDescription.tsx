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
          サポートしているブラウザは Chrome, Firefox の最新版です。
          それ以外のブラウザでは動かない可能性があります。
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
