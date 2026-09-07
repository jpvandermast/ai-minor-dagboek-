import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, AlertCircle, Quote } from "lucide-react";

export function DailyQuoteCard() {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/quote", {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.quote) {
        throw new Error(data.error || "Kon geen spreuk ophalen, probeer het opnieuw");
      }

      setQuote(data.quote);
    } catch (err: any) {
      console.error("Fout bij ophalen dagelijkse spreuk:", err);
      // Conform user story: nette foutmelding zonder verborgen hardcoded alternatieven
      setError("Kon geen spreuk ophalen, probeer het opnieuw");
      setQuote(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <section
      id="daily-quote-card"
      aria-label="Spreuk van de dag"
      className="relative w-full rounded-2xl bg-[#FFFDF8] border border-[#16213E]/10 p-6 sm:p-8 shadow-xs overflow-hidden transition-all"
    >
      {/* Subtiel decoratief accent */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#16213E]/10">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-[#16213E]/70 rotate-180" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-[#16213E]/80">
            Spreuk van de dag
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#16213E]/5 text-[#16213E]/80">
          <Sparkles className="w-3.5 h-3.5 text-[#16213E]" />
          <span>Live gegenereerd door Gemini AI</span>
        </span>
      </div>

      <div className="min-h-[72px] flex items-center justify-center my-2">
        {loading ? (
          <div className="flex items-center gap-3 text-[#16213E]/70 py-4">
            <RefreshCw className="w-5 h-5 animate-spin text-[#16213E]" />
            <span className="text-sm italic font-serif">
              Gemini model weeft een reflectieve spreuk...
            </span>
          </div>
        ) : error ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-red-800 bg-red-50/70 border border-red-200/60 rounded-xl p-4 w-full text-center sm:text-left">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        ) : quote ? (
          <blockquote className="text-center px-4">
            <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#16213E] leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>
        ) : null}
      </div>

      <div className="mt-4 pt-3 flex justify-center border-t border-[#16213E]/10">
        <button
          id="btn-refresh-quote"
          type="button"
          onClick={fetchQuote}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#16213E] bg-[#16213E]/5 hover:bg-[#16213E]/10 active:bg-[#16213E]/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          title="Genereer een nieuwe live spreuk via Gemini AI"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Nieuwe spreuk</span>
        </button>
      </div>
    </section>
  );
}
