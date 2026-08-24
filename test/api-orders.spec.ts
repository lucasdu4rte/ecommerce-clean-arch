import { GET as getOrder } from "@/app/api/orders/[id]/route";
import { POST as createOrder } from "@/app/api/orders/route";
import { createTempDatabase } from "@test/temp-db";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const product = { id: 1, name: "iPhone 12 Pro", description: "Apple", price: 999 };

const postOrder = (body: unknown) =>
  createOrder(
    new Request("http://test/orders", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    })
  );

let database: Awaited<ReturnType<typeof createTempDatabase>>;

beforeEach(async () => {
  database = await createTempDatabase({ products: [product], orders: [] });
});

afterEach(() => database.cleanup());

describe("POST /api/orders", () => {
  it("persists the order with a generated id", async () => {
    const response = await postOrder({
      products: [product],
      credit_card_number: "4111111111111111",
    });

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({ id: 1 });
    await expect(database.read()).resolves.toMatchObject({ orders: [{ id: 1 }] });
  });

  it("never stores the full credit card number", async () => {
    const response = await postOrder({
      products: [product],
      credit_card_number: "4111111111111111",
    });

    const order = await response.json();

    expect(order.credit_card_number).toBe("**** **** **** 1111");
    const stored = await database.read();
    expect(JSON.stringify(stored)).not.toContain("4111111111111111");
  });

  it("increments the id across orders", async () => {
    await postOrder({ products: [product], credit_card_number: "4111111111111111" });
    const response = await postOrder({
      products: [product],
      credit_card_number: "4111111111111111",
    });

    await expect(response.json()).resolves.toMatchObject({ id: 2 });
  });

  it.each([
    ["without products", { products: [], credit_card_number: "4111111111111111" }],
    ["with a malformed product", { products: [{ id: "1" }], credit_card_number: "4111111111111111" }],
    ["with a short credit card", { products: [product], credit_card_number: "411" }],
    ["with a non numeric credit card", { products: [product], credit_card_number: "not-a-card" }],
    ["without a body", null],
  ])("rejects an order %s", async (_label, body) => {
    const response = await postOrder(body);

    expect(response.status).toBe(422);
    await expect(database.read()).resolves.toMatchObject({ orders: [] });
  });
});

describe("GET /api/orders/[id]", () => {
  it("returns a persisted order", async () => {
    await postOrder({ products: [product], credit_card_number: "4111111111111111" });

    const response = await getOrder(new Request("http://test/orders/1"), { params: { id: "1" } });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ id: 1, products: [product] });
  });

  it("returns 404 for an unknown order", async () => {
    const response = await getOrder(new Request("http://test/orders/42"), { params: { id: "42" } });

    expect(response.status).toBe(404);
  });
});
