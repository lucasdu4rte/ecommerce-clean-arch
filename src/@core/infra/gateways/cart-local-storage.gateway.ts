import { Cart } from "@/@core/domain/entities/cart";
import { Product, ProductProps } from "@/@core/domain/entities/product";
import { CartGateway } from "@/@core/domain/gateways/cart.gateway";

const CART_KEY = "cart";

export class CartLocalStorageGateway implements CartGateway {
  get(): Cart {
    const stored = this.storage?.getItem(CART_KEY);
    if (!stored) return new Cart({ products: [] });

    return new Cart({ products: this.parse(stored) });
  }

  save(cart: Cart): void {
    this.storage?.setItem(CART_KEY, JSON.stringify(cart.products.map((p) => p.props)));
  }

  private parse(stored: string): Product[] {
    try {
      const products: ProductProps[] = JSON.parse(stored);
      return products.map(
        ({ id, name, description, price }) => new Product({ id, name, description, price })
      );
    } catch {
      return [];
    }
  }

  private get storage() {
    return typeof localStorage === "undefined" ? null : localStorage;
  }
}
