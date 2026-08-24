import { readDatabase } from "@/server/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { orders } = await readDatabase();
  const order = orders.find((candidate) => candidate.id === Number(params.id));

  if (!order) {
    return Response.json({ message: "Order not found" }, { status: 404 });
  }

  return Response.json(order);
}
