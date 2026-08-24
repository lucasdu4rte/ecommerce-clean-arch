import { Cart } from "@/@core/domain/entities/cart";
import { Order } from "@/@core/domain/entities/order";
import { Product } from "@/@core/domain/entities/product";
import { CartGateway } from "@/@core/domain/gateways/cart.gateway";
import { OrderGateway } from "@/@core/domain/gateways/order.gateway";
import { ProductGateway } from "@/@core/domain/gateways/product.gateway";

export class InMemoryCartGateway implements CartGateway {
  constructor(private products: Product[] = []) {}

  get(): Cart {
    return new Cart({ products: [...this.products] });
  }

  save(cart: Cart): void {
    this.products = [...cart.products];
  }
}

export class InMemoryProductGateway implements ProductGateway {
  constructor(private readonly products: Product[]) {}

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: number): Promise<Product> {
    const product = this.products.find((candidate) => candidate.id === id);

    if (!product) {
      throw new Error(`Product ${id} not found`);
    }

    return product;
  }
}

export class InMemoryOrderGateway implements OrderGateway {
  readonly orders: Order[] = [];

  async insert(order: Order): Promise<Order> {
    const persisted = new Order({ ...order.props, id: this.orders.length + 1 });
    this.orders.push(persisted);
    return persisted;
  }

  async findById(id: number): Promise<Order> {
    const order = this.orders.find((candidate) => candidate.id === id);

    if (!order) {
      throw new Error(`Order ${id} not found`);
    }

    return order;
  }
}
