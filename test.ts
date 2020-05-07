import {
  assertEquals,
  assertStrictEq,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

Deno.test({
  name: "testing example",
  fn(): void {
    assertEquals("world", "world");
    assertEquals({ hello: "world" }, { hello: "world" });
  },
});

Deno.test("isStrictlyEqual", function (): void {
  const a = { "a": 1 };
  const b = { "a": 2 };
  assertStrictEq(a, b);
});

Deno.test("doesThrow", function (): void {
  assertThrows((): void => {
    throw new TypeError("hello world!");
  });
  assertThrows((): void => {
    throw new TypeError("hello world!");
  }, TypeError);
  assertThrows(
    (): void => {
      throw new TypeError("hello world!");
    },
    TypeError,
    "hello",
  );
});
