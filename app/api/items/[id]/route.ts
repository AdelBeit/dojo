import type { NextRequest } from "next/server";
import { applyBehavior } from "@/lib/restaurant-bill/behavior";
import { setPaid } from "@/lib/restaurant-bill/db";

// PATCH /api/items/:id  body: { paid: boolean }
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const failure = await applyBehavior(request);
  if (failure) return failure;
  const { id } = await params;
  const { paid } = (await request.json()) as { paid: boolean };
  const item = setPaid(id, paid);
  if (!item) return Response.json({ error: "Item not found" }, { status: 404 });
  return Response.json(item);
}
