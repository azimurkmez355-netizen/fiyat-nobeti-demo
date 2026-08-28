"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { AccentColorKey, NotifHistoryItem, StoreSession } from "@/lib/types";
import {
  getSession,
  saveSession,
  clearSession,
  getTheme,
  saveTheme,
  getTutorialState,
  saveTutorialState,
  pushNotifHistory,
  getAccentColor,
  saveAccentColor,
  getAccentIcon,
  saveAccentIcon,
  type ThemeMode,
} from "@/lib/session";
import { TUTORIAL_STEPS, type TutorialStep } from "./tutorial-steps";

// ============================== Theme ==============================

interface ThemeCtxShape {
  theme: ThemeMode;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeCtxShape | null>(null);
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within AppProviders");
  return ctx;
}
function ThemeProviderImpl({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("light");
  useEffect(() => {
    const t = getTheme();
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === "light" ? "dark" : "light";
      saveTheme(next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ============================== Session ==============================

interface SessionCtxShape {
  session: StoreSession | null;
  ready: boolean;
  login: (storeName: string, storeUrl: string) => void;
  logout: () => void;
}
const SessionContext = createContext<SessionCtxShape | null>(null);
export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within AppProviders");
  return ctx;
}
function SessionProviderImpl({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<StoreSession | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setSession(getSession());
    setReady(true);
  }, []);
  const login = useCallback((storeName: string, storeUrl: string) => {
    const s = saveSession(storeName, storeUrl);
    setSession(s);
  }, []);
  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);
  const value = useMemo(() => ({ session, ready, login, logout }), [session, ready, login, logout]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// ============================== Accent (icon/color personalization) ==============================

interface AccentCtxShape {
  accentColor: AccentColorKey;
  accentIcon: string;
  setAccentColor: (c: AccentColorKey) => void;
  setAccentIcon: (i: string) => void;
}
const AccentContext = createContext<AccentCtxShape | null>(null);
export function useAccent() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error("useAccent must be used within AppProviders");
  return ctx;
}
function AccentProviderImpl({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState<AccentColorKey>("indigo");
  const [accentIcon, setAccentIconState] = useState<string>("drill");
  useEffect(() => {
    setAccentColorState(getAccentColor());
    setAccentIconState(getAccentIcon());
  }, []);
  const setAccentColor = useCallback((c: AccentColorKey) => {
    saveAccentColor(c);
    setAccentColorState(c);
  }, []);
  const setAccentIcon = useCallback((i: string) => {
    saveAccentIcon(i);
    setAccentIconState(i);
  }, []);
  const value = useMemo(
    () => ({ accentColor, accentIcon, setAccentColor, setAccentIcon }),
    [accentColor, accentIcon, setAccentColor, setAccentIcon]
  );
  return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

// ============================== Toasts ==============================

export interface ToastItem {
  id: string;
  type: NotifHistoryItem["type"];
  title: string;
  description: string;
}
interface ToastCtxShape {
  toasts: ToastItem[];
  showToast: (type: NotifHistoryItem["type"], title: string, description: string) => void;
  dismissToast: (id: string) => void;
  historyVersion: number;
}
const ToastContext = createContext<ToastCtxShape | null>(null);
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within AppProviders");
  return ctx;
}
function ToastProviderImpl({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [historyVersion, setHistoryVersion] = useState(0);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: NotifHistoryItem["type"], title: string, description: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id, type, title, description }].slice(-4));
      pushNotifHistory({ type, title, description });
      setHistoryVersion((v) => v + 1);
      const duration = type === "critical" ? 8000 : type === "price_ok" ? 4200 : 6000;
      setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast, historyVersion }),
    [toasts, showToast, dismissToast, historyVersion]
  );
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

// ============================== Tutorial ==============================

interface TutorialCtxShape {
  isOfferOpen: boolean;
  isRunning: boolean;
  stepIndex: number;
  totalSteps: number;
  currentStep: TutorialStep | null;
  startTour: () => void;
  declineOffer: () => void;
  next: () => void;
  prev: () => void;
  exitTour: () => void;
  restartTour: () => void;
}
const TutorialContext = createContext<TutorialCtxShape | null>(null);
export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) throw new Error("useTutorial must be used within AppProviders");
  return ctx;
}

function TutorialProviderImpl({ children }: { children: React.ReactNode }) {
  const { session, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const offerCheckedRef = useRef(false);

  useEffect(() => {
    if (!session) {
      // Allow the offer to re-trigger after a logout -> fresh login (e.g. demo reset).
      offerCheckedRef.current = false;
      return;
    }
    if (!ready || offerCheckedRef.current) return;
    offerCheckedRef.current = true;
    const state = getTutorialState();
    if (!state.offered) {
      const timer = setTimeout(() => setIsOfferOpen(true), 550);
      return () => clearTimeout(timer);
    }
  }, [ready, session]);

  const currentStep = isRunning ? TUTORIAL_STEPS[stepIndex] ?? null : null;

  // Keep the URL in sync with the active tutorial step (also snaps back on browser back/forward).
  useEffect(() => {
    if (!isRunning || !currentStep) return;
    if (pathname !== currentStep.route) {
      router.replace(currentStep.route);
    }
  }, [isRunning, currentStep, pathname, router]);

  const startTour = useCallback(() => {
    saveTutorialState({ offered: true, completed: false });
    setIsOfferOpen(false);
    setStepIndex(0);
    setIsRunning(true);
    if (pathname !== TUTORIAL_STEPS[0].route) router.push(TUTORIAL_STEPS[0].route);
  }, [pathname, router]);

  const declineOffer = useCallback(() => {
    saveTutorialState({ offered: true, completed: false });
    setIsOfferOpen(false);
  }, []);

  const finish = useCallback(() => {
    setIsRunning(false);
    saveTutorialState({ offered: true, completed: true });
  }, []);

  const next = useCallback(() => {
    setStepIndex((idx) => {
      if (idx + 1 >= TUTORIAL_STEPS.length) {
        finish();
        return idx;
      }
      return idx + 1;
    });
  }, [finish]);

  const prev = useCallback(() => {
    setStepIndex((idx) => Math.max(0, idx - 1));
  }, []);

  const exitTour = useCallback(() => {
    finish();
  }, [finish]);

  const restartTour = useCallback(() => {
    setStepIndex(0);
    setIsRunning(true);
    setIsOfferOpen(false);
    if (pathname !== TUTORIAL_STEPS[0].route) router.push(TUTORIAL_STEPS[0].route);
  }, [pathname, router]);

  const value = useMemo(
    () => ({
      isOfferOpen,
      isRunning,
      stepIndex,
      totalSteps: TUTORIAL_STEPS.length,
      currentStep,
      startTour,
      declineOffer,
      next,
      prev,
      exitTour,
      restartTour,
    }),
    [isOfferOpen, isRunning, stepIndex, currentStep, startTour, declineOffer, next, prev, exitTour, restartTour]
  );

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>;
}

// ============================== Compose ==============================

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviderImpl>
      <SessionProviderImpl>
        <AccentProviderImpl>
          <ToastProviderImpl>
            <TutorialProviderImpl>{children}</TutorialProviderImpl>
          </ToastProviderImpl>
        </AccentProviderImpl>
      </SessionProviderImpl>
    </ThemeProviderImpl>
  );
}
