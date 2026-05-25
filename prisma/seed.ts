import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roleNames = ["SoD", "PPT", "Sound", "OBS"];
  const roles = await Promise.all(
    roleNames.map((name) =>
      prisma.role.upsert({ where: { name }, update: { deletedAt: null }, create: { name } })
    )
  );

  const byName = Object.fromEntries(roles.map((role) => [role.name, role]));
  const members = [
    { name: "James", roles: ["SoD", "OBS"] },
    { name: "Sarah", roles: ["PPT", "OBS"] },
    { name: "Mike", roles: ["PPT", "Sound"] },
    { name: "Tom", roles: ["SoD", "OBS"] },
    { name: "Anna", roles: ["PPT", "Sound", "OBS"] },
    { name: "David", roles: ["Sound"] },
    { name: "Lee", roles: ["SoD", "OBS"] }
  ];

  for (const member of members) {
    const existing = await prisma.member.findFirst({ where: { name: member.name } });
    const saved = existing
      ? await prisma.member.update({ where: { id: existing.id }, data: { active: true } })
      : await prisma.member.create({ data: { name: member.name } });

    await prisma.memberRole.deleteMany({ where: { memberId: saved.id } });
    await prisma.memberRole.createMany({
      data: member.roles.map((role) => ({ memberId: saved.id, roleId: byName[role].id })),
      skipDuplicates: true
    });
  }

  const templates = [
    { name: "Sunday Morning", time: "09:00", roles: ["SoD", "PPT", "Sound", "OBS"] },
    { name: "Sunday Evening", time: "18:00", roles: ["PPT", "Sound", "OBS"] }
  ];

  for (const template of templates) {
    const existing = await prisma.serviceTemplate.findFirst({ where: { name: template.name } });
    const saved = existing
      ? await prisma.serviceTemplate.update({
          where: { id: existing.id },
          data: { time: template.time, recurrence: "weekly", dayOfWeek: 0, active: true }
        })
      : await prisma.serviceTemplate.create({
          data: { name: template.name, time: template.time, recurrence: "weekly", dayOfWeek: 0 }
        });

    await prisma.serviceRole.deleteMany({ where: { serviceId: saved.id } });
    await prisma.serviceRole.createMany({
      data: template.roles.map((role) => ({ serviceId: saved.id, roleId: byName[role].id })),
      skipDuplicates: true
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
