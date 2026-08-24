import { AxiosInstance, isAxiosError } from "axios";
import { Order } from "../../domain/entities/order";
import { OrderGateway } from "../../domain/gateways/order.gateway";
import { LineItemDto, toLineItem, toLineItemDto } from "../mappers";

type OrderDto = {
  id?: number;
  items: LineItemDto[];
  credit_card_number: string;
};

export class OrderHttpGateway implements OrderGateway {
  constructor(private readonly http: AxiosInstance) {}

  async insert(order: Order): Promise<Order> {
    try {
      const { data } = await this.http.post<OrderDto>("/orders", toDto(order));
      return toOrder(data);
    } catch (error) {
      throw asRejection(error);
    }
  }

  async findById(id: number): Promise<Order> {
    const { data } = await this.http.get<OrderDto>(`/orders/${id}`);
    return toOrder(data);
  }
}

/**
 * Entities are serialized explicitly: handing an `Order` straight to axios would ship its
 * internal `props` wrapper and leak the domain's shape into the API contract.
 */
const toDto = (order: Order): OrderDto => ({
  items: order.items.map(toLineItemDto),
  credit_card_number: order.credit_card_number,
});

const toOrder = (dto: OrderDto) =>
  new Order({
    id: dto.id,
    items: dto.items.map(toLineItem),
    credit_card_number: dto.credit_card_number,
  });

/**
 * Translates a refusal from the API into a plain error carrying its reason, so callers never
 * have to know an axios response was involved to explain what went wrong.
 */
const asRejection = (error: unknown) => {
  if (!isAxiosError(error) || !error.response) return error;

  const { message } = (error.response.data ?? {}) as { message?: string };
  return new Error(message ?? "The order was rejected.");
};
