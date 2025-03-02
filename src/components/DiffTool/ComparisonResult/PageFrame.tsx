import { usePress } from "@react-aria/interactions";
import dynamic from "next/dynamic";
import { useState } from "react";
import Centerize from "../../Centerize";

const LazyImageDialog = dynamic(
  () => import(/* webpackPrefetch: true */ "./PageFrame/ImageDialog"),
  { ssr: false },
);

type Props = {
  children: (opts: { inDialog: boolean }) => React.ReactNode;
  label?: React.ReactNode;
  frameColor?: "green" | "red" | "gray";
};

export default function PageFrame({
  children,
  label,
  frameColor = "gray",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <PressableFrame
        onPress={() => setIsOpen((s) => !s)}
        frameColor={frameColor}
      >
        {label && (
          <PageFrameLabel frameColor={frameColor}>{label}</PageFrameLabel>
        )}
        <Centerize>{children({ inDialog: false })}</Centerize>
      </PressableFrame>
      <LazyImageDialog isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        {children({ inDialog: true })}
      </LazyImageDialog>
    </>
  );
}

function PressableFrame({
  onPress,
  children,
  frameColor,
}: {
  onPress: () => void;
  children: React.ReactNode;
  frameColor: Props["frameColor"];
}) {
  const { pressProps } = usePress({ onPress });
  return (
    <div
      {...pressProps}
      style={{
        width: "100%",
        height: "100%",
        border: `solid 1px var(--spectrum-global-color-${frameColor}-700)`,
        position: "relative",
      }}
    >
      {children}
    </div>
  );
}

function PageFrameLabel({
  children,
  frameColor,
}: {
  children: React.ReactNode;
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
