import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

import { Counter } from "../index.ts";
// import { globalRegistry } from "../index.ts";

Deno.test("should increment counter", function (): void {
  const instance = new Counter("gauge_test", "test");
  instance.inc();
  assertEquals(instance.get().values[0].value, 1);
  instance.inc();
  assertEquals(instance.get().values[0].value, 2);
  instance.inc(0);
  assertEquals(instance.get().values[0].value, 2);
});

Deno.test("should increment counter", function (): void {
  const instance = new Counter("gauge_test", "test", ["method", "endpoint"]);
  instance.inc();
  assertEquals(instance.get().values[0].value, 1);
  instance.inc();
  assertEquals(instance.get().values[0].value, 2);
  instance.inc(0);
  assertEquals(instance.get().values[0].value, 2);
});
