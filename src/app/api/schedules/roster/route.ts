import { addDays, parseDateParam } from "@/lib/dates";
import { ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { getRoster } from "@/lib/scheduler";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const start = parseDateParam(url.searchParams.get("week"));
  return ok(await getRoster(prisma, start, addDays(start, 7)));
}
