import type { NextRequest } from "next/server";

// Every mock endpoint calls this first. Pick a behavior with the `d` query param:
//   (none) normal: ~300ms
//   slow:   ~1.5s
//   flaky:  ~half of requests fail with 503
//   fail:   always 500
export async function applyBehavior(request: NextRequest): Promise<Response | null> {
  const d = request.nextUrl.searchParams.get("d") ?? "normal";
  await new Promise((resolve) => setTimeout(resolve, d === "slow" ? 1500 : 300));
  if (d === "fail") return Response.json({ error: "Mock failure" }, { status: 500 });
  if (d === "flaky" && Math.random() < 0.5) {
    return Response.json({ error: "Flaky failure, try again" }, { status: 503 });
  }
  return null;
}
