import constate from "constate";
import { useState } from "react";

function useIsDiffPagesOnlyStateInner() {
  return useState(false);
}
export const [IsDiffPagesOnlyStateProvider, useIsDiffPagesOnlyState] = constate(
  useIsDiffPagesOnlyStateInner
);
