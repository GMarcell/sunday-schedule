import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { formatDate } from "./dates";

type RosterInstance = {
  date: Date;
  service: { name: string };
  assignments: { role: { name: string }; member: { name: string } | null }[];
};

export function rosterRows(instances: RosterInstance[]) {
  return instances.map((instance) => {
    const row: Record<string, string> = {
      Date: formatDate(instance.date),
      Service: instance.service.name
    };
    instance.assignments.forEach((assignment) => {
      row[assignment.role.name] = assignment.member?.name ?? "";
    });
    return row;
  });
}

export function toCsv(instances: RosterInstance[]) {
  const rows = rosterRows(instances);
  const roles = Array.from(new Set(instances.flatMap((instance) => instance.assignments.map((assignment) => assignment.role.name))));
  const headers = ["Date", "Service", ...roles];
  const values = rows.map((row) => headers.map((header) => csvCell(row[header] ?? "")));
  return [headers.map(csvCell).join(","), ...values.map((row) => row.join(","))].join("\n");
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function toXlsx(instances: RosterInstance[]) {
  const roles = Array.from(new Set(instances.flatMap((instance) => instance.assignments.map((assignment) => assignment.role.name))));
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Monthly Roster");
  sheet.columns = [
    { header: "Date", key: "date", width: 18 },
    { header: "Service", key: "service", width: 24 },
    ...roles.map((role) => ({ header: role, key: role, width: 18 }))
  ];
  rosterRows(instances).forEach((row) => sheet.addRow(row));
  sheet.getRow(1).font = { bold: true };
  return workbook.xlsx.writeBuffer();
}

export function toPdf(instances: RosterInstance[]) {
  const doc = new PDFDocument({ margin: 36, size: "A4" });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
  doc.fontSize(18).text("Sunday Service Monthly Roster", { underline: true });
  doc.moveDown();
  for (const instance of instances) {
    doc.fontSize(12).text(`${formatDate(instance.date)} - ${instance.service.name}`, { continued: false });
    instance.assignments.forEach((assignment) => {
      doc.fontSize(10).text(`  ${assignment.role.name}: ${assignment.member?.name ?? "Unfilled"}`);
    });
    doc.moveDown(0.5);
  }
  doc.end();
  return new Promise<Buffer>((resolve) => doc.on("end", () => resolve(Buffer.concat(chunks))));
}
