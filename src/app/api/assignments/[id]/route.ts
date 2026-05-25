import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ memberId: z.string().nullable() });

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = schema.parse(await request.json());
    const assignment = await prisma.assignment.update({
      where: { id: params.id },
      data: { memberId: body.memberId, overridden: true },
      include: { role: true, member: true }
    });
    return ok(assignment);
  } catch (error) {
    return handleError(error);
  }
}
