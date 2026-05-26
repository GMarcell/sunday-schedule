import { auth } from "@/auth";
import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (user?.role === "demo") {
      return NextResponse.json({ error: "Demo account is read-only." });
    }
    const usage = await prisma.role.findUnique({
      where: { id: id },
      include: { members: true, services: true, assignments: true },
    });
    if (!usage) return ok({ error: "Role not found" }, { status: 404 });

    if (usage.assignments.length > 0) {
      const role = await prisma.role.update({
        where: { id: id },
        data: { deletedAt: new Date() },
      });
      return ok({
        role,
        warning: "Role was archived because past assignments reference it.",
      });
    }

    await prisma.role.delete({ where: { id: id } });
    return ok({ ok: true });
  } catch (error) {
    return handleError(error);
  }
}
