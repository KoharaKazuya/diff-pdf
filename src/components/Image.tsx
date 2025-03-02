import { useEffect, useRef } from "react";

type Props = {
  data: ImageData;
  fit?: boolean;
  "aria-label"?: string;
};

export default function Image({ data, fit, "aria-label": ariaLabel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("cannot get canvas 2d context");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(data, 0, 0);
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={data.width}
      height={data.height}
      style={{
        display: "block",
        maxWidth: fit ? "min(100%, calc(100svw - 160px))" : "100%",
        maxHeight: fit ? "min(100%, calc(100svh - 160px))" : "100%",
        width: fit ? "100%" : undefined,
        height: fit ? "100%" : undefined,
        objectFit: "contain",
      }}
      aria-label={ariaLabel}
    />
  );
}
