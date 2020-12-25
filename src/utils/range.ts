export function range(start: number, stop: number, step = 1): number[] {
  const result = [];
  for (let i = start; i < stop; i += step) {
    result.push(i);
  }
  return result;
}
