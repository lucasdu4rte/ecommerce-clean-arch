import { GET as getProduct } from "@/app/api/products/[id]/route";
import { GET as listProducts } from "@/app/api/products/route";
import { createTempDatabase } from "@test/temp-db";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const seed = {
  products: [
    { id: 1, name: "iPhone 12 Pro", description: "Apple", price: 999 },
    { id: 2, name: "AirPods Pro", description: "Earbuds", price: 249 },
  ],
  orders: [],
};

let database: Awaited<ReturnType<typeof createTempDatabase>>;

beforeEach(async () => {
  database = await createTempDatabase(structuredClone(seed));
});

afterEach(() => database.cleanup());

describe("GET /api/products", () => {
  it("returns every product", async () => {
    const response = await listProducts();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toHaveLength(2);
  });
});

describe("GET /api/products/[id]", () => {
  it("returns the requested product", async () => {
    const response = await getProduct(new Request("http://test/products/2"), {
      params: { id: "2" },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ id: 2, name: "AirPods Pro" });
  });

  it("returns 404 for an unknown product", async () => {
    const response = await getProduct(new Request("http://test/products/99"), {
      params: { id: "99" },
    });

    expect(response.status).toBe(404);
  });
});
