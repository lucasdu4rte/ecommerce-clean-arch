import { describe, expect, it } from "vitest";
import { Product } from "./product";

describe("Product", () => {
  it("exposes its props through getters", () => {
    const product = new Product({
      id: 1,
      name: "AirPods Pro",
      description: "Wireless earbuds",
      price: 249,
    });

    expect(product.id).toBe(1);
    expect(product.name).toBe("AirPods Pro");
    expect(product.description).toBe("Wireless earbuds");
    expect(product.price).toBe(249);
  });
});
