import { AddProductInCartUseCase } from "@/@core/application/cart/add-product-in-cart.use-case";
import { ClearCartUseCase } from "@/@core/application/cart/clear-cart.use-case";
import { GetCartUseCase } from "@/@core/application/cart/get-cart.use-case";
import { RemoveProductFromCartUseCase } from "@/@core/application/cart/remove-product-from-cart.use-case";
import { Product } from "@/@core/domain/entities/product";
import { Registry, container } from "@/@core/infra/container-registry";
import { buildProduct } from "@test/builders";
import { describe, expect, it } from "vitest";

const getCart = () => container.get<GetCartUseCase>(Registry.GetCartUseCase);
const addProduct = () => container.get<AddProductInCartUseCase>(Registry.AddProductInCartUseCase);
const removeProduct = () =>
  container.get<RemoveProductFromCartUseCase>(Registry.RemoveProductFromCartUseCase);
const clearCart = () => container.get<ClearCartUseCase>(Registry.ClearCartUseCase);

describe("cart flow through the container and localStorage", () => {
  it("resolves every registered dependency", () => {
    for (const identifier of Object.values(Registry)) {
      expect(() => container.get(identifier)).not.toThrow();
    }
  });

  it("survives a full add, remove and clear round trip", () => {
    addProduct().execute(buildProduct({ id: 1, price: 999 }));
    addProduct().execute(buildProduct({ id: 2, name: "AirPods Pro", price: 249 }));

    expect(getCart().execute().total).toBe(1248);

    removeProduct().execute(1);
    expect(getCart().execute().products.map((product) => product.id)).toEqual([2]);

    clearCart().execute();
    expect(getCart().execute().products).toEqual([]);
  });

  it("rebuilds entities from the stored payload", () => {
    addProduct().execute(buildProduct({ id: 5 }));

    const [product] = getCart().execute().products;

    expect(product).toBeInstanceOf(Product);
    expect(JSON.parse(localStorage.getItem("cart") ?? "[]")).toEqual([
      { id: 5, name: "iPhone 12 Pro", description: "Apple iPhone 12th generation", price: 999 },
    ]);
  });

  it("falls back to an empty cart when the stored payload is corrupt", () => {
    localStorage.setItem("cart", "not-json");

    expect(getCart().execute().products).toEqual([]);
  });
});
