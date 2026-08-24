import { AxiosInstance } from "axios";
import { buildLineItem, buildProduct } from "@test/builders";
import { describe, expect, it, vi } from "vitest";
import { Order } from "../../domain/entities/order";
import { OrderHttpGateway } from "./order-http.gateway";

const apiOrder = {
  id: 10,
  items: [
    { product: { id: 1, name: "iPhone 12 Pro", description: "Apple", price: 999 }, quantity: 2 },
  ],
  credit_card_number: "**** **** **** 1111",
};

const anOrder = () =>
  new Order({
    items: [buildLineItem(buildProduct(), 2)],
    credit_card_number: "4111111111111111",
  });

describe("OrderHttpGateway", () => {
  it("sends a flat payload instead of the entity internals", async () => {
    const post = vi.fn().mockResolvedValue({ data: apiOrder });

    await new OrderHttpGateway({ post } as unknown as AxiosInstance).insert(anOrder());

    expect(post).toHaveBeenCalledWith("/orders", {
      items: [
        {
          product: {
            id: 1,
            name: "iPhone 12 Pro",
            description: "Apple iPhone 12th generation",
            price: 999,
          },
          quantity: 2,
        },
      ],
      credit_card_number: "4111111111111111",
    });
  });

  it("maps the created order into an entity carrying the generated id", async () => {
    const post = vi.fn().mockResolvedValue({ data: apiOrder });

    const order = await new OrderHttpGateway({ post } as unknown as AxiosInstance).insert(
      anOrder()
    );

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toBe(10);
    expect(order.total).toBe(1998);
  });

  it("maps a fetched order into an entity", async () => {
    const get = vi.fn().mockResolvedValue({ data: apiOrder });

    const order = await new OrderHttpGateway({ get } as unknown as AxiosInstance).findById(10);

    expect(get).toHaveBeenCalledWith("/orders/10");
    expect(order.items[0].product.name).toBe("iPhone 12 Pro");
    expect(order.credit_card_number).toBe("**** **** **** 1111");
  });
});

describe("OrderHttpGateway rejections", () => {
  const rejectingWith = (response: unknown) => {
    const error = Object.assign(new Error("Request failed"), { isAxiosError: true, response });
    return vi.fn().mockRejectedValue(error);
  };

  it("surfaces the reason the API refused the order", async () => {
    const post = rejectingWith({ status: 422, data: { message: "credit_card_number is invalid" } });

    await expect(
      new OrderHttpGateway({ post } as unknown as AxiosInstance).insert(anOrder())
    ).rejects.toThrow("credit_card_number is invalid");
  });

  it("falls back to a generic reason when the API explains nothing", async () => {
    const post = rejectingWith({ status: 500, data: null });

    await expect(
      new OrderHttpGateway({ post } as unknown as AxiosInstance).insert(anOrder())
    ).rejects.toThrow("The order was rejected.");
  });

  it("lets a transport failure through untouched", async () => {
    const post = vi.fn().mockRejectedValue(new Error("Network Error"));

    await expect(
      new OrderHttpGateway({ post } as unknown as AxiosInstance).insert(anOrder())
    ).rejects.toThrow("Network Error");
  });
});
