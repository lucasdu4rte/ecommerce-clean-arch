import { buildProduct } from "@test/builders";
import { describe, expect, it } from "vitest";
import { Cart } from "./cart";

describe("Cart", () => {
  it("starts empty with a zero total", () => {
    const cart = new Cart({ products: [] });

    expect(cart.products).toEqual([]);
    expect(cart.total).toBe(0);
  });

  it("sums the price of every product", () => {
    const cart = new Cart({
      products: [buildProduct({ id: 1, price: 999 }), buildProduct({ id: 2, price: 249 })],
    });

    expect(cart.total).toBe(1248);
  });

  it("adds products", () => {
    const cart = new Cart({ products: [] });

    cart.addProduct(buildProduct({ id: 7 }));

    expect(cart.products.map((product) => product.id)).toEqual([7]);
  });

  it("removes every entry of a product id", () => {
    const cart = new Cart({
      products: [buildProduct({ id: 1 }), buildProduct({ id: 2 }), buildProduct({ id: 1 })],
    });

    cart.removeProduct(1);

    expect(cart.products.map((product) => product.id)).toEqual([2]);
  });

  it("keeps the cart untouched when removing an unknown product", () => {
    const cart = new Cart({ products: [buildProduct({ id: 1 })] });

    cart.removeProduct(999);

    expect(cart.products).toHaveLength(1);
  });

  it("clears every product", () => {
    const cart = new Cart({ products: [buildProduct({ id: 1 }), buildProduct({ id: 2 })] });

    cart.clear();

    expect(cart.products).toEqual([]);
    expect(cart.total).toBe(0);
  });
});
