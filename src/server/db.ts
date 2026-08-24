import { promises as fs } from "fs";
import path from "path";

export type ProductRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  [key: string]: unknown;
};

export type OrderRow = {
  id: number;
  products: ProductRow[];
  credit_card_number: string;
};

export type Database = {
  products: ProductRow[];
  orders: OrderRow[];
};

const dbFile = () => process.env.DB_FILE ?? path.join(process.cwd(), "db.json");

export async function readDatabase(): Promise<Database> {
  const raw = await fs.readFile(dbFile(), "utf-8");
  const { products = [], orders = [] } = JSON.parse(raw) as Partial<Database>;
  return { products, orders };
}

// ponytail: read-modify-write without locking; fine for a single-process dev store,
// swap for a real database if concurrent writes ever matter.
export async function writeDatabase(database: Database): Promise<void> {
  await fs.writeFile(dbFile(), `${JSON.stringify(database, null, 2)}\n`, "utf-8");
}

export const nextId = (rows: { id: number }[]) =>
  rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
