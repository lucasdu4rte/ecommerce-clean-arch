import { Product } from "@/@core/domain/entities/product";
import { ProductGateway } from "@/@core/domain/gateways/product.gateway";

export class GetProductUseCase {
  constructor(private readonly productGateway: ProductGateway) {}

  execute(id: number): Promise<Product> {
    return this.productGateway.findById(id);
  }
}
