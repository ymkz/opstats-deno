import { assertEquals } from "https://deno.land/std@0.88.0/testing/asserts.ts";
import {
  getMinimum,
  getMaximum,
  getAverage,
  getMedian,
  getPercentile,
} from "./func.ts";

const list = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

Deno.test("getMinimum()", () => {
  const actual = getMinimum(list);
  const expected = 0.1;
  assertEquals(actual, expected);
});

Deno.test("getMaximum()", () => {
  const actual = getMaximum(list);
  const expected = 0.9;
  assertEquals(actual, expected);
});

Deno.test("getAverage()", () => {
  const actual = getAverage(list);
  const expected = 0.5;
  assertEquals(actual, expected);
});

Deno.test("getMedian()", () => {
  const actual = getMedian(list);
  const expected = 0.4;
  assertEquals(actual, expected);
});

Deno.test("get0Percentile()", () => {
  const actual = getPercentile(list, 0);
  const expected = 0.1;
  assertEquals(actual, expected);
});

Deno.test("get99Percentile()", () => {
  const actual = getPercentile(list, 99);
  const expected = 0.8;
  assertEquals(actual, expected);
});
