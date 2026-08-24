import { Product } from "../entities/product";

/**
 * How the application reads the catalogue. The domain owns this contract; whichever adapter
 * fulfils it (HTTP today, a database or an in-memory fake in tests) is an outer-layer detail.
 */
export interface ProductGateway {
  findAll(): Promise<Product[]>;
  /** Rejects when no product carries the given id. */
  findById(id: number): Promise<Product>;
}
