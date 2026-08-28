"use client";

import { RawIcon } from "./icons";
import { NotifBell } from "./topbar";
import { useSession } from "./providers";
import type { SortKey } from "@/lib/types";

const ICON = {
  menu: '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  sort: '<line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/><circle cx="4.5" cy="12" r="1" fill="currentColor"/><circle cx="7.5" cy="18" r="1" fill="currentColor"/>',
  pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  send: '<path d="M20.59 13.41L11 3.83A2 2 0 0 0 9.59 3.24L4 3a1 1 0 0 0-1 1l.24 5.59a2 2 0 0 0 .59 1.41l9.58 9.58a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.82z"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor"/>',
  layers: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  peaks: '<path d="M2.5 20h19M4 20l1.2-9.5L9 13l3-8 3 8 3.8-2.5L20 20"/>',
  trendDown: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>',
  alertTriangle: '<path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
  circleX: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5l5 5m0-5l-5 5"/>',
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "risk", label: "Sırala: Önce risk" },
  { value: "gap", label: "Sırala: Makas büyüklüğü" },
  { value: "az", label: "Sırala: A-Z" },
  { value: "added_new", label: "Sırala: Eklenme Tarihi (Yeni → Eski)" },
  { value: "added_old", label: "Sırala: Eklenme Tarihi (Eski → Yeni)" },
];

