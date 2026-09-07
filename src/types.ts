export interface DiaryAnswers {
  feeling: string;        // 1. Hoe voelde je je vandaag?
  highlight: string;      // 2. Wat was het hoogtepunt van je dag?
  challenge: string;      // 3. Was er iets lastigs vandaag? Zo ja, wat?
  lookingForward: string; // 4. Waar kijk je naar uit voor morgen?
}

export interface DiaryEntry {
  id: string;
  timestamp: number;
  dateISO: string;
  formattedDate: string;
  formattedTime: string;
  mood: string;
  moodLabel: string;
  answers: DiaryAnswers;
}

export interface MoodOption {
  emoji: string;
  label: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: "😊", label: "Blij" },
  { emoji: "😐", label: "Neutraal" },
  { emoji: "😔", label: "Somber" },
  { emoji: "😴", label: "Moe" },
  { emoji: "🎉", label: "Enthousiast" },
];
