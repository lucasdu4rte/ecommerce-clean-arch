import { buildProduct } from "@test/builders";
import { InMemoryProductGateway } from "@test/fakes";
import { describe, expect, it } from "vitest";
import { GetProductUseCase } from "./get-product.use-case";
import { ListProductsUseCase } from "./list-products.use-case";

const products = [
  buildProduct({ id: 1 }),
  buildProduct({ id: 2, name: "AirPods Pro", price: 249 }),
];

describe("product use cases", () => {
  it("lists every product from the gateway", async () => {
    const gateway = new InMemoryProductGateway(products);

    await expect(new ListProductsUseCase(gateway).execute()).resolves.toEqual(products);
  });

  it("gets a single product by id", async () => {
    const gateway = new InMemoryProductGateway(products);

    const product = await new GetProductUseCase(gateway).execute(2);

    expect(product.name).toBe("AirPods Pro");
  });

  it("propagates the gateway failure for an unknown product", async () => {
    const gateway = new InMemoryProductGateway(products);

    await expect(new GetProductUseCase(gateway).execute(99)).rejects.toThrow(
      "Product 99 not found"
    );
  });
});
