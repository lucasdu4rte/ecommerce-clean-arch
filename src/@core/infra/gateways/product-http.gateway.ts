import { AxiosInstance } from "axios";
import { Product, ProductProps } from "../../domain/entities/product";
import { ProductGateway } from "../../domain/gateways/product.gateway";

export class ProductHttpGateway implements ProductGateway {
  constructor(private readonly http: AxiosInstance) {}

  async findAll(): Promise<Product[]> {
    const { data } = await this.http.get<ProductProps[]>("/products");
    return data.map(toProduct);
  }

  async findById(id: number): Promise<Product> {
    const { data } = await this.http.get<ProductProps>(`/products/${id}`);
    return toProduct(data);
  }
}

const toProduct = ({ id, name, description, price }: ProductProps) =>
  new Product({ id, name, description, price });
