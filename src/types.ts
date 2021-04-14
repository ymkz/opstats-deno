export type { IFlagOptions } from "./deps.ts";

export type Flags = {
  help?: boolean;
  min?: boolean;
  max?: boolean;
  average?: boolean;
  median?: boolean;
  percentile?: number[];
};
