import { LineItem } from "./line-item";

export type OrderProps = {
  id?: number;
  items: LineItem[];
  credit_card_number: string;
};

/** A checked out cart. Its invariants are what the payment provider would refuse to charge. */
export class Order {
  constructor(public readonly props: OrderProps) {
    if (props.items.length === 0) {
      throw new Error("Order must have at least one product");
    }
    if (!props.credit_card_number?.trim()) {
      throw new Error("Order must have a credit card number");
    }
  }

  get id() {
    return this.props.id;
  }

  get items(): readonly LineItem[] {
    return this.props.items;
  }

  get credit_card_number() {
    return this.props.credit_card_number;
  }

  get total() {
    return this.props.items.reduce((total, item) => total + item.total, 0);
  }
}
