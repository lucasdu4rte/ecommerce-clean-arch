import { buildProduct } from "@test/builders";
import { describe, expect, it } from "vitest";
import { Order } from "./order";

describe("Order", () => {
  it("sums the price of every product", () => {
    const order = new Order({
      products: [buildProduct({ price: 999 }), buildProduct({ id: 2, price: 1 })],
      credit_card_number: "4111111111111111",
    });

    expect(order.total).toBe(1000);
  });

  it("rejects an order without products", () => {
    expect(() => new Order({ products: [], credit_card_number: "4111111111111111" })).toThrow(
      "Order must have at least one product"
    );
  });

  it("rejects an order without a credit card number", () => {
    expect(() => new Order({ products: [buildProduct()], credit_card_number: "  " })).toThrow(
      "Order must have a credit card number"
    );
  });
});
