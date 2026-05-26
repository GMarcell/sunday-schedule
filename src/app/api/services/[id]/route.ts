import { auth } from "@/auth";
import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().trim().min(1),
  datetime: z.coerce.date(),
  active: z.boolean(),
  roleIds: z.array(z.string()).min(1),
});

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role === "demo") {
      return { error: "Demo account is read-only." };
    }
    const data = serviceSchema.parse(await request.json());

    const service = await prisma.$transaction(async (tx) => {
      await tx.serviceRole.deleteMany({
        where: {
          serviceId: id,
        },
      });

      return tx.serviceTemplate.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          datetime: data.datetime,
          active: data.active,
          roles: {
            create: data.roleIds.map((roleId) => ({
              roleId,
            })),
          },
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    });

    return ok(service);
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
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role === "demo") {
      return { error: "Demo account is read-only." };
    }
    await prisma.serviceTemplate.delete({
      where: {
        id,
      },
    });

    return ok({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
