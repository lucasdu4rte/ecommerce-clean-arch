"use client";

import { useCart } from "@/contexts/cart.provider";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { formatPrice } from "./format";

export const CartPanel = () => {
  const { cart, removeProduct, clear, checkout } = useCart();
  const [creditCardNumber, setCreditCardNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const order = await checkout(creditCardNumber);
      router.push(`/orders/${order.id}`);
    } catch {
      setError("Checkout failed. Check the cart and the credit card number.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className="h-fit rounded border border-border p-4">
      <h2 className="mb-4 text-xl font-bold">Cart</h2>

      {cart.products.length === 0 ? (
        <p className="text-sm text-muted">Your cart is empty.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {cart.products.map((product, index) => (
            <li key={`${product.id}-${index}`} className="flex justify-between gap-2 text-sm">
              <span>{product.name}</span>
              <button
                type="button"
                className="text-muted hover:text-foreground"
                onClick={() => removeProduct(product.id)}
              >
                {formatPrice(product.price)} &times;
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mb-4 font-medium">Total: {formatPrice(cart.total)}</p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="w-full rounded border border-border bg-background px-2 py-1 text-sm text-foreground placeholder:text-muted"
          placeholder="Credit card number"
          inputMode="numeric"
          value={creditCardNumber}
          onChange={(event) => setCreditCardNumber(event.target.value)}
        />
        <button
          type="submit"
          disabled={submitting || cart.products.length === 0}
          className="w-full rounded bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-80 disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
        >
          {submitting ? "Processing..." : "Checkout"}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      {cart.products.length > 0 && (
        <button type="button" className="mt-2 text-sm text-muted underline hover:text-foreground" onClick={clear}>
          Clear cart
        </button>
      )}
    </aside>
  );
};
