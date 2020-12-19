import Head from "next/head";
import DiffTool from "../components/DiffTool";

export default function Home() {
  return (
    <>
      <Head>
        <title>Diff PDF</title>
      </Head>
      <DiffTool />
    </>
  );
}
