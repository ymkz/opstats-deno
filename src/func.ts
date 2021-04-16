import { exists, printf, readAll } from "./deps.ts";
import { Flags } from "./types.ts";

export function getMaximum(data: number[]): number {
  return data[data.length - 1];
}

export function getMinimum(data: number[]): number {
  return data[0];
}

export function getAverage(data: number[]): number {
  let sum = 0.0;

  for (const num of data) {
    sum += num;
  }

  return sum / data.length;
}

export function getMedian(data: number[]): number {
  return getPercentile(data, 50);
}

export function getPercentile(data: number[], n: number): number {
  if (n === 0) {
    return data[0];
  }
  const k = Math.floor((data.length * n) / 100) - 1;
  return data[k];
}

export function showHelp() {
  const helpMessage = `
Usage: 
  opstats [options] <file>

Options:
  --help, -h, -?              Display this help message
  --min                       Display minimum
  --max                       Display maximum
  --average, -a               Display average
  --median, -m                Display median
  --percentile, -p <NUMBER>   Display percentile`;
  console.log(helpMessage);
  Deno.exit(0);
}

export async function readData(file: string): Promise<number[]> {
  if (Deno.isatty(Deno.stdin.rid)) {
    // パイプからの入力でない場合はファイルから読み込み
    if (!file || !(await exists(file))) {
      console.error("Error: Input file not found.");
      Deno.exit(1);
    }
    const data = await Deno.readTextFile(file);
    return data.split("\n").filter(Boolean).map(parseFloat).sort();
  } else {
    // パイプから入力された場合は内容を全読み込み
    const input = await readAll(Deno.stdin);
    const data = new TextDecoder().decode(input);
    return data.split("\n").filter(Boolean).map(parseFloat).sort();
  }
}

export function writeResult(flags: Flags, data: number[]) {
  if (
    flags.min ||
    flags.max ||
    flags.average ||
    flags.median ||
    flags.percentile
  ) {
    // フラグ指定がひとつでもある場合
    if (flags.min) {
      printf("Min %6.6f\n", getMinimum(data));
    }
    if (flags.max) {
      printf("Max %6.6f\n", getMaximum(data));
    }
    if (flags.average) {
      printf("Avg %6.6f\n", getAverage(data));
    }
    if (flags.median) {
      printf("Med %6.6f\n", getMedian(data));
    }
    if (flags.percentile?.length) {
      for (const n of flags.percentile) {
        printf("%2d%% %6.6f\n", n, getPercentile(data, n));
      }
    }
  } else {
    // フラグ指定なし
    printf("Min %6.6f\n", getMinimum(data));
    printf("Max %6.6f\n", getMaximum(data));
    printf("Avg %6.6f\n", getAverage(data));
    printf("Med %6.6f\n", getMedian(data));
    for (const n of [90, 95, 99]) {
      printf("%2d%% %6.6f\n", n, getPercentile(data, n));
    }
  }
}
