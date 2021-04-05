import { cac, exists, printf } from "./deps.ts";
import {
  getAverage,
  getMaximum,
  getMedian,
  getMinimum,
  getPercentile,
} from "./func.ts";

const piped = !Deno.isatty(Deno.stdin.rid);
const cli = cac("opstats");

cli.option("--min", "Display minimum output");
cli.option("--max", "Display maximum output");
cli.option("--avg", "Display average output");
cli.option("--med", "Display median output");
cli.option("--per [percentage]", "Display percentile output");
cli.usage("[options] <file>");
cli.help();

const { args, options } = cli.parse();

// helpフラグが渡された場合はヘルプを表示して正常終了
if (options.help || options.h) {
  Deno.exit(0);
}

let list: number[];

if (piped) {
  // パイプから入力された場合は内容を全読み込み
  const input = await Deno.readAll(Deno.stdin);
  const data = new TextDecoder().decode(input);
  list = data.split("\n").filter(Boolean).map(parseFloat).sort();
} else {
  // ファイルがpositionalな引数で渡された場合はファイルをテキストとして読み込み
  const filePath = String(args[0]);
  if (!(await exists(filePath))) {
    console.error("[ERROR] No filepath found.");
    Deno.exit(1);
  }
  const data = await Deno.readTextFile(filePath);
  list = data.split("\n").filter(Boolean).map(parseFloat).sort();
}

if (options.min || options.max || options.avg || options.med || options.per) {
  // オプション指定あり -> 指定ありオプションのみ出力
  if (options.min) {
    printf("Min %6.6f\n", getMinimum(list));
  }
  if (options.max) {
    printf("Max %6.6f\n", getMaximum(list));
  }
  if (options.avg) {
    printf("Avg %6.6f\n", getAverage(list));
  }
  if (options.med) {
    printf("Med %6.6f\n", getMedian(list));
  }
  if (Array.isArray(options.per)) {
    for (const n of options.per) {
      printf("%2d%% %6.6f\n", n, getPercentile(list, n));
    }
  } else {
    printf("%2d%% %6.6f\n", options.per, getPercentile(list, options.per));
  }
} else {
  // オプション指定なし=デフォルト -> 全オプション出力
  printf("Min %6.6f\n", getMinimum(list));
  printf("Max %6.6f\n", getMaximum(list));
  printf("Avg %6.6f\n", getAverage(list));
  printf("Med %6.6f\n", getMedian(list));
  for (const n of [90, 95, 99]) {
    printf("%2d%% %6.6f\n", n, getPercentile(list, n));
  }
}
