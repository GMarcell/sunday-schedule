import { auth } from "@/auth";
import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ memberId: z.string().nullable() });

export async function PUT(
  request: Request,
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
    const body = schema.parse(await request.json());
    const assignment = await prisma.assignment.update({
      where: { id: id },
      data: { memberId: body.memberId, overridden: true },
      include: { role: true, member: true },
    });
    return ok(assignment);
  } catch (error) {
    return handleError(error);
  }
}
