import { buildLineItem, buildProduct } from "@test/builders";
import { describe, expect, it } from "vitest";
import { Order } from "./order";

describe("Order", () => {
  it("sums the total of every line", () => {
    const order = new Order({
      items: [
        buildLineItem(buildProduct({ id: 1, price: 999 }), 2),
        buildLineItem(buildProduct({ id: 2, price: 249 })),
      ],
      credit_card_number: "4111111111111111",
    });

    expect(order.total).toBe(2247);
  });

  it("rejects an order without items", () => {
    expect(() => new Order({ items: [], credit_card_number: "4111111111111111" })).toThrow(
      "Order must have at least one product"
    );
  });

  it("rejects an order without a credit card number", () => {
    expect(() => new Order({ items: [buildLineItem()], credit_card_number: "  " })).toThrow(
      "Order must have a credit card number"
    );
  });
});
