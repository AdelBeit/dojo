import type { NextRequest } from "next/server";
import { resetDb } from "@/lib/restaurant-bill/db";

// POST /api/dev/reset: restores the seed data.
export async function POST(request: NextRequest) {
  void request.nextUrl;
  resetDb();
  return Response.json({ ok: true });
}

// GET /api/dev/reset: restores the seed data.
export async function GET(request: NextRequest) {
  void request.nextUrl;
  resetDb();
  return Response.json({ ok: true });
}