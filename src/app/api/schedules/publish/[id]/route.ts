import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function POST(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const instance = await prisma.serviceInstance.update({
      where: { id: id },
      data: { published: true },
      include: {
        service: true,
        assignments: { include: { role: true, member: true } },
      },
    });
    return ok(instance);
  } catch (error) {
    return handleError(error);
  }
}
