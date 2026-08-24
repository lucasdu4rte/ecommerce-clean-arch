import { Order } from "../entities/order";

/** How placed orders are persisted and read back. */
export interface OrderGateway {
  /** Returns the order as stored, carrying the id assigned by the backend. */
  insert(order: Order): Promise<Order>;
  /** Rejects when no order carries the given id. */
  findById(id: number): Promise<Order>;
}
