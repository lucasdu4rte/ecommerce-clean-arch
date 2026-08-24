import { LineItemRow, OrderRow, nextId, readDatabase, writeDatabase } from "@/server/db";

const CREDIT_CARD = /^\d{13,19}$/;

type OrderRequest = {
  items: LineItemRow[];
  credit_card_number: string;
};

/** The API trusts nothing the client sends: this is the boundary the domain sits behind. */
function validate(body: unknown): string | null {
  const { items, credit_card_number } = (body ?? {}) as Partial<OrderRequest>;

  if (!Array.isArray(items) || items.length === 0) {
    return "items must be a non-empty list";
  }
  if (
    items.some(
      ({ product }) => typeof product?.id !== "number" || typeof product?.price !== "number"
    )
  ) {
    return "every item must carry a product with a numeric id and price";
  }
  if (items.some(({ quantity }) => !Number.isInteger(quantity) || quantity < 1)) {
    return "every item quantity must be a positive integer";
  }
  if (typeof credit_card_number !== "string" || !CREDIT_CARD.test(credit_card_number)) {
    return "credit_card_number must contain 13 to 19 digits";
  }
  return null;
}

/** Card numbers are never stored: only the last four digits survive the request. */
const mask = (creditCardNumber: string) => `**** **** **** ${creditCardNumber.slice(-4)}`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const error = validate(body);

  if (error) {
    return Response.json({ message: error }, { status: 422 });
  }

  const { items, credit_card_number } = body as OrderRequest;
  const database = await readDatabase();
  const order: OrderRow = {
    id: nextId(database.orders),
    items,
    credit_card_number: mask(credit_card_number),
  };

  database.orders.push(order);
  await writeDatabase(database);

  return Response.json(order, { status: 201 });
}
