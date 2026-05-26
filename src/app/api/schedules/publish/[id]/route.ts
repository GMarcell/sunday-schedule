import { auth } from "@/auth";
import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
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
