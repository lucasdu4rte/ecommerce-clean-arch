import { ListProductsUseCase } from "@/@core/application/product/list-products.use-case";
import { Registry, container } from "@/@core/infra/container-registry";
import { CartPanel } from "./cart-panel";
import { ProductList } from "./product-list";

export const dynamic = "force-dynamic";

export default async function Home() {
  const listProducts = container.get<ListProductsUseCase>(Registry.ListProductsUseCase);
  const products = await listProducts.execute();

  return (
    <main className="mx-auto grid max-w-4xl gap-8 p-8 md:grid-cols-[2fr_1fr]">
      <ProductList products={products.map((product) => product.props)} />
      <CartPanel />
    </main>
  );
}
