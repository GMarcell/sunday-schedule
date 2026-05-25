import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().trim().min(1),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  recurrence: z.enum(["weekly", "biweekly", "monthly", "once"]),
  dayOfWeek: z.number().int().min(0).max(6).nullable().default(0),
  active: z.boolean().default(true),
  roleIds: z.array(z.string()).min(1)
});

export async function GET() {
  const services = await prisma.serviceTemplate.findMany({
    include: { roles: { include: { role: true } } },
    orderBy: [{ active: "desc" }, { time: "asc" }]
  });
  return ok(services);
}

export async function POST(request: Request) {
  try {
    const data = serviceSchema.parse(await request.json());
    const service = await prisma.serviceTemplate.create({
      data: {
        name: data.name,
        time: data.time,
        recurrence: data.recurrence,
        dayOfWeek: data.dayOfWeek,
        active: data.active,
        roles: { create: data.roleIds.map((roleId) => ({ roleId })) }
      },
      include: { roles: { include: { role: true } } }
    });
    return ok(service, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
