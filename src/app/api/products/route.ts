import { readDatabase } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const { products } = await readDatabase();
  return Response.json(products);
}
