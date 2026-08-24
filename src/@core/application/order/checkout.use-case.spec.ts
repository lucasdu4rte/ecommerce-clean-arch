import { buildLineItem, buildProduct } from "@test/builders";
import { InMemoryCartGateway, InMemoryOrderGateway } from "@test/fakes";
import { beforeEach, describe, expect, it } from "vitest";
import { CheckoutUseCase } from "./checkout.use-case";

const CREDIT_CARD = "4111111111111111";

describe("CheckoutUseCase", () => {
  let cartGateway: InMemoryCartGateway;
  let orderGateway: InMemoryOrderGateway;

  beforeEach(() => {
    cartGateway = new InMemoryCartGateway([buildLineItem(buildProduct({ id: 1, price: 999 }), 2)]);
    orderGateway = new InMemoryOrderGateway();
  });

  it("creates an order carrying the cart lines and their quantities", async () => {
    const order = await new CheckoutUseCase(cartGateway, orderGateway).execute({
      credit_card_number: CREDIT_CARD,
    });

    expect(order.id).toBe(1);
    expect(order.total).toBe(1998);
    expect(order.items[0].quantity).toBe(2);
  });

  it("empties the cart after a successful checkout", async () => {
    await new CheckoutUseCase(cartGateway, orderGateway).execute({
      credit_card_number: CREDIT_CARD,
    });

    expect(cartGateway.get().isEmpty).toBe(true);
  });

  it("refuses to check out an empty cart", async () => {
    const useCase = new CheckoutUseCase(new InMemoryCartGateway(), orderGateway);

    await expect(useCase.execute({ credit_card_number: CREDIT_CARD })).rejects.toThrow(
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
      new CheckoutUseCase(cartGateway, failing).execute({ credit_card_number: CREDIT_CARD })
    ).rejects.toThrow("network down");
    expect(cartGateway.get().isEmpty).toBe(false);
  });
});
