"use client";

import { Product, ProductProps } from "@/@core/domain/entities/product";
import { useCart } from "@/contexts/cart.provider";
import { formatPrice } from "./format";

export const ProductList = ({ products }: { products: ProductProps[] }) => {
  const { addProduct } = useCart();

  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      <ul className="space-y-3">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between gap-4 rounded border border-border p-4"
          >
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted">{product.description}</p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded bg-foreground px-3 py-1 text-sm font-medium text-background hover:opacity-80"
              onClick={() => addProduct(new Product(product))}
            >
              Add {formatPrice(product.price)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
