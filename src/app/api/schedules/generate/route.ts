import { auth } from "@/auth";
import { parseDateParam } from "@/lib/dates";
import { handleError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { generateSchedule } from "@/lib/scheduler";
import { z } from "zod";

const schema = z.object({ start: z.string(), end: z.string() });

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
    const body = schema.parse(await request.json());
    const generated = await generateSchedule(
      prisma,
      parseDateParam(body.start),
      parseDateParam(body.end),
    );
    return ok({ generated: generated.length });
  } catch (error) {
    return handleError(error);
  }
}
