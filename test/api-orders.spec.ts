import { GET as getOrder } from "@/app/api/orders/[id]/route";
import { POST as createOrder } from "@/app/api/orders/route";
import { createTempDatabase } from "@test/temp-db";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const product = { id: 1, name: "iPhone 12 Pro", description: "Apple", price: 999 };
const item = { product, quantity: 2 };
const CREDIT_CARD = "4111111111111111";

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
    const response = await postOrder({ items: [item], credit_card_number: CREDIT_CARD });

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({ id: 1, items: [item] });
    await expect(database.read()).resolves.toMatchObject({ orders: [{ id: 1 }] });
  });

  it("never stores the full credit card number", async () => {
    const response = await postOrder({ items: [item], credit_card_number: CREDIT_CARD });

    await expect(response.json()).resolves.toMatchObject({
      credit_card_number: "**** **** **** 1111",
    });
    expect(JSON.stringify(await database.read())).not.toContain(CREDIT_CARD);
  });

  it("increments the id across orders", async () => {
    await postOrder({ items: [item], credit_card_number: CREDIT_CARD });
    const response = await postOrder({ items: [item], credit_card_number: CREDIT_CARD });

    await expect(response.json()).resolves.toMatchObject({ id: 2 });
  });

  it.each([
    ["without items", { items: [], credit_card_number: CREDIT_CARD }],
    [
      "with a malformed product",
      { items: [{ product: { id: "1" }, quantity: 1 }], credit_card_number: CREDIT_CARD },
    ],
    [
      "with a zero quantity",
      { items: [{ product, quantity: 0 }], credit_card_number: CREDIT_CARD },
    ],
    [
      "with a fractional quantity",
      { items: [{ product, quantity: 1.5 }], credit_card_number: CREDIT_CARD },
    ],
    ["with a short credit card", { items: [item], credit_card_number: "411" }],
    ["with a non numeric credit card", { items: [item], credit_card_number: "not-a-card" }],
    ["without a body", null],
  ])("rejects an order %s", async (_label, body) => {
    const response = await postOrder(body);

    expect(response.status).toBe(422);
    await expect(database.read()).resolves.toMatchObject({ orders: [] });
  });
});

describe("GET /api/orders/[id]", () => {
  it("returns a persisted order", async () => {
    await postOrder({ items: [item], credit_card_number: CREDIT_CARD });

    const response = await getOrder(new Request("http://test/orders/1"), { params: { id: "1" } });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ id: 1, items: [item] });
  });

  it("returns 404 for an unknown order", async () => {
    const response = await getOrder(new Request("http://test/orders/42"), { params: { id: "42" } });

    expect(response.status).toBe(404);
  });
});
