import { AxiosInstance } from "axios";
import { buildProduct } from "@test/builders";
import { describe, expect, it, vi } from "vitest";
import { Order } from "../../domain/entities/order";
import { Product } from "../../domain/entities/product";
import { OrderHttpGateway } from "./order-http.gateway";

const apiOrder = {
  id: 10,
  products: [{ id: 1, name: "iPhone 12 Pro", description: "Apple", price: 999 }],
  credit_card_number: "**** **** **** 1111",
};

describe("OrderHttpGateway", () => {
  it("sends a flat payload instead of the entity internals", async () => {
    const post = vi.fn().mockResolvedValue({ data: apiOrder });
    const gateway = new OrderHttpGateway({ post } as unknown as AxiosInstance);

    await gateway.insert(
      new Order({ products: [buildProduct()], credit_card_number: "4111111111111111" })
    );

    expect(post).toHaveBeenCalledWith("/orders", {
      products: [
        { id: 1, name: "iPhone 12 Pro", description: "Apple iPhone 12th generation", price: 999 },
      ],
      credit_card_number: "4111111111111111",
    });
  });

  it("maps the created order into an entity carrying the generated id", async () => {
    const post = vi.fn().mockResolvedValue({ data: apiOrder });
    const gateway = new OrderHttpGateway({ post } as unknown as AxiosInstance);

    const order = await gateway.insert(
      new Order({ products: [buildProduct()], credit_card_number: "4111111111111111" })
    );

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toBe(10);
    expect(order.products[0]).toBeInstanceOf(Product);
  });

  it("maps a fetched order into an entity", async () => {
    const get = vi.fn().mockResolvedValue({ data: apiOrder });

    const order = await new OrderHttpGateway({ get } as unknown as AxiosInstance).findById(10);

    expect(get).toHaveBeenCalledWith("/orders/10");
    expect(order.total).toBe(999);
    expect(order.credit_card_number).toBe("**** **** **** 1111");
  });
});
