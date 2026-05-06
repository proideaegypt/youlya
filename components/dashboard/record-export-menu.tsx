"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, FileImage, FileSpreadsheet, FileType, ChevronDown } from "lucide-react";
import { toJpeg } from "html-to-image";
import { PDFDocument } from "pdf-lib";
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType } from "docx";
import { useSearchParams } from "next/navigation";
import { parseDateRangeFromSearchParams } from "@/lib/dashboard/date-range";

type Column = { key: string; label: string };
type Row = Record<string, unknown>;

type Props = {
  title: string;
  page: string;
  columns: Column[];
  rows: Row[];
  summaryLines?: Array<{ label: string; value: string | number }>;
  timezone?: string;
  className?: string;
};

function maskValue(key: string, value: unknown): unknown {
  if (value == null) return "";
  const text = String(value);
  const lowered = key.toLowerCase();
  if (lowered.includes("customer") || lowered.includes("phone") || lowered.includes("conversation") || lowered.includes("external")) {
    if (text.length <= 6) return "****";
    return `${text.slice(0, 2)}****${text.slice(-2)}`;
  }
  if (text.includes("@s.whatsapp.net")) {
    return text.replace(/\d/g, "*");
  }
  return text;
}

function valueForCsv(key: string, value: unknown): string {
  const masked = maskValue(key, value);
  return String(masked).replaceAll('"', '""');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function fetchBuildInfo(): Promise<{ version: string; versionName: string | null }> {
  try {
    const res = await fetch("/api/build-info");
    const json = await res.json();
    return { version: String(json.version ?? "0.0.0"), versionName: json.versionName ? String(json.versionName) : null };
  } catch {
    return { version: "0.0.0", versionName: null };
  }
}

export function RecordExportMenu({ title, page, columns, rows, summaryLines = [], timezone = "Africa/Cairo", className = "" }: Props) {
  const searchParams = useSearchParams();
  const range = useMemo(() => parseDateRangeFromSearchParams(searchParams, timezone), [searchParams, timezone]);
  const [open, setOpen] = useState(false);
  const [appVersion, setAppVersion] = useState("0.0.0");
  const [reportNode, setReportNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    void fetchBuildInfo().then((buildInfo) => setAppVersion(buildInfo.version));
  }, []);

  const generatedAt = useMemo(() => new Date().toISOString(), []);
  const safeRows = useMemo(
    () =>
      rows.map((row) => {
        const out: Record<string, string> = {};
        for (const column of columns) {
          out[column.key] = String(maskValue(column.key, row[column.key] ?? ""));
        }
        return out;
      }),
    [columns, rows],
  );

  const csv = useMemo(() => {
    const lines = [
      [`Title`, `"${title.replaceAll('"', '""')}"`].join(","),
      [`Page`, `"${page.replaceAll('"', '""')}"`].join(","),
      [`Preset`, `"${range.preset}"`].join(","),
      [`From`, `"${range.from}"`].join(","),
      [`To`, `"${range.to}"`].join(","),
      [`Generated At`, `"${generatedAt}"`].join(","),
      [`Version`, `"${appVersion}"`].join(","),
      "",
      columns.map((column) => `"${column.label.replaceAll('"', '""')}"`).join(","),
      ...safeRows.map((row) => columns.map((column) => `"${valueForCsv(column.key, row[column.key] ?? "")}"`).join(",")),
    ];
    return lines.join("\n");
  }, [appVersion, columns, generatedAt, page, range.from, range.preset, range.to, safeRows, title]);

  const exportCsv = () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    downloadBlob(blob, `${page}-${range.preset}-${range.from}.csv`);
  };

  const exportJpg = async () => {
    if (!reportNode) return;
    const dataUrl = await toJpeg(reportNode, { quality: 0.96, pixelRatio: 2, backgroundColor: "#ffffff" });
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    downloadBlob(blob, `${page}-${range.preset}-${range.from}.jpg`);
  };

  const exportPdf = async () => {
    if (!reportNode) return;
    const dataUrl = await toJpeg(reportNode, { quality: 0.96, pixelRatio: 2, backgroundColor: "#ffffff" });
    const response = await fetch(dataUrl);
    const imageBytes = await response.arrayBuffer();
    const pdf = await PDFDocument.create();
    const image = await pdf.embedJpg(imageBytes);
    const pageSize = pdf.addPage([image.width, image.height]);
    pageSize.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    const bytes = await pdf.save();
    downloadBlob(
      new Blob([bytes.slice().buffer as ArrayBuffer], { type: "application/pdf" }),
      `${page}-${range.preset}-${range.from}.pdf`,
    );
  };

  const exportDocx = async () => {
    if (!reportNode) return;
    const dataUrl = await toJpeg(reportNode, { quality: 0.96, pixelRatio: 2, backgroundColor: "#ffffff" });
    const response = await fetch(dataUrl);
    await response.arrayBuffer();
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: title, bold: true, size: 28 })],
            }),
            new Paragraph({ children: [new TextRun({ text: `Page: ${page}` })] }),
            new Paragraph({ children: [new TextRun({ text: `Range: ${range.preset} (${range.from} -> ${range.to})` })] }),
            new Paragraph({ children: [new TextRun({ text: `Generated at: ${generatedAt}` })] }),
            new Paragraph({ children: [new TextRun({ text: `App version: ${appVersion}` })] }),
            ...summaryLines.map((line) => new Paragraph({ children: [new TextRun({ text: `${line.label}: ${String(line.value)}` })] })),
            new Paragraph({ children: [new TextRun({ text: "Records", bold: true })] }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: columns.map((column) => new TableCell({ children: [new Paragraph(column.label)] })),
                }),
                ...safeRows.slice(0, 20).map(
                  (row) =>
                    new TableRow({
                      children: columns.map((column) => new TableCell({ children: [new Paragraph(String(row[column.key] ?? ""))] })),
                    }),
                ),
              ],
            }),
          ],
        },
      ],
    });
    const bytes = await Packer.toBlob(doc);
    downloadBlob(bytes, `${page}-${range.preset}-${range.from}.docx`);
  };

  const items = [
    { label: "PDF", icon: FileText, action: exportPdf },
    { label: "JPG", icon: FileImage, action: exportJpg },
    { label: "DOCX", icon: FileType, action: exportDocx },
    { label: "CSV", icon: FileSpreadsheet, action: exportCsv },
  ];

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
      >
        <Download className="h-4 w-4" />
        Export
        <ChevronDown className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-44 rounded-2xl border border-border bg-card p-2 shadow-xl">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={async () => {
                  setOpen(false);
                  await item.action();
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted"
              >
                <Icon className="h-4 w-4 text-brand" />
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div ref={setReportNode} className="pointer-events-none absolute -left-[10000px] top-0 w-[1200px] rounded-3xl bg-white p-10 text-slate-900">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Youlya Report</p>
            <h1 className="mt-2 text-3xl font-bold">{title}</h1>
            <div className="mt-2 text-sm text-slate-600">
              <p>Page: {page}</p>
              <p>Preset: {range.preset}</p>
              <p>From: {range.from}</p>
              <p>To: {range.to}</p>
              <p>Generated at: {generatedAt}</p>
              <p>App version: {appVersion}</p>
            </div>
          </div>
          {summaryLines.length ? (
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-2">
              {summaryLines.map((line) => (
                <div key={line.label} className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{line.label}</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{String(line.value)}</p>
                </div>
              ))}
            </div>
          ) : null}
          <table className="w-full border-collapse overflow-hidden rounded-2xl border border-slate-200 text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                {columns.map((column) => (
                  <th key={column.key} className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                    No records for the selected filters.
                  </td>
                </tr>
              ) : (
                safeRows.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-slate-700">
                        {String(row[column.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
