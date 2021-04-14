import { OptionType } from "./deps.ts";
import { IFlagOptions } from "./types.ts";

export const flags: IFlagOptions[] = [
  {
    name: "help",
    aliases: ["h", "?"],
    type: OptionType.BOOLEAN,
  },
  {
    name: "min",
    type: OptionType.BOOLEAN,
  },
  {
    name: "max",
    type: OptionType.BOOLEAN,
  },
  {
    name: "average",
    aliases: ["a"],
    type: OptionType.BOOLEAN,
  },
  {
    name: "median",
    aliases: ["m"],
    type: OptionType.BOOLEAN,
  },
  {
    name: "percentile",
    aliases: ["p"],
    collect: true,
    type: OptionType.NUMBER,
  },
];
