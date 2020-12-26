import type { ReactNode } from "react";
import Centerize from "../Centerize";

type Props = {
  children: ReactNode;
  label?: ReactNode;
  frameColor?: "green" | "red" | "gray";
};

export default function PageFrame({
  children,
  label,
  frameColor = "gray",
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: `solid 1px var(--spectrum-global-color-${frameColor}-700)`,
        position: "relative",
      }}
    >
      {label && (
        <PageFrameLabel frameColor={frameColor}>{label}</PageFrameLabel>
      )}
      <Centerize>{children}</Centerize>
    </div>
  );
}

function PageFrameLabel({
  children,
  frameColor,
}: {
  children: ReactNode;
  frameColor: Props["frameColor"];
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        background: `var(--spectrum-global-color-${frameColor}-700)`,
        color: "#fff",
        padding: "0 4px",
      }}
    >
      {children}
    </div>
  );
}
