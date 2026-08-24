import { AddProductInCartUseCase } from "@/@core/application/cart/add-product-in-cart.use-case";
import { GetCartUseCase } from "@/@core/application/cart/get-cart.use-case";
import { ListProductsUseCase } from "@/@core/application/product/list-products.use-case";
import { CheckoutUseCase } from "@/@core/application/order/checkout.use-case";
import { GetOrderUseCase } from "@/@core/application/order/get-order.use-case";
import { CartLocalStorageGateway } from "@/@core/infra/gateways/cart-local-storage.gateway";
import { OrderHttpGateway } from "@/@core/infra/gateways/order-http.gateway";
import { ProductHttpGateway } from "@/@core/infra/gateways/product-http.gateway";
import { httpAgainstRouteHandlers } from "@test/api-adapter";
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
let cartGateway: CartLocalStorageGateway;
let orderGateway: OrderHttpGateway;
let productGateway: ProductHttpGateway;

beforeEach(async () => {
  database = await createTempDatabase(structuredClone(seed));
  cartGateway = new CartLocalStorageGateway();
  orderGateway = new OrderHttpGateway(httpAgainstRouteHandlers);
  productGateway = new ProductHttpGateway(httpAgainstRouteHandlers);
});

afterEach(() => database.cleanup());

describe("checkout flow across every layer", () => {
  it("turns the listed products into a persisted order and empties the cart", async () => {
    const products = await new ListProductsUseCase(productGateway).execute();

    const addProduct = new AddProductInCartUseCase(cartGateway);
    products.forEach((product) => addProduct.execute(product));

    expect(new GetCartUseCase(cartGateway).execute().total).toBe(1248);

    const order = await new CheckoutUseCase(cartGateway, orderGateway).execute({
      credit_card_number: "4111111111111111",
    });

    expect(order.id).toBe(1);
    expect(order.total).toBe(1248);
    expect(order.credit_card_number).toBe("**** **** **** 1111");
    expect(new GetCartUseCase(cartGateway).execute().products).toEqual([]);

    const persisted = await new GetOrderUseCase(orderGateway).execute(order.id!);
    expect(persisted.products.map((product) => product.name)).toEqual([
      "iPhone 12 Pro",
      "AirPods Pro",
    ]);
  });

  it("does not create an order when the cart is empty", async () => {
    const useCase = new CheckoutUseCase(cartGateway, orderGateway);

    await expect(useCase.execute({ credit_card_number: "4111111111111111" })).rejects.toThrow(
      "Order must have at least one product"
    );
    await expect(database.read()).resolves.toMatchObject({ orders: [] });
  });
});
