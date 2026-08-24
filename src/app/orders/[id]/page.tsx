import { GetOrderUseCase } from "@/@core/application/order/get-order.use-case";
import { Registry, container } from "@/@core/infra/container-registry";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "../../format";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const getOrder = container.get<GetOrderUseCase>(Registry.GetOrderUseCase);
  const order = await getOrder.execute(Number(params.id)).catch(() => null);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-8">
      <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      <p className="text-sm text-muted">Paid with {order.credit_card_number}</p>

      <ul className="space-y-2">
        {order.items.map((item) => (
          <li
            key={item.product.id}
            className="flex justify-between rounded border border-border p-3"
          >
            <span>
              {item.product.name}
              {item.quantity > 1 && <span className="text-muted"> &times;{item.quantity}</span>}
            </span>
            <span>{formatPrice(item.total)}</span>
          </li>
        ))}
      </ul>

      <p className="font-medium">Total: {formatPrice(order.total)}</p>

      <Link href="/" className="text-sm underline">
        Back to products
      </Link>
    </main>
  );
}
