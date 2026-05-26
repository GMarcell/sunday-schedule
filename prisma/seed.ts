import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const roleNames = ["SoD", "PPT", "Sound", "OBS"];
  const roles = await Promise.all(
    roleNames.map((name) =>
      prisma.role.upsert({
        where: { name },
        update: { deletedAt: null },
        create: { name },
      }),
    ),
  );

  const password = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@example.com",
      password,
    },
  });

  const byName = Object.fromEntries(roles.map((role) => [role.name, role]));
  const members = [
    { name: "Kefas", roles: ["OBS", "Sound"] },
    { name: "Chris", roles: ["Sound"] },
    { name: "Frency", roles: ["SoD", "OBS"] },
    { name: "Kirby", roles: ["SoD", "OBS"] },
    { name: "Clarrisa", roles: ["PPT", "OBS"] },
    { name: "Juan", roles: ["Sound", "SoD"] },
    { name: "Natiar", roles: ["OBS", "SoD"] },
    { name: "Junior", roles: ["OBS", "PPT"] },
    { name: "Johan", roles: ["Sound", "OBS"] },
    { name: "Rilly", roles: ["SoD", "OBS"] },
    { name: "Vierena", roles: ["SoD", "OBS"] },
    { name: "Nicole", roles: ["PPT", "OBS"] },
    { name: "Jeremi", roles: ["OBS", "SoD"] },
    { name: "Yehezkiel", roles: ["PPT", "OBS"] },
    { name: "Gerald", roles: ["Sound", "OBS"] },
    { name: "Graciella", roles: ["OBS", "PPT"] },
    { name: "Moses", roles: ["PPT"] },
    { name: "Tanto", roles: ["SoD", "Sound"] },
    { name: "Pascal", roles: ["PPT"] },
    { name: "Vecky", roles: ["Sound"] },
    { name: "Grand", roles: ["OBS", "Sound"] },
    { name: "Juniko", roles: ["OBS"] },
    { name: "Netta", roles: ["PPT", "OBS"] },
  ];

  for (const member of members) {
    const existing = await prisma.member.findFirst({
      where: { name: member.name },
    });
    const saved = existing
      ? await prisma.member.update({
          where: { id: existing.id },
          data: { active: true },
        })
      : await prisma.member.create({ data: { name: member.name } });

    await prisma.memberRole.deleteMany({ where: { memberId: saved.id } });
    await prisma.memberRole.createMany({
      data: member.roles.map((role) => ({
        memberId: saved.id,
        roleId: byName[role].id,
      })),
      skipDuplicates: true,
    });
  }

  const templates = [
    {
      name: "Sunday Morning",
      time: "09:00",
      date: new Date(),
      roles: ["SoD", "PPT", "Sound", "OBS"],
    },
    { name: "Sunday Evening", time: "18:00", roles: ["PPT", "Sound", "OBS"] },
  ];

  for (const template of templates) {
    const existing = await prisma.serviceTemplate.findFirst({
      where: { name: template.name },
    });
    const saved = existing
      ? await prisma.serviceTemplate.update({
          where: { id: existing.id },
          data: {
            time: template.time,
            datetime: new Date(),
            active: true,
          },
        })
      : await prisma.serviceTemplate.create({
          data: {
            name: template.name,
            datetime: new Date(),
          },
        });

    await prisma.serviceRole.deleteMany({ where: { serviceId: saved.id } });
    await prisma.serviceRole.createMany({
      data: template.roles.map((role) => ({
        serviceId: saved.id,
        roleId: byName[role].id,
      })),
      skipDuplicates: true,
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
