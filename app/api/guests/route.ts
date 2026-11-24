import type { NextRequest } from "next/server";
import { applyBehavior } from "@/lib/restaurant-bill/behavior";
import { listGuests } from "@/lib/restaurant-bill/db";

// GET /api/guests
export async function GET(request: NextRequest) {
  const failure = await applyBehavior(request);
  if (failure) return failure;
  return Response.json(listGuests());
}
