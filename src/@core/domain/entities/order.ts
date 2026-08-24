import { Product } from "./product";

export type OrderProps = {
  id?: number;
  products: Product[];
  credit_card_number: string;
};

export class Order {
  constructor(public props: OrderProps) {
    if (props.products.length === 0) {
      throw new Error("Order must have at least one product");
    }
    if (!props.credit_card_number?.trim()) {
      throw new Error("Order must have a credit card number");
    }
  }

  get id() {
    return this.props.id;
  }

  get products() {
    return this.props.products;
  }

  get credit_card_number() {
    return this.props.credit_card_number;
  }

  get total() {
    return this.props.products.reduce((total, product) => total + product.price, 0);
  }
}
