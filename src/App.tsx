import { useState, useEffect } from "react";
import { BookOpen, FileSpreadsheet, Flame, Download } from "lucide-react";
import { DiaryEntry } from "./types.ts";
import { DailyQuoteCard } from "./components/DailyQuoteCard.tsx";
import { NewEntryForm } from "./components/NewEntryForm.tsx";
import { EntriesList } from "./components/EntriesList.tsx";
import { calculateWritingStreak } from "./utils/streak.ts";
import { exportEntriesToExcel } from "./utils/exportExcel.ts";

const STORAGE_KEY = "digitaal_dagboek_entries_v1";

export default function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Fout bij laden dagboekberichten uit localStorage:", e);
    }

    // Een voorbeeldbericht zodat de gebruiker direct de weergave,
    // de export en de zoekfunctie kan ervaren
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = new Intl.DateTimeFormat("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(yesterday);
    const capitalizedYesterday =
      formattedYesterday.charAt(0).toUpperCase() + formattedYesterday.slice(1);

    return [
      {
        id: "sample-entry-1",
        timestamp: yesterday.getTime(),
        dateISO: yesterday.toISOString(),
        formattedDate: capitalizedYesterday,
        formattedTime: "21:15",
        mood: "😊",
        moodLabel: "Blij",
        answers: {
          feeling:
            "Rustig en voldaan na een productieve werkdag. Fijn om de dag in stilte af te ronden.",
          highlight:
            "Een lange avondwandeling in het park terwijl de zon zachtjes onderging.",
          challenge:
            "Een onverwachte storing in de ochtend die wat stress opleverde, maar uiteindelijk goed opgelost.",
          lookingForward:
            "Een rustige ochtend met een goed kopje koffie en een nieuw boek.",
        },
      },
    ];
  });

  const [excelFeedback, setExcelFeedback] = useState<string | null>(null);

  // Bewaar in localStorage wanneer entries wijzigen
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error("Fout bij opslaan in localStorage:", e);
    }
  }, [entries]);

  const handleAddEntry = (newEntry: DiaryEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleExportExcel = () => {
    if (entries.length === 0) {
      setExcelFeedback("Geen berichten om te exporteren.");
      setTimeout(() => setExcelFeedback(null), 3000);
      return;
    }

    const success = exportEntriesToExcel(entries);
    if (success) {
      setExcelFeedback("Excel-bestand gedownload!");
      setTimeout(() => setExcelFeedback(null), 3500);
    }
  };

  const streak = calculateWritingStreak(entries);

  return (
    <div className="min-h-screen bg-[#FBF7EE] text-[#16213E] selection:bg-[#16213E]/15">
      {/* Hoofdnavigatie / Bovenbalk */}
      <header
        id="app-header"
        className="sticky top-0 z-30 bg-[#FBF7EE]/90 backdrop-blur-md border-b border-[#16213E]/10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16213E] text-[#FFFDF8] flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#16213E]">
                Digitaal Dagboek
              </h1>
              <p className="text-xs text-[#16213E]/65">
                Jouw persoonlijke plek voor dagelijkse reflectie
              </p>
            </div>
          </div>

          {/* Schrijfreeks-teller & Excel export knop */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Schrijfreeks-teller */}
            <div
              id="streak-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF8] border border-[#16213E]/15 text-xs sm:text-sm font-medium shadow-xs"
              title={`${streak} dagen op rij een dagboekbericht geschreven`}
            >
              <Flame
                className={`w-4 h-4 ${
                  streak > 0 ? "text-amber-600 fill-amber-600" : "text-[#16213E]/40"
                }`}
              />
              <span>
                <strong className="font-semibold text-[#16213E]">{streak}</strong>{" "}
                {streak === 1 ? "dag reeks" : "dagen reeks"}
              </span>
            </div>

            {/* Excel Download knop */}
            <div className="relative">
              <button
                id="btn-download-excel"
                type="button"
                onClick={handleExportExcel}
                disabled={entries.length === 0}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#16213E] text-[#FFFDF8] hover:bg-[#16213E]/90 active:bg-[#16213E]/95 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm font-medium transition-colors shadow-xs cursor-pointer"
                title="Download alle berichten als .xlsx Excel-bestand"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Download als Excel</span>
                <Download className="w-3.5 h-3.5 opacity-70 hidden sm:inline" />
              </button>

              {excelFeedback && (
                <div className="absolute right-0 top-full mt-2 whitespace-nowrap px-3 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg shadow-xs z-20">
                  {excelFeedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hoofdinhoud */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* 1. Spreuk van de dag (Live Gemini AI call) */}
        <DailyQuoteCard />

        {/* 2. Nieuw dagboekbericht formulier met 4 vragen en stemmingskeuze */}
        <NewEntryForm onAddEntry={handleAddEntry} />

        {/* 3. Eerdere berichten met zoekbalk en verwijderoptie */}
        <EntriesList entries={entries} onDeleteEntry={handleDeleteEntry} />
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center border-t border-[#16213E]/10 text-xs text-[#16213E]/60 space-y-1">
        <p>Digitaal Dagboek &bull; Opgeslagen in je browser (localStorage)</p>
        <p className="text-[11px] text-[#16213E]/45">
          Spreuk van de dag aangedreven door Google Gemini AI
        </p>
      </footer>
    </div>
  );
}
