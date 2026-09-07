import { DiaryEntry } from "../types.ts";

/**
 * Berekent het aantal opeenvolgende dagen dat de gebruiker een dagboekbericht heeft geschreven.
 */
export function calculateWritingStreak(entries: DiaryEntry[]): number {
  if (!entries || entries.length === 0) {
    return 0;
  }

  // Verzamel alle unieke dagen in formaat YYYY-MM-DD (lokale tijd)
  const uniqueDays = new Set<string>();
  for (const entry of entries) {
    const d = new Date(entry.timestamp);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      uniqueDays.add(`${year}-${month}-${day}`);
    }
  }

  const now = new Date();
  const formatDay = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const todayStr = formatDay(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDay(yesterday);

  // Controleer of de reeks actief is (bericht vandaag of gisteren geschreven)
  let checkDate = new Date(now);
  let streak = 0;

  if (uniqueDays.has(todayStr)) {
    // Vandaag is er al geschreven, start tellen vanaf vandaag
    while (uniqueDays.has(formatDay(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (uniqueDays.has(yesterdayStr)) {
    // Vandaag nog niet geschreven, maar gisteren wel (reeks is nog niet gebroken)
    checkDate = new Date(yesterday);
    while (uniqueDays.has(formatDay(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    // Geen bericht vandaag en ook niet gisteren
    streak = 0;
  }

  return streak;
}
