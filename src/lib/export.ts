import ExcelJS from "exceljs";
import { RosterInstance } from "@/types/types";

export function rosterRows(instances: RosterInstance[]) {
  return instances.map((instance) => {
    const row: Record<string, string> = {
      Date: formatDate(instance.date),
      Service: instance.service.name,
    };
    instance.assignments.forEach((assignment) => {
      row[assignment.role.name] = assignment.member?.name ?? "";
    });
    return row;
  });
}

export function toCsv(instances: RosterInstance[]) {
  const rows = rosterRows(instances);
  const roles = Array.from(
    new Set(
      instances.flatMap((instance) =>
        instance.assignments.map((assignment) => assignment.role.name),
      ),
    ),
  );
  const headers = ["Date", "Service", ...roles];
  const values = rows.map((row) =>
    headers.map((header) => csvCell(row[header] ?? "")),
  );
  return [
    headers.map(csvCell).join(","),
    ...values.map((row) => row.join(",")),
  ].join("\n");
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function toXlsx(instances: RosterInstance[]) {
  const roles = Array.from(
    new Set(
      instances.flatMap((instance) =>
        instance.assignments.map((a) => a.role.name),
      ),
    ),
  );

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Monthly Roster");

  sheet.columns = [
    { header: "Date", key: "date", width: 18 },
    { header: "Service", key: "service", width: 24 },
    ...roles.map((role) => ({
      header: role,
      key: role,
      width: 18,
    })),
  ];

  const rows = instances.map((instance) => {
    const row: Record<string, any> = {
      date: instance.date,
      service: instance.service.name, // ✅ IMPORTANT FIX
    };

    for (const assignment of instance.assignments) {
      row[assignment.role.name] = assignment.member?.name ?? "Unfilled";
    }

    return row;
  });

  sheet.addRows(rows);

  sheet.getRow(1).font = { bold: true };

  return workbook.xlsx.writeBuffer();
}

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatDate } from "@/lib/dates";

export async function toPdf(instances: RosterInstance[]) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4 size

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 36;
  let y = 800;

  const drawText = (text: string, size = 12, isBold = false) => {
    if (y < margin) return;

    page.drawText(text, {
      x: margin,
      y,
      size,
      font: isBold ? boldFont : font,
      color: rgb(0, 0, 0),
    });

    y -= size + 6;
  };

  // Title
  drawText("Sunday Service Monthly Roster", 18, true);
  y -= 10;

  for (const instance of instances) {
    drawText(
      `${formatDate(instance.date)} - ${instance.service.name}`,
      12,
      true,
    );

    for (const assignment of instance.assignments) {
      drawText(
        `  ${assignment.role.name}: ${assignment.member?.name ?? "Unfilled"}`,
        10,
      );
    }

    y -= 10;
  }

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
