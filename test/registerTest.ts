import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { Counter } from "../mod.ts";
import { globalRegistry } from "../mod.ts";

// Deno.test("should increment counter", function (): void {
const metric = new Counter("gauge_test", "test");
const metric1 = new Counter("gauge_test1", "test", ["a"]);
metric.inc();
metric1.inc(2, { "a": "2" });
globalRegistry.registerMetric(metric);
globalRegistry.registerMetric(metric1);
console.log(globalRegistry.metrics());
// });
