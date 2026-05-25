import { addDays, parseDateParam } from "@/lib/dates";
import { ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { getRoster } from "@/lib/scheduler";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = parseDateParam(url.searchParams.get("date"));
  return ok(await getRoster(prisma, date, addDays(date, 1), true));
}
