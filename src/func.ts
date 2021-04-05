export function getMaximum(list: number[]): number {
  return list[list.length - 1];
}

export function getMinimum(list: number[]): number {
  return list[0];
}

export function getAverage(list: number[]): number {
  let sum = 0.0;

  for (const num of list) {
    sum += num;
  }

  return sum / list.length;
}

export function getMedian(list: number[]): number {
  return getPercentile(list, 50);
}

export function getPercentile(list: number[], n: number): number {
  if (n === 0) {
    return list[0];
  }
  const k = Math.floor((list.length * n) / 100) - 1;
  return list[k];
}
