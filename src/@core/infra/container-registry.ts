import { AxiosInstance } from "axios";
import { Container } from "inversify";
import "reflect-metadata";
import { AddProductInCartUseCase } from "../application/cart/add-product-in-cart.use-case";
import { ClearCartUseCase } from "../application/cart/clear-cart.use-case";
import { GetCartUseCase } from "../application/cart/get-cart.use-case";
import { RemoveProductFromCartUseCase } from "../application/cart/remove-product-from-cart.use-case";
import { CheckoutUseCase } from "../application/order/checkout.use-case";
import { GetOrderUseCase } from "../application/order/get-order.use-case";
import { GetProductUseCase } from "../application/product/get-product.use-case";
import { ListProductsUseCase } from "../application/product/list-products.use-case";
import { CartGateway } from "../domain/gateways/cart.gateway";
import { OrderGateway } from "../domain/gateways/order.gateway";
import { ProductGateway } from "../domain/gateways/product.gateway";
import { CartLocalStorageGateway } from "./gateways/cart-local-storage.gateway";
import { OrderHttpGateway } from "./gateways/order-http.gateway";
import { ProductHttpGateway } from "./gateways/product-http.gateway";
import { http } from "./http";

export const Registry = {
  AxiosAdapter: Symbol.for("AxiosAdapter"),

  ProductGateway: Symbol.for("ProductGateway"),
  CartGateway: Symbol.for("CartGateway"),
  OrderGateway: Symbol.for("OrderGateway"),

  ListProductsUseCase: Symbol.for("ListProductsUseCase"),
  GetProductUseCase: Symbol.for("GetProductUseCase"),

  GetCartUseCase: Symbol.for("GetCartUseCase"),
  AddProductInCartUseCase: Symbol.for("AddProductInCartUseCase"),
  ClearCartUseCase: Symbol.for("ClearCartUseCase"),
  RemoveProductFromCartUseCase: Symbol.for("RemoveProductFromCartUseCase"),

  CheckoutUseCase: Symbol.for("CheckoutUseCase"),
  GetOrderUseCase: Symbol.for("GetOrderUseCase"),
};

export const container = new Container();

/* HTTP */
container.bind(Registry.AxiosAdapter).toConstantValue(http);

/* GATEWAYS */
container
  .bind(Registry.ProductGateway)
  .toDynamicValue(
    (ctx) => new ProductHttpGateway(ctx.container.get<AxiosInstance>(Registry.AxiosAdapter))
  );

container
  .bind(Registry.OrderGateway)
  .toDynamicValue(
    (ctx) => new OrderHttpGateway(ctx.container.get<AxiosInstance>(Registry.AxiosAdapter))
  );

container.bind(Registry.CartGateway).toDynamicValue(() => new CartLocalStorageGateway());

/* USE CASES */
container
  .bind(Registry.ListProductsUseCase)
  .toDynamicValue(
    (ctx) => new ListProductsUseCase(ctx.container.get<ProductGateway>(Registry.ProductGateway))
  );

container
  .bind(Registry.GetProductUseCase)
  .toDynamicValue(
    (ctx) => new GetProductUseCase(ctx.container.get<ProductGateway>(Registry.ProductGateway))
  );

container
  .bind(Registry.GetCartUseCase)
  .toDynamicValue(
    (ctx) => new GetCartUseCase(ctx.container.get<CartGateway>(Registry.CartGateway))
  );

container
  .bind(Registry.AddProductInCartUseCase)
  .toDynamicValue(
    (ctx) => new AddProductInCartUseCase(ctx.container.get<CartGateway>(Registry.CartGateway))
  );

container
  .bind(Registry.RemoveProductFromCartUseCase)
  .toDynamicValue(
    (ctx) => new RemoveProductFromCartUseCase(ctx.container.get<CartGateway>(Registry.CartGateway))
  );

container
  .bind(Registry.ClearCartUseCase)
  .toDynamicValue(
    (ctx) => new ClearCartUseCase(ctx.container.get<CartGateway>(Registry.CartGateway))
  );

container
  .bind(Registry.CheckoutUseCase)
  .toDynamicValue(
    (ctx) =>
      new CheckoutUseCase(
        ctx.container.get<CartGateway>(Registry.CartGateway),
        ctx.container.get<OrderGateway>(Registry.OrderGateway)
      )
  );

container
  .bind(Registry.GetOrderUseCase)
  .toDynamicValue(
    (ctx) => new GetOrderUseCase(ctx.container.get<OrderGateway>(Registry.OrderGateway))
  );
