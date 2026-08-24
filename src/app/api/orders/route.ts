import { OrderRow, ProductRow, nextId, readDatabase, writeDatabase } from "@/server/db";

const CREDIT_CARD = /^\d{13,19}$/;

type OrderRequest = {
  products: ProductRow[];
  credit_card_number: string;
};

function validate(body: unknown): string | null {
  const { products, credit_card_number } = (body ?? {}) as Partial<OrderRequest>;

  if (!Array.isArray(products) || products.length === 0) {
    return "products must be a non-empty list";
  }
  if (products.some(({ id, price }) => typeof id !== "number" || typeof price !== "number")) {
    return "every product must have a numeric id and price";
  }
  if (typeof credit_card_number !== "string" || !CREDIT_CARD.test(credit_card_number)) {
    return "credit_card_number must contain 13 to 19 digits";
  }
  return null;
}

const mask = (creditCardNumber: string) => `**** **** **** ${creditCardNumber.slice(-4)}`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const error = validate(body);

  if (error) {
    return Response.json({ message: error }, { status: 422 });
  }

  const { products, credit_card_number } = body as OrderRequest;
  const database = await readDatabase();
  const order: OrderRow = {
    id: nextId(database.orders),
    products,
    credit_card_number: mask(credit_card_number),
  };

  database.orders.push(order);
  await writeDatabase(database);

  return Response.json(order, { status: 201 });
}
