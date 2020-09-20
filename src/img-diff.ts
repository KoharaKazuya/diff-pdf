const worker = new Worker("./img-diff.worker", { type: "module" });

export type ImgDiffResult =
  | {
      /** 類似度 (0: 完全不一致, 1: 完全一致) */
      score: 0;
    }
  | {
      /** 類似度 (0: 完全不一致, 1: 完全一致) */
      score: number;
      /** 差がある部分を強調した画像 */
      diff: ImageData;
    };

/**
 * 比較して類似度を計算する
 * @return 類似度 (0: 完全不一致, 1: 完全一致)
 */
export function imgDiff(
  img1: ImageData,
  img2: ImageData
): Promise<ImgDiffResult> {
  const id = Math.floor(Math.random() * 2 ** 50);

  worker.postMessage({ id, type: "imgDiff", payload: { img1, img2 } });

  return new Promise((resolve) => {
    worker.addEventListener("message", function listener(event) {
      const { id: rId, type, payload } = event.data;
      if (rId === id && type === "imgDiff") {
        resolve(payload);
        worker.removeEventListener("message", listener);
      }
    });
  });
}
