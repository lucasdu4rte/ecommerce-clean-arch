import { Cart } from "@/@core/domain/entities/cart";
import { LineItem } from "@/@core/domain/entities/line-item";
import { CartGateway } from "@/@core/domain/gateways/cart.gateway";
import { LineItemDto, toLineItem, toLineItemDto } from "../mappers";

const CART_KEY = "cart";

export class CartLocalStorageGateway implements CartGateway {
  get(): Cart {
    const stored = this.storage?.getItem(CART_KEY);

    return new Cart({ items: stored ? this.parse(stored) : [] });
  }

  save(cart: Cart): void {
    this.storage?.setItem(CART_KEY, JSON.stringify(cart.items.map(toLineItemDto)));
  }

  /** Anything the browser hands back that is not a readable cart is treated as no cart. */
  private parse(stored: string): LineItem[] {
    try {
      const items: LineItemDto[] = JSON.parse(stored);
      return items.map(toLineItem);
    } catch {
      return [];
    }
  }

  /** Undefined while rendering on the server, where there is no storage to read. */
  private get storage() {
    return typeof localStorage === "undefined" ? null : localStorage;
  }
}
