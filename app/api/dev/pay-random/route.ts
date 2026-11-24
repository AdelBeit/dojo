import type { NextRequest } from "next/server";
import { payRandom } from "@/lib/restaurant-bill/db";

// POST /api/dev/pay-random: marks a random unpaid item as paid ("paid at the counter").
export async function POST(request: NextRequest) {
  void request.nextUrl;
  return Response.json(payRandom() ?? { error: "Nothing left to pay" });
}
