import { parseDateParam } from "@/lib/dates";
import { ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { getRoster } from "@/lib/scheduler";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const startParam = url.searchParams.get("start");
  const endParam = url.searchParams.get("end");

  if (!startParam || !endParam) {
    return new Response("Missing start/end", { status: 400 });
  }

  const start = parseDateParam(startParam);
  const end = parseDateParam(endParam);

  return ok(await getRoster(prisma, start, end));
}
