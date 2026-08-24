import { LineItem } from "@/@core/domain/entities/line-item";
import { Product, ProductProps } from "@/@core/domain/entities/product";

export const buildProduct = (props: Partial<ProductProps> = {}) =>
  new Product({
    id: 1,
    name: "iPhone 12 Pro",
    description: "Apple iPhone 12th generation",
    price: 999,
    ...props,
  });

export const buildLineItem = (product = buildProduct(), quantity = 1) =>
  new LineItem({ product, quantity });
