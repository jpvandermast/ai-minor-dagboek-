import * as XLSX from "xlsx";
import { DiaryEntry } from "../types.ts";

/**
 * Exporteert alle dagboekberichten naar een gestructureerd .xlsx Excel-bestand
 * inclusief datum, tijd, stemming en de 4 antwoorden.
 */
export function exportEntriesToExcel(entries: DiaryEntry[]): boolean {
  if (!entries || entries.length === 0) {
    return false;
  }

  // Sorteer chronologisch van oud naar nieuw voor het Excel-overzicht
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp);

  const rows = sorted.map((entry) => ({
    "Datum": entry.formattedDate,
    "Tijd": entry.formattedTime || "",
    "Stemming": `${entry.mood} ${entry.moodLabel || ""}`.trim(),
    "1. Hoe voelde je je vandaag?": entry.answers.feeling || "",
    "2. Wat was het hoogtepunt van je dag?": entry.answers.highlight || "",
    "3. Was er iets lastigs vandaag? Zo ja, wat?": entry.answers.challenge || "",
    "4. Waar kijk je naar uit voor morgen?": entry.answers.lookingForward || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Optimale kolombreedtes instellen voor comfortabele leesbaarheid in Excel
  worksheet["!cols"] = [
    { wch: 24 }, // Datum
    { wch: 10 }, // Tijd
    { wch: 18 }, // Stemming
    { wch: 36 }, // Vraag 1
    { wch: 36 }, // Vraag 2
    { wch: 36 }, // Vraag 3
    { wch: 36 }, // Vraag 4
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dagboek");

  const dateStr = new Date().toISOString().split("T")[0];
  XLSX.writeFile(workbook, `dagboek-export-${dateStr}.xlsx`);
  return true;
}
