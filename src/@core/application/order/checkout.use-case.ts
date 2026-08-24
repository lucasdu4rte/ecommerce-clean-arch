import { Order } from "@/@core/domain/entities/order";
import { CartGateway } from "@/@core/domain/gateways/cart.gateway";
import { OrderGateway } from "@/@core/domain/gateways/order.gateway";

export type CheckoutInput = {
  credit_card_number: string;
};

export class CheckoutUseCase {
  constructor(
    private readonly cartGateway: CartGateway,
    private readonly orderGateway: OrderGateway
  ) {}

  async execute(input: CheckoutInput): Promise<Order> {
    const cart = this.cartGateway.get();
    const order = await this.orderGateway.insert(
      new Order({
        products: cart.products,
        credit_card_number: input.credit_card_number,
      })
    );

    cart.clear();
    this.cartGateway.save(cart);

    return order;
  }
}
