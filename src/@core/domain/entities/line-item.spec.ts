import { buildProduct } from "@test/builders";
import { describe, expect, it } from "vitest";
import { LineItem } from "./line-item";

describe("LineItem", () => {
  it("multiplies the product price by the quantity", () => {
    expect(new LineItem({ product: buildProduct({ price: 999 }), quantity: 3 }).total).toBe(2997);
  });

  it("returns a new line when the quantity changes", () => {
    const item = new LineItem({ product: buildProduct(), quantity: 1 });

    const incremented = item.increment();

    expect(incremented.quantity).toBe(2);
    expect(item.quantity).toBe(1);
  });

  it.each([0, -1, 1.5])("rejects a quantity of %s", (quantity) => {
    expect(() => new LineItem({ product: buildProduct(), quantity })).toThrow(
      "Line item quantity must be a positive integer"
    );
  });

  it("refuses to decrement below one unit", () => {
    const item = new LineItem({ product: buildProduct(), quantity: 1 });

    expect(() => item.decrement()).toThrow("Line item quantity must be a positive integer");
  });
});
