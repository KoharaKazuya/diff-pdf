import { wrap } from "funcable";
import type { Exposed } from "./img-diff.worker";

let worker: Exposed;

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
  img2: ImageData,
): Promise<ImgDiffResult> {
  if (!worker)
    worker = wrap(new Worker(new URL("./img-diff.worker", import.meta.url)));

  return worker.imgDiff(img1, img2);
}
