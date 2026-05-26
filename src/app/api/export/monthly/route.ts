export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { monthRange } from "@/lib/dates";
import { toCsv, toPdf, toXlsx } from "@/lib/export";
import { prisma } from "@/lib/prisma";
import { getRoster } from "@/lib/scheduler";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "csv";
  const range = monthRange(url.searchParams.get("month"));
  const roster = await getRoster(prisma, range.start, range.end);

  if (format === "xlsx") {
    const body = await toXlsx(roster);
    return new Response(body, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="sunday-roster-${range.label}.xlsx"`,
      },
    });
  }

  if (format === "pdf") {
    const body = await toPdf(roster);
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sunday-roster-${range.label}.pdf"`,
      },
    });
  }

  return new Response(toCsv(roster), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sunday-roster-${range.label}.csv"`,
    },
  });
}
