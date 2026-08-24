import { LineItem } from "./line-item";
import { Product } from "./product";

export type CartProps = {
  items: LineItem[];
};

/**
 * The products a customer intends to buy, grouped by product: adding the same product twice
 * raises its quantity instead of creating a second line.
 */
export class Cart {
  constructor(public readonly props: CartProps) {}

  get items(): readonly LineItem[] {
    return this.props.items;
  }

  get isEmpty() {
    return this.props.items.length === 0;
  }

  get total() {
    return this.props.items.reduce((total, item) => total + item.total, 0);
  }

  addProduct(product: Product) {
    const index = this.indexOf(product.id);

    if (index < 0) {
      this.props.items.push(new LineItem({ product, quantity: 1 }));
      return;
    }

    this.props.items[index] = this.props.items[index].increment();
  }

  /** Takes a single unit out, dropping the line once its last unit is gone. */
  removeProduct(productId: number) {
    const index = this.indexOf(productId);

    if (index < 0) return;

    const item = this.props.items[index];

    if (item.quantity === 1) {
      this.props.items.splice(index, 1);
      return;
    }

    this.props.items[index] = item.decrement();
  }

  clear() {
    this.props.items = [];
  }

  private indexOf(productId: number) {
    return this.props.items.findIndex((item) => item.product.id === productId);
  }
}
