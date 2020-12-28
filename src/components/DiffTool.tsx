import dynamic from "next/dynamic";
import DiffPagesOnlySwitch from "./DiffTool/DiffPagesOnlySwitch";
import PdfFileForm from "./DiffTool/PdfFileForm";

const LazyComparisonResult = dynamic(
  () => import(/* webpackPrefetch: true */ "./DiffTool/ComparisonResult"),
  { ssr: false }
);

export default function DiffTool() {
  return (
    <>
      <PdfFileForm />
      <DiffPagesOnlySwitch />
      <LazyComparisonResult />
    </>
  );
}
