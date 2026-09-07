import { useState, useMemo } from "react";
import { Search, X, Trash2, Calendar, Clock, BookOpen, AlertTriangle } from "lucide-react";
import { DiaryEntry } from "../types.ts";

interface EntriesListProps {
  entries: DiaryEntry[];
  onDeleteEntry: (id: string) => void;
}

export function EntriesList({ entries, onDeleteEntry }: EntriesListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  // Filter berichten op trefwoord
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;

    return entries.filter((entry) => {
      const answersMatch =
        entry.answers.feeling.toLowerCase().includes(q) ||
        entry.answers.highlight.toLowerCase().includes(q) ||
        entry.answers.challenge.toLowerCase().includes(q) ||
        entry.answers.lookingForward.toLowerCase().includes(q);

      const metaMatch =
        entry.formattedDate.toLowerCase().includes(q) ||
        entry.moodLabel.toLowerCase().includes(q) ||
        entry.mood.includes(q);

      return answersMatch || metaMatch;
    });
  }, [entries, searchQuery]);

  return (
    <section
      id="entries-list-section"
      aria-label="Eerdere dagboekberichten"
      className="space-y-6"
    >
      {/* Kop en Zoekbalk */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16213E] tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#16213E]/80" />
            <span>Eerdere dagboekpagina&apos;s</span>
          </h2>
          <p className="text-sm text-[#16213E]/70 mt-1">
            {entries.length === 0
              ? "Nog geen berichten opgeslagen."
              : entries.length === 1
              ? "1 opgeslagen dagboekpagina"
              : `${entries.length} opgeslagen dagboekpagina's`}
          </p>
        </div>

        {/* Zoekbalk */}
        {entries.length > 0 && (
          <div className="relative w-full sm:w-80">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#16213E]/50 absolute left-3.5 pointer-events-none" />
              <input
                id="search-diary-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op trefwoord of datum..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#FFFDF8] border border-[#16213E]/15 text-sm text-[#16213E] placeholder-[#16213E]/40 focus:outline-hidden focus:border-[#16213E] focus:ring-1 focus:ring-[#16213E] transition-all"
              />
              {searchQuery && (
                <button
                  id="btn-clear-search"
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 p-1 text-[#16213E]/50 hover:text-[#16213E] transition-colors cursor-pointer"
                  title="Zoekopdracht wissen"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <span className="text-xs text-[#16213E]/60 mt-1 block px-1">
                {filteredEntries.length} {filteredEntries.length === 1 ? "resultaat" : "resultaten"} gevonden
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lege toestand */}
      {entries.length === 0 ? (
        <div
          id="entries-empty-state"
          className="rounded-2xl bg-[#FFFDF8] border border-[#16213E]/10 p-10 text-center space-y-3"
        >
          <div className="w-12 h-12 rounded-full bg-[#16213E]/5 flex items-center justify-center mx-auto text-[#16213E]">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl text-[#16213E]">
            Je dagboek is nog leeg
          </h3>
          <p className="text-sm text-[#16213E]/70 max-w-md mx-auto">
            Schrijf je eerste reflectie hierboven. Je gedachten worden veilig bewaard in je browser.
          </p>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div
          id="entries-no-search-results"
          className="rounded-2xl bg-[#FFFDF8] border border-[#16213E]/10 p-8 text-center space-y-3"
        >
          <p className="text-sm text-[#16213E]/70">
            Geen dagboekberichten gevonden voor &ldquo;<span className="font-semibold">{searchQuery}</span>&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-sm font-medium text-[#16213E] underline hover:opacity-80 cursor-pointer"
          >
            Wis zoekopdracht
          </button>
        </div>
      ) : (
        /* Lijst met dagboekberichten */
        <div id="diary-entries-container" className="space-y-6">
          {filteredEntries.map((entry) => {
            const isConfirmingDelete = entryToDelete === entry.id;

            return (
              <article
                key={entry.id}
                id={`diary-entry-${entry.id}`}
                className="rounded-2xl bg-[#FFFDF8] border border-[#16213E]/10 p-6 sm:p-7 shadow-xs hover:border-[#16213E]/25 transition-all space-y-5"
              >
                {/* Bovenbalk van bericht: Datum, stemming en verwijderknop */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#16213E]/10">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center gap-1.5 font-serif font-medium text-base sm:text-lg text-[#16213E]">
                      <Calendar className="w-4 h-4 text-[#16213E]/60" />
                      {entry.formattedDate}
                    </span>
                    {entry.formattedTime && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#16213E]/60 bg-[#16213E]/5 px-2 py-0.5 rounded-md">
                        <Clock className="w-3 h-3" />
                        {entry.formattedTime}
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#16213E]/5 text-[#16213E] border border-[#16213E]/10"
                      title={`Stemming: ${entry.moodLabel}`}
                    >
                      <span className="text-sm leading-none">{entry.mood}</span>
                      <span>{entry.moodLabel}</span>
                    </span>
                  </div>

                  {/* Verwijderknop met inline bevestiging */}
                  <div>
                    {isConfirmingDelete ? (
                      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-900">
                          Zeker weten?
                        </span>
                        <button
                          id={`btn-confirm-delete-${entry.id}`}
                          type="button"
                          onClick={() => {
                            onDeleteEntry(entry.id);
                            setEntryToDelete(null);
                          }}
                          className="px-2 py-0.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
                        >
                          Verwijder
                        </button>
                        <button
                          type="button"
                          onClick={() => setEntryToDelete(null)}
                          className="px-2 py-0.5 text-xs font-medium text-neutral-600 hover:text-neutral-800 transition-colors cursor-pointer"
                        >
                          Annuleer
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`btn-delete-entry-${entry.id}`}
                        type="button"
                        onClick={() => setEntryToDelete(entry.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#16213E]/60 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Verwijder dit bericht"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Verwijderen</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* De 4 antwoorden van het bericht */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vraag 1 */}
                  <div className="rounded-xl bg-[#FBF7EE]/70 border border-[#16213E]/10 p-4 space-y-1.5">
                    <h4 className="font-serif text-sm font-semibold text-[#16213E]">
                      1. Hoe voelde je je vandaag?
                    </h4>
                    <p className="text-sm text-[#16213E]/90 whitespace-pre-line leading-relaxed">
                      {entry.answers.feeling || (
                        <span className="italic text-[#16213E]/40">Niet ingevuld</span>
                      )}
                    </p>
                  </div>

                  {/* Vraag 2 */}
                  <div className="rounded-xl bg-[#FBF7EE]/70 border border-[#16213E]/10 p-4 space-y-1.5">
                    <h4 className="font-serif text-sm font-semibold text-[#16213E]">
                      2. Wat was het hoogtepunt van je dag?
                    </h4>
                    <p className="text-sm text-[#16213E]/90 whitespace-pre-line leading-relaxed">
                      {entry.answers.highlight || (
                        <span className="italic text-[#16213E]/40">Niet ingevuld</span>
                      )}
                    </p>
                  </div>

                  {/* Vraag 3 */}
                  <div className="rounded-xl bg-[#FBF7EE]/70 border border-[#16213E]/10 p-4 space-y-1.5">
                    <h4 className="font-serif text-sm font-semibold text-[#16213E]">
                      3. Was er iets lastigs vandaag? Zo ja, wat?
                    </h4>
                    <p className="text-sm text-[#16213E]/90 whitespace-pre-line leading-relaxed">
                      {entry.answers.challenge || (
                        <span className="italic text-[#16213E]/40">Niet ingevuld</span>
                      )}
                    </p>
                  </div>

                  {/* Vraag 4 */}
                  <div className="rounded-xl bg-[#FBF7EE]/70 border border-[#16213E]/10 p-4 space-y-1.5">
                    <h4 className="font-serif text-sm font-semibold text-[#16213E]">
                      4. Waar kijk je naar uit voor morgen?
                    </h4>
                    <p className="text-sm text-[#16213E]/90 whitespace-pre-line leading-relaxed">
                      {entry.answers.lookingForward || (
                        <span className="italic text-[#16213E]/40">Niet ingevuld</span>
                      )}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
