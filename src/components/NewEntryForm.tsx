import { useState, type FormEvent } from "react";
import { PenLine, Check, Calendar } from "lucide-react";
import { DiaryAnswers, DiaryEntry, MOOD_OPTIONS } from "../types.ts";

interface NewEntryFormProps {
  onAddEntry: (entry: DiaryEntry) => void;
}

export function NewEntryForm({ onAddEntry }: NewEntryFormProps) {
  const [selectedMood, setSelectedMood] = useState<string>("😊");
  const [answers, setAnswers] = useState<DiaryAnswers>({
    feeling: "",
    highlight: "",
    challenge: "",
    lookingForward: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const today = new Date();
  const formattedToday = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);
  const capitalizedToday =
    formattedToday.charAt(0).toUpperCase() + formattedToday.slice(1);

  const handleInputChange = (
    field: keyof DiaryAnswers,
    value: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Controleer of ten minste één antwoord is ingevuld
    const hasAnyContent =
      answers.feeling.trim().length > 0 ||
      answers.highlight.trim().length > 0 ||
      answers.challenge.trim().length > 0 ||
      answers.lookingForward.trim().length > 0;

    if (!hasAnyContent) {
      setFeedback("Vul alstublieft minimaal één vraag in.");
      return;
    }

    const now = new Date();
    const moodObj = MOOD_OPTIONS.find((m) => m.emoji === selectedMood);

    const newEntry: DiaryEntry = {
      id: "entry-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      timestamp: now.getTime(),
      dateISO: now.toISOString(),
      formattedDate: capitalizedToday,
      formattedTime: now.toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      mood: selectedMood,
      moodLabel: moodObj ? moodObj.label : "",
      answers: {
        feeling: answers.feeling.trim(),
        highlight: answers.highlight.trim(),
        challenge: answers.challenge.trim(),
        lookingForward: answers.lookingForward.trim(),
      },
    };

    onAddEntry(newEntry);

    // Reset formulier
    setAnswers({
      feeling: "",
      highlight: "",
      challenge: "",
      lookingForward: "",
    });
    setSelectedMood("😊");
    setFeedback("Je dagboekbericht is opgeslagen!");
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <section
      id="new-entry-form-container"
      aria-label="Nieuw dagboekbericht toevoegen"
      className="rounded-2xl bg-[#FFFDF8] border border-[#16213E]/10 p-6 sm:p-8 shadow-xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#16213E]/10">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16213E] tracking-tight">
            Nieuwe dagboekpagina
          </h2>
          <p className="text-sm text-[#16213E]/70 mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#16213E]/60" />
            <span>{capitalizedToday}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stemming selector */}
        <div id="mood-selector-group" className="space-y-2">
          <label className="block text-sm font-semibold text-[#16213E]">
            Hoe voelde je dag in één oogopslag?
          </label>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = selectedMood === mood.emoji;
              return (
                <button
                  key={mood.emoji}
                  id={`mood-btn-${mood.emoji}`}
                  type="button"
                  onClick={() => setSelectedMood(mood.emoji)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#16213E] text-[#FFFDF8] border-[#16213E] shadow-xs"
                      : "bg-[#FBF7EE] text-[#16213E] border-[#16213E]/15 hover:border-[#16213E]/40"
                  }`}
                  title={mood.label}
                >
                  <span className="text-lg leading-none">{mood.emoji}</span>
                  <span className="font-medium">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* De 4 vaste vragen */}
        <div className="space-y-5">
          {/* Vraag 1 */}
          <div className="space-y-1.5">
            <label
              htmlFor="question-feeling"
              className="block font-serif text-base text-[#16213E] font-medium"
            >
              1. Hoe voelde je je vandaag?
            </label>
            <textarea
              id="question-feeling"
              rows={3}
              value={answers.feeling}
              onChange={(e) => handleInputChange("feeling", e.target.value)}
              placeholder="Beschrijf je gemoedstoestand, gedachten of algemene stemming..."
              className="w-full rounded-xl bg-[#FBF7EE]/60 border border-[#16213E]/15 p-3.5 text-[#16213E] placeholder-[#16213E]/40 focus:outline-hidden focus:border-[#16213E] focus:ring-1 focus:ring-[#16213E] transition-all resize-y text-base"
            />
          </div>

          {/* Vraag 2 */}
          <div className="space-y-1.5">
            <label
              htmlFor="question-highlight"
              className="block font-serif text-base text-[#16213E] font-medium"
            >
              2. Wat was het hoogtepunt van je dag?
            </label>
            <textarea
              id="question-highlight"
              rows={3}
              value={answers.highlight}
              onChange={(e) => handleInputChange("highlight", e.target.value)}
              placeholder="Een mooi moment, een succes, een fijn gesprek of een klein gelukje..."
              className="w-full rounded-xl bg-[#FBF7EE]/60 border border-[#16213E]/15 p-3.5 text-[#16213E] placeholder-[#16213E]/40 focus:outline-hidden focus:border-[#16213E] focus:ring-1 focus:ring-[#16213E] transition-all resize-y text-base"
            />
          </div>

          {/* Vraag 3 */}
          <div className="space-y-1.5">
            <label
              htmlFor="question-challenge"
              className="block font-serif text-base text-[#16213E] font-medium"
            >
              3. Was er iets lastigs vandaag? Zo ja, wat?
            </label>
            <textarea
              id="question-challenge"
              rows={3}
              value={answers.challenge}
              onChange={(e) => handleInputChange("challenge", e.target.value)}
              placeholder="Een tegenslag, irritatie of iets waar je mee worstelde..."
              className="w-full rounded-xl bg-[#FBF7EE]/60 border border-[#16213E]/15 p-3.5 text-[#16213E] placeholder-[#16213E]/40 focus:outline-hidden focus:border-[#16213E] focus:ring-1 focus:ring-[#16213E] transition-all resize-y text-base"
            />
          </div>

          {/* Vraag 4 */}
          <div className="space-y-1.5">
            <label
              htmlFor="question-looking-forward"
              className="block font-serif text-base text-[#16213E] font-medium"
            >
              4. Waar kijk je naar uit voor morgen?
            </label>
            <textarea
              id="question-looking-forward"
              rows={3}
              value={answers.lookingForward}
              onChange={(e) =>
                handleInputChange("lookingForward", e.target.value)
              }
              placeholder="Een afspraak, een taak, een rustmoment of iets nieuws..."
              className="w-full rounded-xl bg-[#FBF7EE]/60 border border-[#16213E]/15 p-3.5 text-[#16213E] placeholder-[#16213E]/40 focus:outline-hidden focus:border-[#16213E] focus:ring-1 focus:ring-[#16213E] transition-all resize-y text-base"
            />
          </div>
        </div>

        {/* Knoppen & feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#16213E]/10">
          <div>
            {feedback && (
              <div
                id="form-feedback-message"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{feedback}</span>
              </div>
            )}
          </div>

          <button
            id="btn-save-diary-entry"
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-[#FFFDF8] bg-[#16213E] hover:bg-[#16213E]/90 active:bg-[#16213E]/95 shadow-xs transition-colors cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            <span>Bericht opslaan</span>
          </button>
        </div>
      </form>
    </section>
  );
}
