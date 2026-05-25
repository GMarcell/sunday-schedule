import { prisma } from "@/lib/prisma";
import { handleError, ok } from "@/lib/http";
import { z } from "zod";

const roleSchema = z.object({ name: z.string().trim().min(1) });

export async function GET() {
  const roles = await prisma.role.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });
  return ok(roles);
}

export async function POST(request: Request) {
  try {
    const data = roleSchema.parse(await request.json());
    const role = await prisma.role.create({ data });
    return ok(role, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
