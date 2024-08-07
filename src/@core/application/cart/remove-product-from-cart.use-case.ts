import { Cart } from "@/@core/domain/entities/cart";
import { CartGateway } from "@/@core/domain/gateways/cart.gateway";

export class RemoveProductFromCartUseCase {
  constructor(private cartGateway: CartGateway) {}

  execute(productId: number): Cart {
    const cart = this.cartGateway.get();
    cart.removeProduct(productId);
    this.cartGateway.save(cart);
    return cart;
  }
}