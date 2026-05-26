import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const memberSchema = z.object({
  name: z.string().trim().min(1),
  active: z.boolean(),
  roleIds: z.array(z.string()).default([]),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const data = memberSchema.parse(await request.json());
    const member = await prisma.$transaction(async (tx) => {
      await tx.memberRole.deleteMany({ where: { memberId: id } });
      return tx.member.update({
        where: { id: id },
        data: {
          name: data.name,
          active: data.active,
          roles: { create: data.roleIds.map((roleId) => ({ roleId })) },
        },
        include: { roles: { include: { role: true } } },
      });
    });
    return ok(member);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    await prisma.member.delete({ where: { id: id } });
    return ok({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
