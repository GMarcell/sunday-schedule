import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const memberSchema = z.object({
  name: z.string().trim().min(1),
  active: z.boolean().default(true),
  roleIds: z.array(z.string()).default([])
});

export async function GET() {
  const members = await prisma.member.findMany({
    include: { roles: { include: { role: true } } },
    orderBy: { name: "asc" }
  });
  return ok(members);
}

export async function POST(request: Request) {
  try {
    const data = memberSchema.parse(await request.json());
    const member = await prisma.member.create({
      data: {
        name: data.name,
        active: data.active,
        roles: { create: data.roleIds.map((roleId) => ({ roleId })) }
      },
      include: { roles: { include: { role: true } } }
    });
    return ok(member, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
