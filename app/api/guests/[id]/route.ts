import type { NextRequest } from "next/server";
import { applyBehavior } from "@/lib/restaurant-bill/behavior";
import { getGuest } from "@/lib/restaurant-bill/db";

// GET /api/guests/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const failure = await applyBehavior(request);
  if (failure) return failure;
  const { id } = await params;
  const guest = getGuest(id);
  if (!guest) return Response.json({ error: "Guest not found" }, { status: 404 });
  return Response.json(guest);
}
