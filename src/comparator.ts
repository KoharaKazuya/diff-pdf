import { imgDiff } from "./img-diff";
import type { Parser } from "./pdf";

export type PagePair = LeftOnly | RightOnly | Pair;
type LeftOnly = { left: number; right: undefined };
type RightOnly = { left: undefined; right: number };
type Pair = { left: number; right: number; diff: ImageData };

const loopIndexes: [number, number][] = [
  [0, 0],
  ...Array.from({ length: 9 }, (_, i) => [
    [0, i + 1] as [number, number],
    [i + 1, 0] as [number, number],
  ]).flat(),
];
export async function* comparePDFs(
  pdfL: Parser,
  pdfR: Parser
): AsyncGenerator<PagePair> {
  const [parsedL, parsedR] = await Promise.all([pdfL.parse(), pdfR.parse()]);
  const lenL = parsedL.numPages;
  const lenR = parsedR.numPages;

  let iL: number, iR: number;
  LOOP: for (iL = 1, iR = 1; iL <= lenL && iR <= lenR; ) {
    let maxScorePair:
      | {
          left: number;
          right: number;
          score: number;
          diff: ImageData;
        }
      | undefined;

    for (const [dL, dR] of loopIndexes) {
      const pL = iL + dL;
      const pR = iR + dR;
      if (pL > lenL || pR > lenR) continue;

      const [img1, img2] = await Promise.all([
        parsedL.getPage(pL).then((page) => page.render()),
        parsedR.getPage(pR).then((page) => page.render()),
      ]);

      const diffResult = await imgDiff(img1, img2);
      if (diffResult.score === 0) continue;
      if (!("diff" in diffResult))
        throw new Error(
          "diffResult with non-zero score must have diff image data"
        );

      if (diffResult.score < 1) {
        const score = Math.max(0, diffResult.score - 0.1 * Math.max(dL, dR));
        if (!maxScorePair || score > maxScorePair.score)
          maxScorePair = { left: pL, right: pR, score, diff: diffResult.diff };
        continue;
      }

      for (let pA = iL; pA < pL; pA++) yield { left: pA, right: undefined };
      for (let pB = iR; pB < pR; pB++) yield { left: undefined, right: pB };
      yield { left: pL, right: pR, diff: diffResult.diff };

      iL = pL + 1;
      iR = pR + 1;
      continue LOOP;
    }

    if (maxScorePair) {
      const { left, right, diff } = maxScorePair;
      for (let pA = iL; pA < left; pA++) yield { left: pA, right: undefined };
      for (let pB = iR; pB < right; pB++) yield { left: undefined, right: pB };
      yield { left, right, diff };
      iL = left + 1;
      iR = right + 1;
    } else {
      yield { left: iL, right: undefined };
      yield { left: undefined, right: iR };
      iL += 1;
      iR += 1;
    }
  }

  for (; iL <= lenL; iL++) yield { left: iL, right: undefined };
  for (; iR <= lenR; iR++) yield { left: undefined, right: iR };
}
