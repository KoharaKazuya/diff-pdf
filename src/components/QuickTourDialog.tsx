import dynamic from "next/dynamic";
import { useQuickTourCompleted } from "../features/user-settings";

const LazyDialog = dynamic(
  () => import("./DiffTool/QuickTourDialog/BrowserContextNeeded"),
  { ssr: false }
);

export default function QuickTourDialog() {
  const completed = useQuickTourCompleted();
  return completed ? null : <LazyDialog />;
}
