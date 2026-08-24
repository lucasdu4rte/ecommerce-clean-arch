import { buildProduct } from "@test/builders";
import { InMemoryCartGateway } from "@test/fakes";
import { beforeEach, describe, expect, it } from "vitest";
import { AddProductInCartUseCase } from "./add-product-in-cart.use-case";
import { ClearCartUseCase } from "./clear-cart.use-case";
import { GetCartUseCase } from "./get-cart.use-case";
import { RemoveProductFromCartUseCase } from "./remove-product-from-cart.use-case";

describe("cart use cases", () => {
  let gateway: InMemoryCartGateway;
  let storedCart: () => ReturnType<GetCartUseCase["execute"]>;

  beforeEach(() => {
    gateway = new InMemoryCartGateway();
    storedCart = () => new GetCartUseCase(gateway).execute();
  });

  it("returns an empty cart when nothing was stored", () => {
    expect(storedCart().isEmpty).toBe(true);
  });

  it("persists the product added to the cart", () => {
    const cart = new AddProductInCartUseCase(gateway).execute(buildProduct({ id: 3 }));

    expect(cart.items.map((item) => item.product.id)).toEqual([3]);
    expect(storedCart().items.map((item) => item.product.id)).toEqual([3]);
  });

  it("persists the raised quantity of a repeated product", () => {
    const addProduct = new AddProductInCartUseCase(gateway);
    addProduct.execute(buildProduct({ id: 1 }));
    addProduct.execute(buildProduct({ id: 1 }));

    expect(storedCart().items[0].quantity).toBe(2);
  });

  it("persists the removal of a unit", () => {
    const addProduct = new AddProductInCartUseCase(gateway);
    addProduct.execute(buildProduct({ id: 1 }));
    addProduct.execute(buildProduct({ id: 2 }));

    const cart = new RemoveProductFromCartUseCase(gateway).execute(1);

    expect(cart.items.map((item) => item.product.id)).toEqual([2]);
    expect(storedCart().items.map((item) => item.product.id)).toEqual([2]);
  });

  it("persists the cleared cart", () => {
    new AddProductInCartUseCase(gateway).execute(buildProduct());

    const cart = new ClearCartUseCase(gateway).execute();

    expect(cart.isEmpty).toBe(true);
    expect(storedCart().isEmpty).toBe(true);
  });
});
