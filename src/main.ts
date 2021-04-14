import { parseFlags, ValidationError } from "./deps.ts";
import { showHelp, readData, writeResult } from "./func.ts";
import { flags } from "./flags.ts";
import { Flags } from "./types.ts";

try {
  const parsed = parseFlags<Flags>(Deno.args, { flags, allowEmpty: true });
  if (parsed.flags.help) showHelp();
  const data = await readData(parsed.unknown[0]);
  writeResult(parsed.flags, data);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("[ERROR] %s", error.message);
    Deno.exit(1);
  } else {
    throw error;
  }
}
