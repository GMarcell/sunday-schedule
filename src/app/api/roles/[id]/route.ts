import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const usage = await prisma.role.findUnique({
      where: { id: params.id },
      include: { members: true, services: true, assignments: true }
    });
    if (!usage) return ok({ error: "Role not found" }, { status: 404 });

    if (usage.assignments.length > 0) {
      const role = await prisma.role.update({ where: { id: params.id }, data: { deletedAt: new Date() } });
      return ok({ role, warning: "Role was archived because past assignments reference it." });
    }

    await prisma.role.delete({ where: { id: params.id } });
    return ok({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
