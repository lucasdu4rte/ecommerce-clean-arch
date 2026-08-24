import { LineItem } from "../domain/entities/line-item";
import { Product, ProductProps } from "../domain/entities/product";

/** Wire format shared by the HTTP API and browser storage. */
export type LineItemDto = {
  product: ProductProps;
  quantity: number;
};

/**
 * Rebuilds a `Product`, dropping any field the source happens to carry that the domain does
 * not model (the catalogue also serves colours and image URLs, for instance).
 */
export const toProduct = ({ id, name, description, price }: ProductProps) =>
  new Product({ id, name, description, price });

export const toLineItem = ({ product, quantity }: LineItemDto) =>
  new LineItem({ product: toProduct(product), quantity });

export const toLineItemDto = (item: LineItem): LineItemDto => ({
  product: toProduct(item.product.props).props,
  quantity: item.quantity,
});
