import { AxiosInstance } from "axios";
import { Order } from "../../domain/entities/order";
import { Product, ProductProps } from "../../domain/entities/product";
import { OrderGateway } from "../../domain/gateways/order.gateway";

type OrderPayload = {
  id?: number;
  products: ProductProps[];
  credit_card_number: string;
};

export class OrderHttpGateway implements OrderGateway {
  constructor(private readonly http: AxiosInstance) {}

  async insert(order: Order): Promise<Order> {
    const { data } = await this.http.post<OrderPayload>("/orders", toPayload(order));
    return toOrder(data);
  }

  async findById(id: number): Promise<Order> {
    const { data } = await this.http.get<OrderPayload>(`/orders/${id}`);
    return toOrder(data);
  }
}

const toPayload = (order: Order): OrderPayload => ({
  products: order.products.map(({ id, name, description, price }) => ({
    id,
    name,
    description,
    price,
  })),
  credit_card_number: order.credit_card_number,
});

const toOrder = (payload: OrderPayload) =>
  new Order({
    id: payload.id,
    products: payload.products.map(
      ({ id, name, description, price }) => new Product({ id, name, description, price })
    ),
    credit_card_number: payload.credit_card_number,
  });