export function DashboardTopbar({
  title,
  subtitle,
  onMobileMenu,
  search,
  sort,
  onLockedAction,
  stats,
}: {
  title: string;
  subtitle: string;
  onMobileMenu: () => void;
  search: { value: string; onChange: (v: string) => void };
  sort: { value: SortKey; onChange: (v: SortKey) => void };
  onLockedAction: (msg: string) => void;
  stats: { lider: number; geride: number; gapAlert: number; critical: number; listedeYok: number; total: number };
}) {
  const { session } = useSession();
  const avatarLetter = (session?.storeName || "M").trim().charAt(0).toUpperCase();

  return (
    <div className="topbar">
      <div className="topbar-decor-mask" aria-hidden="true">
        <div className="topbar-decor" />
      </div>

      <div className="topbar-row topbar-row-main">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMobileMenu}
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] md:hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <RawIcon path={ICON.menu} strokeWidth={2.3} className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-[18px] font-extrabold" style={{ color: "var(--text)" }}>
              {title}
            </h1>
            <span className="block truncate text-[11.5px] font-medium" style={{ color: "var(--muted)" }}>
              {subtitle}
            </span>
          </div>
        </div>

        <div className="flex max-w-[560px] flex-1 items-center gap-2" style={{ margin: "0 12px" }}>
          <div className="search-wrap">
            <RawIcon path={ICON.search} className="h-4 w-4" />
            <input
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder="Ürün ara..."
              className="search-input"
            />
          </div>
          <div className="select-wrap">
            <RawIcon path={ICON.sort} className="h-4 w-4" />
            <select value={sort.value} onChange={(e) => sort.onChange(e.target.value as SortKey)} className="sort-select">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="topbar-actions">
          <div className="action-group">
            <button
              onClick={() => onLockedAction("Bu demoda tarama işlemleri kilitlidir — 15 ürün zaten önceden taranmış olarak hazır.")}
              className="scan-toggle-btn locked-surface opacity-80"
              title="Taramayı olduğu yerde durdurur / kaldığı yerden devam ettirir"
            >
              <RawIcon path={ICON.pause} strokeWidth={2.4} className="h-3.5 w-3.5" />
              Tara Durdur
            </button>
            <button
              onClick={() => onLockedAction("Bu demoda yeniden tarama başlatılamaz — ürünler zaten önceden taranmış olarak hazır.")}
              className="refresh-btn locked-surface opacity-80"
              title="Listenin başından yeniden tara"
            >
              <RawIcon path={ICON.refresh} strokeWidth={2.4} className="h-3.5 w-3.5" />
              Yenile
            </button>
          </div>
          <button
            onClick={() => onLockedAction("Bu demoda toplu fiyat gönderimi kilitlidir. Tam sürümde bu buton, tabloda listelenen tüm ürünlerin önerilen fiyatlarını tek seferde gönderir.")}
            className="bulk-send-btn locked-surface opacity-90"
            title="Tabloda listelenen tüm ürünlerin önerilen fiyatlarını tek seferde gönder"
          >
            <RawIcon path={ICON.send} className="h-[15px] w-[15px]" />
            <span>Toplu Fiyat Gönder</span>
          </button>
          <NotifBell />
          <div className="profile-chip" title="Oturum açan mağaza">
            <span className="profile-avatar">{avatarLetter}</span>
            <div className="flex flex-col leading-tight">
              <span className="max-w-[120px] truncate text-[12.5px] font-bold" style={{ color: "var(--text)" }}>
                {session?.storeName || "Mağazam"}
              </span>
              <span className="text-[10.5px] font-semibold" style={{ color: "var(--muted)" }}>
                Akakçe hesabı
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="topbar-row topbar-row-status">
        <div className="status-cluster">
          <div className="status-pill" title="Tamamlandı">
            <span className="dot live" />
            <span className="status-pill-body">
              <span className="status-pill-main">Tarama tamamlandı</span>
              <span className="status-pill-detail">{stats.total} ürünün tamamı güncel</span>
            </span>
          </div>
          <div className="scan-progress-card is-done">
            <div className="spc-ring-wrap">
              <svg className="spc-ring" viewBox="0 0 46 46">
                <circle className="spc-ring-track" cx="23" cy="23" r="18" />
                <circle
                  className="spc-ring-fill"
                  cx="23"
                  cy="23"
                  r="18"
                  style={{ strokeDasharray: 113.1, strokeDashoffset: 0 }}
                />
              </svg>
              <div className="spc-icon">
                <RawIcon path={ICON.layers} className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="spc-body">
              <div className="spc-top">
                <span className="spc-status">Tamamlandı</span>
                <span className="spc-pct">%100</span>
              </div>
              <div className="spc-count">
                Taranan <b>{stats.total}</b> / {stats.total}
              </div>
              <div className="spc-bar">
                <div className="spc-bar-fill" style={{ width: "100%" }} />
              </div>
            </div>
          </div>
          <div className="counters">
            <div className="counter lead" title="1. sırada olduğunuz ürün sayısı">
              <div className="icon-wrap"><RawIcon path={ICON.peaks} className="h-[18px] w-[18px]" /></div>
              <div className="counter-text">
                <b>{stats.lider}</b>
                <span className="counter-label">Lider</span>
              </div>
            </div>
            <div className="counter info" title="1. sırada olmadığınız ürün sayısı">
              <div className="icon-wrap"><RawIcon path={ICON.trendDown} className="h-[18px] w-[18px]" /></div>
              <div className="counter-text">
                <b>{stats.geride}</b>
                <span className="counter-label">Geride</span>
              </div>
            </div>
            <div className="counter alert" title="Kendi konumunuza göre fiyat farkı eşiği aşan ürün sayısı">
              <div className="icon-wrap"><RawIcon path={ICON.scissors} className="h-[18px] w-[18px]" /></div>
              <div className="counter-text">
                <b>{stats.gapAlert}</b>
                <span className="counter-label">Makas Açık</span>
              </div>
            </div>
            <div className="counter critical" title="Fiyat skalasında anormal bir düşüş tespit edilen ürün sayısı">
              <div className="icon-wrap"><RawIcon path={ICON.alertTriangle} strokeWidth={2.3} className="h-[18px] w-[18px]" /></div>
              <div className="counter-text">
                <b>{stats.critical}</b>
                <span className="counter-label">Kritik Fiyat</span>
              </div>
            </div>
            <div className="counter danger" title="Fiyat listesinde bulunamayan ürün sayısı">
              <div className="icon-wrap"><RawIcon path={ICON.circleX} className="h-[18px] w-[18px]" /></div>
              <div className="counter-text">
                <b>{stats.listedeYok}</b>
                <span className="counter-label">Listede Yok</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
