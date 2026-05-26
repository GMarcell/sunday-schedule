import { Prisma, PrismaClient } from "@prisma/client";
import { addDays, startOfDay } from "./dates";

type Db = PrismaClient | Prisma.TransactionClient;

export async function generateSchedule(db: Db, start: Date, end: Date) {
  // 1. Get services already scheduled in that range
  const services = await db.serviceTemplate.findMany({
    where: {
      active: true,
      datetime: {
        gte: start,
        lte: end,
      },
    },
    include: {
      roles: { include: { role: true } },
    },
    orderBy: { datetime: "asc" },
  });

  const generated: string[] = [];

  for (const service of services) {
    // 2. Create instance ONLY for existing service datetime
    const instance = await db.serviceInstance.upsert({
      where: {
        date_serviceId: {
          date: service.datetime,
          serviceId: service.id,
        },
      },
      update: {},
      create: {
        date: service.datetime,
        serviceId: service.id,
      },
      include: {
        assignments: true,
      },
    });

    await autoAssignInstance(db, instance.id);
    generated.push(instance.id);
  }

  return generated;
}

export async function autoAssignInstance(db: Db, instanceId: string) {
  const instance = await db.serviceInstance.findUniqueOrThrow({
    where: { id: instanceId },
    include: {
      service: { include: { roles: { include: { role: true } } } },
      assignments: true,
    },
  });

  const usedToday = new Set(
    (
      await db.assignment.findMany({
        where: {
          memberId: { not: null },
          instance: { date: instance.date },
          NOT: { instanceId },
        },
        select: { memberId: true },
      })
    )
      .map((assignment) => assignment.memberId)
      .filter(Boolean) as string[],
  );

  for (const serviceRole of instance.service.roles) {
    const existing = instance.assignments.find(
      (assignment) => assignment.roleId === serviceRole.roleId,
    );
    if (existing?.overridden) continue;

    const eligible = await db.member.findMany({
      where: { active: true, roles: { some: { roleId: serviceRole.roleId } } },
      include: {
        assignments: {
          where: { roleId: serviceRole.roleId, memberId: { not: null } },
          include: { instance: true },
          orderBy: { instance: { date: "desc" } },
          take: 1,
        },
      },
    });

    const sorted = eligible.sort((a, b) => {
      const aLast = a.assignments[0]?.instance.date.getTime() ?? 0;
      const bLast = b.assignments[0]?.instance.date.getTime() ?? 0;
      return aLast - bLast || a.name.localeCompare(b.name);
    });

    const sameDayFiltered = sorted.filter(
      (member) => !usedToday.has(member.id),
    );
    const assignee = sameDayFiltered[0] ?? sorted[0] ?? null;
    if (assignee) usedToday.add(assignee.id);

    await db.assignment.upsert({
      where: { instanceId_roleId: { instanceId, roleId: serviceRole.roleId } },
      update: { memberId: assignee?.id ?? null, overridden: false },
      create: {
        instanceId,
        roleId: serviceRole.roleId,
        memberId: assignee?.id ?? null,
      },
    });
  }
}

export async function getRoster(
  db: Db,
  start: Date,
  end: Date,
  publicOnly = false,
) {
  return db.serviceInstance.findMany({
    where: {
      date: { gte: startOfDay(start), lt: startOfDay(addDays(end, 1)) },
      ...(publicOnly ? { published: true } : {}),
    },
    include: {
      service: true,
      assignments: {
        include: { role: true, member: true },
        orderBy: { role: { name: "asc" } },
      },
    },
    orderBy: [{ date: "asc" }, { service: { name: "asc" } }],
  });
}
