import { Order } from "@/@core/domain/entities/order";
import { CartGateway } from "@/@core/domain/gateways/cart.gateway";
import { OrderGateway } from "@/@core/domain/gateways/order.gateway";

export type CheckoutInput = {
  credit_card_number: string;
};

/**
 * Turns the current cart into a persisted order and empties it.
 *
 * The cart is only cleared after the order comes back from the gateway: a failed checkout
 * must leave the customer's cart untouched.
 */
export class CheckoutUseCase {
  constructor(
    private readonly cartGateway: CartGateway,
    private readonly orderGateway: OrderGateway
  ) {}

  async execute(input: CheckoutInput): Promise<Order> {
    const cart = this.cartGateway.get();
    const order = await this.orderGateway.insert(
      new Order({ items: [...cart.items], credit_card_number: input.credit_card_number })
    );

    cart.clear();
    this.cartGateway.save(cart);

    return order;
  }
}
