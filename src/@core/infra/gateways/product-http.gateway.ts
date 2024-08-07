import { AxiosInstance } from "axios"
import { Product } from "../../domain/entities/product"
import { ProductGateway } from "../../domain/gateways/product.gateway"

export class ProductHttpGateway implements ProductGateway {
  constructor(private http: AxiosInstance) {}

  async findAll(): Promise<Product[]> {
    return this.http.get<Product[]>('/products')
      .then(res => res.data)
      .then(data => data.map((product) => new Product({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
      })))
  }
  async findById(id: number): Promise<Product> {
    return this.http.get<Product>(`/products/${id}`).then(res => res.data)
  }
}