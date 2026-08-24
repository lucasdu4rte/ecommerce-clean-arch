import { Cart } from "../entities/cart";

/**
 * Where the in-progress cart lives between interactions.
 *
 * Deliberately synchronous: the cart belongs to a single browser session and the only adapter that
 * needs it today is browser storage, so promising asynchrony would buy nothing.
 */
export interface CartGateway {
  /** Returns an empty cart when nothing was ever saved. */
  get(): Cart;
  save(cart: Cart): void;
}
