import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().trim().min(1),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  date: z.date(),
  active: z.boolean(),
  roleIds: z.array(z.string()).min(1),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const data = serviceSchema.parse(await request.json());
    const service = await prisma.$transaction(async (tx) => {
      await tx.serviceRole.deleteMany({ where: { serviceId: params.id } });
      return tx.serviceTemplate.update({
        where: { id: params.id },
        data: {
          name: data.name,
          time: data.time,
          date: data.date.toDateString(),
          active: data.active,
          roles: { create: data.roleIds.map((roleId) => ({ roleId })) },
        },
        include: { roles: { include: { role: true } } },
      });
    });
    return ok(service);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.serviceTemplate.delete({ where: { id: params.id } });
    return ok({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
