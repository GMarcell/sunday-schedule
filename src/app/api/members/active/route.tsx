import { ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const members = await prisma.member.findMany({
    where: {
      active: true,
    },
    include: { roles: { include: { role: true } } },
    orderBy: { name: "asc" },
  });
  return ok(members);
}
