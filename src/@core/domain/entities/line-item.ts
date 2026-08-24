import { Product } from "./product";

export type LineItemProps = {
  product: Product;
  quantity: number;
};

/**
 * A product plus how many units of it were taken. Shared by `Cart` and `Order`, which
 * describe the same line at different moments of the purchase.
 *
 * Immutable: `increment` and `decrement` return a new line instead of mutating this one,
 * so a quantity can never silently drop below one.
 */
export class LineItem {
  constructor(public readonly props: LineItemProps) {
    if (!Number.isInteger(props.quantity) || props.quantity < 1) {
      throw new Error("Line item quantity must be a positive integer");
    }
  }

  get product() {
    return this.props.product;
  }

  get quantity() {
    return this.props.quantity;
  }

  get total() {
    return this.product.price * this.quantity;
  }

  increment(): LineItem {
    return new LineItem({ ...this.props, quantity: this.quantity + 1 });
  }

  decrement(): LineItem {
    return new LineItem({ ...this.props, quantity: this.quantity - 1 });
  }
}
