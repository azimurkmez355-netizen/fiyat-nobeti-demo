"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { useTheme, useToast, useTutorial } from "./providers";
import {
  MenuIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  SearchIcon,
  GraduationCapIcon,
  ScissorsIcon,
  AlertIcon,
  CheckIcon,
} from "./icons";
import { getNotifHistory, clearNotifHistory } from "@/lib/session";
import type { NotifHistoryItem } from "@/lib/types";

function typeIcon(type: NotifHistoryItem["type"]) {
  switch (type) {
    case "gap":
      return { Icon: ScissorsIcon, bg: "linear-gradient(135deg,#FFC15E,var(--alert))" };
    case "not_listed":
      return { Icon: AlertIcon, bg: "linear-gradient(135deg,#FF8098,var(--danger))" };
    case "critical":
      return { Icon: AlertIcon, bg: "linear-gradient(135deg,#FF5FA8,var(--critical))" };
    case "price_ok":
      return { Icon: CheckIcon, bg: "linear-gradient(135deg,#3CE29B,var(--lead))" };
    default:
      return { Icon: CheckIcon, bg: "linear-gradient(135deg,#3CE29B,var(--lead))" };
  }
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

export function NotifBell() {
  const { historyVersion } = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifHistoryItem[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(getNotifHistory());
  }, [historyVersion, open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref} data-tutorial="notif-bell">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors"
        style={{ background: "var(--info-bg)", color: "var(--info)" }}
        aria-label="Bildirimler"
      >
        <BellIcon className="h-[18px] w-[18px]" />
        {items.length > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9.5px] font-bold text-white"
            style={{ background: "var(--danger)" }}
          >
            {items.length > 9 ? "9+" : items.length}
          </span>
        )}
      </button>
      {open && (
        <div
          className="wg-card-in absolute right-0 top-11 z-[600] w-[352px] overflow-hidden rounded-[20px] border"
          style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-2)" }}
        >
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
            <span className="text-[13.5px] font-bold" style={{ color: "var(--text)" }}>
              Bildirim Geçmişi
            </span>
            <button
              onClick={() => {
                clearNotifHistory();
                setItems([]);
              }}
              className="text-[12px] font-semibold"
              style={{ color: "var(--muted)" }}
            >
              Temizle
            </button>
          </div>
          <div className="no-scrollbar max-h-[360px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>
                Henüz bildirim yok.
              </div>
            ) : (
              items.map((item) => {
                const { Icon, bg } = typeIcon(item.type);
                return (
                  <div key={item.id} className="flex gap-3 border-b px-4 py-3 last:border-0" style={{ borderColor: "var(--border)" }}>
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-white"
                      style={{ background: bg }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                        {item.title}
                      </div>
                      <div className="truncate text-[12px]" style={{ color: "var(--muted)" }}>
                        {item.description}
                      </div>
                      <div className="mt-0.5 text-[11px]" style={{ color: "var(--muted-2)" }}>
                        {timeAgo(item.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function Topbar({
  title,
  subtitle,
  onMobileMenu,
  search,
}: {
  title: string;
  subtitle?: string;
  onMobileMenu: () => void;
  search?: { value: string; onChange: (v: string) => void };
}) {
  const { theme, toggleTheme } = useTheme();
  const { restartTour, isRunning } = useTutorial();

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3.5 backdrop-blur md:px-6"
      style={{ background: "var(--bg-translucent)", borderColor: "var(--border)" }}
    >
      <button
        onClick={onMobileMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:hidden"
        style={{ color: "var(--text)" }}
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[16px] font-bold sm:text-[18px]" style={{ color: "var(--text)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="truncate text-[11.5px] sm:text-[12.5px]" style={{ color: "var(--muted)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {search && (
        <div
          className="hidden max-w-[220px] flex-1 items-center gap-2 rounded-full border px-3 py-2 lg:flex"
          style={{ borderColor: "var(--border-strong)", background: "var(--surface)" }}
        >
          <SearchIcon className="h-4 w-4 shrink-0" style={{ color: "var(--muted-2)" }} />
          <input
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full bg-transparent text-[13px] outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>
      )}

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => !isRunning && restartTour()}
          className="hidden h-9 w-9 items-center justify-center rounded-full transition-colors sm:flex"
          style={{ background: "var(--brand-bg)", color: "var(--brand-3)" }}
          aria-label="Eğitimi tekrar başlat"
          title="Eğitimi tekrar başlat"
        >
          <GraduationCapIcon className="h-[18px] w-[18px]" />
        </button>
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
          style={{ background: "var(--surface-2)", color: "var(--text)" }}
          aria-label="Tema"
        >
          {theme === "light" ? <MoonIcon className="h-[17px] w-[17px]" /> : <SunIcon className="h-[17px] w-[17px]" />}
        </button>
        <NotifBell />
      </div>
    </header>
  );
}
