import type { AnsweredQuestion } from "@/types/quiz";

const STORAGE_KEY = "ocds:quiz-state:v1";

export interface PersistedQuizState {
  answers: AnsweredQuestion[];
  currentIndex: number;
  startedAt: number;
  utm: Record<string, string>;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadQuizState(): PersistedQuizState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedQuizState;
    if (!Array.isArray(parsed.answers)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveQuizState(state: PersistedQuizState): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // sessionStorage indisponível (modo privado, bloqueio do navegador etc).
    // A experiência continua funcionando sem persistência.
  }
}

export function clearQuizState(): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function captureUtmParams(): Record<string, string> {
  if (!isBrowser()) return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}
