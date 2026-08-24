import { buildProduct } from "@test/builders";
import { InMemoryCartGateway, InMemoryOrderGateway } from "@test/fakes";
import { beforeEach, describe, expect, it } from "vitest";
import { CheckoutUseCase } from "./checkout.use-case";

describe("CheckoutUseCase", () => {
  let cartGateway: InMemoryCartGateway;
  let orderGateway: InMemoryOrderGateway;

  beforeEach(() => {
    cartGateway = new InMemoryCartGateway([buildProduct({ id: 1, price: 999 })]);
    orderGateway = new InMemoryOrderGateway();
  });

  it("creates an order with the cart products", async () => {
    const order = await new CheckoutUseCase(cartGateway, orderGateway).execute({
      credit_card_number: "4111111111111111",
    });

    expect(order.id).toBe(1);
    expect(order.total).toBe(999);
    expect(order.products.map((product) => product.id)).toEqual([1]);
  });

  it("empties the cart after a successful checkout", async () => {
    await new CheckoutUseCase(cartGateway, orderGateway).execute({
      credit_card_number: "4111111111111111",
    });

    expect(cartGateway.get().products).toEqual([]);
  });

  it("refuses to check out an empty cart", async () => {
    const useCase = new CheckoutUseCase(new InMemoryCartGateway(), orderGateway);

    await expect(useCase.execute({ credit_card_number: "4111111111111111" })).rejects.toThrow(
      "Order must have at least one product"
    );
    expect(orderGateway.orders).toEqual([]);
  });

  it("keeps the cart when the order gateway fails", async () => {
    const failing = {
      insert: () => Promise.reject(new Error("network down")),
      findById: () => Promise.reject(new Error("not implemented")),
    };

    await expect(
      new CheckoutUseCase(cartGateway, failing).execute({ credit_card_number: "4111111111111111" })
    ).rejects.toThrow("network down");
    expect(cartGateway.get().products).toHaveLength(1);
  });
});
