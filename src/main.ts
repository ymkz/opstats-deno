import {
  exists,
  printf,
  args,
  BinaryFlag,
  DrainOption,
  EarlyExitFlag,
  FiniteNumber,
  DRAIN_UNTIL_FLAG,
  MAIN_COMMAND,
} from "./deps.ts";
import {
  getAverage,
  getMaximum,
  getMedian,
  getMinimum,
  getPercentile,
} from "./func.ts";

const parser = args
  .with(
    EarlyExitFlag("help", {
      alias: ["h", "?"],
      describe: "Display help",
      exit() {
        console.log("USAGE:");
        console.log("  opstats [flags] <file>");
        console.log("  cat <file> | opstats [flags]");
        console.log();
        console.log(parser.help());
        Deno.exit(0);
      },
    })
  )
  .with(
    BinaryFlag("min", {
      describe: "Display minimum value",
    })
  )
  .with(
    BinaryFlag("max", {
      describe: "Display maximum value",
    })
  )
  .with(
    BinaryFlag("avg", {
      describe: "Display average value",
    })
  )
  .with(
    BinaryFlag("med", {
      describe: "Display median value",
    })
  )
  .with(
    DrainOption("per", {
      type: FiniteNumber,
      while: DRAIN_UNTIL_FLAG,
      describe: "Display percentiles",
    })
  );

const argv = parser.parse(Deno.args);

// パースした引数のバリデーション
if (argv.tag !== MAIN_COMMAND) {
  console.error(argv.error.toString());
  Deno.exit(1);
}
if (argv.remaining().rawFlags().length) {
  console.error(
    "Error: Unknown flags specified.",
    ...argv.remaining().rawFlags()
  );
  Deno.exit(1);
}

const { remaining, value } = argv;

let list: number[];

if (Deno.isatty(Deno.stdin.rid)) {
  // パイプからの入力でない場合はファイルから読み込み
  if (!remaining().rawValues().length) {
    console.error("Error: Must specify an input file.");
    Deno.exit(1);
  }
  const [file] = remaining().rawValues();
  if (!(await exists(file))) {
    console.error("Error: Input file not found.");
    Deno.exit(1);
  }
  const data = await Deno.readTextFile(file);
  list = data.split("\n").filter(Boolean).map(parseFloat).sort();
} else {
  // パイプから入力された場合は内容を全読み込み
  const input = await Deno.readAll(Deno.stdin);
  const data = new TextDecoder().decode(input);
  list = data.split("\n").filter(Boolean).map(parseFloat).sort();
}

if (value.min || value.max || value.avg || value.med || value.per.length) {
  // フラグ指定がひとつでもある場合
  if (value.min) {
    printf("Min %6.6f\n", getMinimum(list));
  }
  if (value.max) {
    printf("Max %6.6f\n", getMaximum(list));
  }
  if (value.avg) {
    printf("Avg %6.6f\n", getAverage(list));
  }
  if (value.med) {
    printf("Med %6.6f\n", getMedian(list));
  }
  if (value.per.length) {
    for (const n of value.per) {
      printf("%2d%% %6.6f\n", n, getPercentile(list, n));
    }
  }
} else {
  // フラグ指定なし
  printf("Min %6.6f\n", getMinimum(list));
  printf("Max %6.6f\n", getMaximum(list));
  printf("Avg %6.6f\n", getAverage(list));
  printf("Med %6.6f\n", getMedian(list));
  for (const n of [90, 95, 99]) {
    printf("%2d%% %6.6f\n", n, getPercentile(list, n));
  }
}
