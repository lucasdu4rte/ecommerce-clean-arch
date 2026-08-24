import { buildLineItem, buildProduct } from "@test/builders";
import { describe, expect, it } from "vitest";
import { Cart } from "./cart";

const emptyCart = () => new Cart({ items: [] });

describe("Cart", () => {
  it("starts empty with a zero total", () => {
    const cart = emptyCart();

    expect(cart.isEmpty).toBe(true);
    expect(cart.total).toBe(0);
  });

  it("groups repeated products into a single line", () => {
    const cart = emptyCart();

    cart.addProduct(buildProduct({ id: 1, price: 999 }));
    cart.addProduct(buildProduct({ id: 1, price: 999 }));

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.total).toBe(1998);
  });

  it("keeps distinct products on their own lines", () => {
    const cart = emptyCart();

    cart.addProduct(buildProduct({ id: 1, price: 999 }));
    cart.addProduct(buildProduct({ id: 2, price: 249 }));

    expect(cart.items.map((item) => item.product.id)).toEqual([1, 2]);
    expect(cart.total).toBe(1248);
  });

  it("removes a single unit at a time", () => {
    const cart = new Cart({ items: [buildLineItem(buildProduct({ id: 1 }), 3)] });

    cart.removeProduct(1);

    expect(cart.items[0].quantity).toBe(2);
  });

  it("drops the line once its last unit is removed", () => {
    const cart = new Cart({
      items: [buildLineItem(buildProduct({ id: 1 })), buildLineItem(buildProduct({ id: 2 }), 2)],
    });

    cart.removeProduct(1);

    expect(cart.items.map((item) => item.product.id)).toEqual([2]);
  });

  it("ignores the removal of a product it does not hold", () => {
    const cart = new Cart({ items: [buildLineItem()] });

    cart.removeProduct(999);

    expect(cart.items).toHaveLength(1);
  });

  it("clears every line", () => {
    const cart = new Cart({ items: [buildLineItem(buildProduct({ id: 1 }), 2), buildLineItem()] });

    cart.clear();

    expect(cart.isEmpty).toBe(true);
    expect(cart.total).toBe(0);
  });
});
