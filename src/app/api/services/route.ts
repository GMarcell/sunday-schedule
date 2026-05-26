import { auth } from "@/auth";
import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().trim().min(1),
  datetime: z.coerce.date(),
  active: z.boolean().default(true),
  roleIds: z.array(z.string()).min(1),
});

export async function GET() {
  const services = await prisma.serviceTemplate.findMany({
    include: { roles: { include: { role: true } } },
    orderBy: [{ active: "desc" }, { datetime: "asc" }],
  });
  return ok(services);
}

export async function POST(request: Request) {
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
    const service = await prisma.serviceTemplate.create({
      data: {
        name: data.name,
        datetime: data.datetime,
        active: data.active,
        roles: { create: data.roleIds.map((roleId) => ({ roleId })) },
      },
      include: { roles: { include: { role: true } } },
    });
    return ok(service, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
