import { readDatabase } from "@/server/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { products } = await readDatabase();
  const product = products.find((candidate) => candidate.id === Number(params.id));

  if (!product) {
    return Response.json({ message: "Product not found" }, { status: 404 });
  }

  return Response.json(product);
}
