import { AxiosInstance } from "axios";
import { describe, expect, it, vi } from "vitest";
import { Product } from "../../domain/entities/product";
import { ProductHttpGateway } from "./product-http.gateway";

const apiProduct = {
  id: 1,
  name: "iPhone 12 Pro",
  description: "Apple iPhone 12th generation",
  price: 999,
  color: "#33505a",
  image: "https://example.com/iphone.jpg",
};

const httpReturning = (data: unknown) => {
  const get = vi.fn().mockResolvedValue({ data });
  return { http: { get } as unknown as AxiosInstance, get };
};

describe("ProductHttpGateway", () => {
  it("maps the product list into entities without the extra API fields", async () => {
    const { http, get } = httpReturning([apiProduct]);

    const [product] = await new ProductHttpGateway(http).findAll();

    expect(get).toHaveBeenCalledWith("/products");
    expect(product).toBeInstanceOf(Product);
    expect(product.props).toEqual({
      id: 1,
      name: "iPhone 12 Pro",
      description: "Apple iPhone 12th generation",
      price: 999,
    });
  });

  it("maps a single product into an entity", async () => {
    const { http, get } = httpReturning(apiProduct);

    const product = await new ProductHttpGateway(http).findById(1);

    expect(get).toHaveBeenCalledWith("/products/1");
    expect(product).toBeInstanceOf(Product);
    expect(product.price).toBe(999);
  });
});
