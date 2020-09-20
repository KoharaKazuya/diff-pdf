/// <reference lib="webworker" />

import pixelmatch from "pixelmatch";
import type { ImgDiffResult } from "./img-diff";

async function imgDiff(
  img1: ImageData,
  img2: ImageData
): Promise<ImgDiffResult> {
  const { width, height } = img1;
  if (width !== img2.width || height !== img2.height) return { score: 0 };

  const diffData = new Uint8Array(width * height * 4);
  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diffData,
    width,
    height
  );

  return {
    score: 1 - numDiffPixels / (width * height),
    diff: new ImageData(new Uint8ClampedArray(diffData), width, height),
  };
}

self.addEventListener("message", (event) => {
  const { id, type, payload } = event.data;
  switch (type) {
    case "imgDiff": {
      imgDiff(payload.img1, payload.img2).then((r) =>
        self.postMessage({ id, type, payload: r })
      );
    }
  }
});
