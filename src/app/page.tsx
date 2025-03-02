"use client";

import Head from "next/head";
import DiffTool from "../components/DiffTool";
import QuickTourDialog from "../components/QuickTourDialog";

export default function Home() {
  return (
    <>
      <Head>
        <title>Diff PDF</title>
      </Head>
      <DiffTool />
      <QuickTourDialog />
    </>
  );
}
