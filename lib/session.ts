import type { AccentColorKey, NotifHistoryItem, StoreSession } from "./types";
import { DEFAULT_STARRED_IDS } from "./demo-data";

const KEYS = {
  session: "fn_demo_session",
  theme: "fn_demo_theme",
  accentColor: "fn_demo_accent_color",
  accentIcon: "fn_demo_accent_icon",
  starred: "fn_demo_starred",
  hidden: "fn_demo_hidden",
  notes: "fn_demo_notes",
  tutorialState: "fn_demo_tutorial_state",
  notifHistory: "fn_demo_notif_history",
  sidebarCollapsed: "fn_demo_sidebar_collapsed",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) - fail silently, demo still works in-memory
  }
}

// --- Store session (login) ---

export function getSession(): StoreSession | null {
  return readJSON<StoreSession | null>(KEYS.session, null);
}

export function saveSession(storeName: string, storeUrl: string): StoreSession {
  const session: StoreSession = {
    storeName: storeName.trim(),
    storeUrl: storeUrl.trim(),
    createdAt: new Date().toISOString(),
  };
  writeJSON(KEYS.session, session);
  return session;
}

export function clearSession() {
  if (!isBrowser()) return;
  Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
}

// --- Theme ---

export type ThemeMode = "light" | "dark";

export function getTheme(): ThemeMode {
  return readJSON<ThemeMode>(KEYS.theme, "light");
}

export function saveTheme(mode: ThemeMode) {
  writeJSON(KEYS.theme, mode);
}

// --- Accent personalization (allowed even though account is locked) ---

export function getAccentColor(): AccentColorKey {
  return readJSON<AccentColorKey>(KEYS.accentColor, "indigo");
}
export function saveAccentColor(color: AccentColorKey) {
  writeJSON(KEYS.accentColor, color);
}

export function getAccentIcon(): string {
  return readJSON<string>(KEYS.accentIcon, "drill");
}
export function saveAccentIcon(icon: string) {
  writeJSON(KEYS.accentIcon, icon);
}

// --- Starred products ---

export function getStarredIds(): string[] {
  return readJSON<string[]>(KEYS.starred, DEFAULT_STARRED_IDS);
}

export function toggleStarred(productId: string): string[] {
  const current = getStarredIds();
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];
  writeJSON(KEYS.starred, next);
  return next;
}

// --- Hidden (deleted) products ---

export function getHiddenIds(): string[] {
  return readJSON<string[]>(KEYS.hidden, []);
}

export function hideProduct(productId: string): string[] {
  const current = getHiddenIds();
  if (current.includes(productId)) return current;
  const next = [...current, productId];
  writeJSON(KEYS.hidden, next);
  return next;
}

// --- Notes ---

export function getNotes(): Record<string, string> {
  return readJSON<Record<string, string>>(KEYS.notes, {});
}

export function saveNote(productId: string, note: string) {
  const notes = getNotes();
  if (note.trim()) {
    notes[productId] = note.trim();
  } else {
    delete notes[productId];
  }
  writeJSON(KEYS.notes, notes);
}

// --- Tutorial ---

export interface TutorialState {
  offered: boolean;
  completed: boolean;
}

export function getTutorialState(): TutorialState {
  return readJSON<TutorialState>(KEYS.tutorialState, { offered: false, completed: false });
}

export function saveTutorialState(state: TutorialState) {
  writeJSON(KEYS.tutorialState, state);
}

// --- Notification history ---

export function getNotifHistory(): NotifHistoryItem[] {
  return readJSON<NotifHistoryItem[]>(KEYS.notifHistory, []);
}

export function pushNotifHistory(item: Omit<NotifHistoryItem, "id" | "createdAt">): NotifHistoryItem[] {
  const history = getNotifHistory();
  const entry: NotifHistoryItem = {
    ...item,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...history].slice(0, 50);
  writeJSON(KEYS.notifHistory, next);
  return next;
}

export function clearNotifHistory() {
  writeJSON(KEYS.notifHistory, []);
}

// --- Sidebar collapse ---

export function getSidebarCollapsed(): boolean {
  return readJSON<boolean>(KEYS.sidebarCollapsed, false);
}
export function saveSidebarCollapsed(collapsed: boolean) {
  writeJSON(KEYS.sidebarCollapsed, collapsed);
}
