import { buildProduct } from "@test/builders";
import { InMemoryCartGateway } from "@test/fakes";
import { beforeEach, describe, expect, it } from "vitest";
import { AddProductInCartUseCase } from "./add-product-in-cart.use-case";
import { ClearCartUseCase } from "./clear-cart.use-case";
import { GetCartUseCase } from "./get-cart.use-case";
import { RemoveProductFromCartUseCase } from "./remove-product-from-cart.use-case";

describe("cart use cases", () => {
  let gateway: InMemoryCartGateway;

  beforeEach(() => {
    gateway = new InMemoryCartGateway();
  });

  it("returns an empty cart when nothing was stored", () => {
    expect(new GetCartUseCase(gateway).execute().products).toEqual([]);
  });

  it("persists the product added to the cart", () => {
    const cart = new AddProductInCartUseCase(gateway).execute(buildProduct({ id: 3 }));

    expect(cart.products.map((product) => product.id)).toEqual([3]);
    expect(new GetCartUseCase(gateway).execute().products.map((p) => p.id)).toEqual([3]);
  });

  it("persists the removal of a product", () => {
    const addProduct = new AddProductInCartUseCase(gateway);
    addProduct.execute(buildProduct({ id: 1 }));
    addProduct.execute(buildProduct({ id: 2 }));

    const cart = new RemoveProductFromCartUseCase(gateway).execute(1);

    expect(cart.products.map((product) => product.id)).toEqual([2]);
    expect(new GetCartUseCase(gateway).execute().products.map((p) => p.id)).toEqual([2]);
  });

  it("persists the cleared cart", () => {
    new AddProductInCartUseCase(gateway).execute(buildProduct());

    const cart = new ClearCartUseCase(gateway).execute();

    expect(cart.products).toEqual([]);
    expect(new GetCartUseCase(gateway).execute().products).toEqual([]);
  });
});
