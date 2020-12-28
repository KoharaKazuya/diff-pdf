import Head from "next/head";
import About from "../components/About";

export default function Home() {
  return (
    <>
      <Head>
        <title>このサイトについて - Diff PDF</title>
      </Head>
      <About />
    </>
  );
}
