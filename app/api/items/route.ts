import type { NextRequest } from "next/server";
import { applyBehavior } from "@/lib/restaurant-bill/behavior";
import { createItem, listItems } from "@/lib/restaurant-bill/db";
import type { NewItem } from "@/lib/restaurant-bill/types";

// GET /api/items?limit=60
export async function GET(request: NextRequest) {
  const failure = await applyBehavior(request);
  if (failure) return failure;
  const limit = Number(request.nextUrl.searchParams.get("limit")) || undefined;
  return Response.json(listItems(limit));
}

// POST /api/items  body: { guestId, name, priceCents }
export async function POST(request: NextRequest) {
  const failure = await applyBehavior(request);
  if (failure) return failure;
  const result = createItem((await request.json()) as NewItem);
  if (typeof result === "string") return Response.json({ error: result }, { status: 400 });
  return Response.json(result, { status: 201 });
}
