import React, { useEffect, useRef } from "react";

type Props = {
  data: ImageData;
  "aria-label"?: string;
};

export default function Image({ data, "aria-label": ariaLabel }: Props) {
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
      style={{ display: "block", maxWidth: "100%" }}
      aria-label={ariaLabel}
    />
  );
}
