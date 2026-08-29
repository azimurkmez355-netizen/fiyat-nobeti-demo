"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { cx } from "@/lib/cx";
import { CATEGORIES, FILTERS, STATS } from "@/lib/demo-data";
import { useSession, useAccent } from "./providers";
import { GemLogo, ToolIcon, ChevronLeftIcon, StoreIcon } from "./icons";
import { accentGradient } from "@/lib/accent-colors";
import { getStarredIds } from "@/lib/session";
import type { FilterKey, ToolIconKey } from "@/lib/types";

function NavLink({
  href,
  active,
  icon,
  label,
  badge,
  collapsed,
  tutorialId,
  onClick,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  collapsed: boolean;
  tutorialId?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      data-tutorial={tutorialId}
      className={cx(
        "group flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[13.5px] font-medium transition-colors",
        collapsed && "justify-center px-0"
      )}
      style={{
        background: active ? "var(--brand-bg)" : "transparent",
        color: active ? "var(--brand-3)" : "var(--sidebar-text)",
      }}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {typeof badge === "number" && badge > 0 && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10.5px] font-bold"
              style={{
                background: active ? "var(--brand-1)" : "var(--surface-2)",
                color: active ? "#fff" : "var(--sidebar-text-2)",
              }}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}

function GroupLabel({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) {
  if (collapsed) return <div className="my-2 h-px" style={{ background: "var(--border)" }} />;
  return (
    <div
      className="mb-1.5 mt-5 px-3 text-[10.5px] font-bold uppercase tracking-wider"
      style={{ color: "var(--sidebar-text-2)" }}
    >
      {children}
    </div>
  );
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
  onOpenIdeasoft,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onOpenIdeasoft: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, logout } = useSession();
  const { accentColor, accentIcon } = useAccent();
  const [starredCount, setStarredCount] = useState(0);

  useEffect(() => {
    setStarredCount(getStarredIds().length);
  }, [pathname, searchParams]);

  const activeFilter = searchParams.get("filter") ?? "all";
  const activeKategori = searchParams.get("kategori");
  const onHome = pathname === "/panel";

  const filterBadge: Record<FilterKey, number> = {
    all: STATS.total,
    geride: STATS.geride,
    gap: STATS.gapAlert,
    critical: STATS.critical,
    "listede-yok": STATS.listedeYok,
    yildizli: starredCount,
  };

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onMobileClose} />
      )}
      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-200 md:sticky md:top-0 md:z-0 md:h-screen md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          width: collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)",
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className={cx("flex items-center gap-2.5 px-4 py-5", collapsed && "justify-center px-0")}>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] text-white"
            style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
          >
            <GemLogo className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-[14.5px] font-bold" style={{ color: "var(--text)" }}>
                Fiyat Nöbeti
              </div>
              <div className="truncate text-[11.5px]" style={{ color: "var(--sidebar-text-2)" }}>
                {session?.storeName || "Mağazam"}
              </div>
            </div>
          )}
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto px-2.5 pb-4">
          <GroupLabel collapsed={collapsed}>Akakçe Kontrol</GroupLabel>
          <div className="flex flex-col gap-0.5">
            <NavLink
              href="/panel/hesaplarim"
              active={pathname === "/panel/hesaplarim"}
              icon={<StoreIcon className="h-[18px] w-[18px]" />}
              label="Hesaplarım"
              collapsed={collapsed}
              tutorialId="nav-hesaplarim"
            />
            {!collapsed && (
              <div className="mt-1 flex items-center gap-2 rounded-[14px] px-3 py-2">
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] text-white"
                  style={{ background: accentGradient(accentColor) }}
                >
                  <ToolIcon icon={accentIcon as ToolIconKey} className="h-3.5 w-3.5" />
                </span>
                <span className="truncate text-[12px]" style={{ color: "var(--sidebar-text-2)" }}>
                  1 hesap • {STATS.total} ürün taranmış
                </span>
              </div>
            )}
          </div>

          <GroupLabel collapsed={collapsed}>Menü</GroupLabel>
          <div className="flex flex-col gap-0.5">
            {FILTERS.map((f) => (
              <NavLink
                key={f.key}
                href={f.key === "all" ? "/panel" : `/panel?filter=${f.key}`}
                active={onHome && !activeKategori && activeFilter === f.key}
                icon={<span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />}
                label={f.label}
                badge={filterBadge[f.key]}
                collapsed={collapsed}
                tutorialId={
                  f.key === "gap" ? "nav-gap" : f.key === "critical" ? "nav-critical" : f.key === "yildizli" ? "nav-starred" : f.key === "all" ? "nav-all" : undefined
                }
              />
            ))}
          </div>

          <GroupLabel collapsed={collapsed}>Kategoriler</GroupLabel>
          <div className="flex flex-col gap-0.5">
            {CATEGORIES.map((c) => (
              <NavLink
                key={c.slug}
                href={`/panel?kategori=${c.slug}`}
                active={onHome && activeKategori === c.slug}
                icon={<ToolIcon icon={c.icon} className="h-[18px] w-[18px]" />}
                label={c.label}
                collapsed={collapsed}
                tutorialId={c.slug === "taslama" ? "nav-category-taslama" : undefined}
              />
            ))}
          </div>

          <GroupLabel collapsed={collapsed}>Bağlantı & Ayarlar</GroupLabel>
          <div className="flex flex-col gap-0.5">
            <button
              data-tutorial="nav-ideasoft"
              onClick={onOpenIdeasoft}
              className={cx(
                "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors hover:bg-[var(--surface-2)]",
                collapsed && "justify-center px-0"
              )}
              style={{ color: "var(--sidebar-text)" }}
            >
              <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                <span className="h-2 w-2 rounded-full" style={{ background: "var(--lead)" }} />
              </span>
              {!collapsed && <span className="flex-1 truncate">1 Mağaza Bağlı</span>}
            </button>
            <NavLink
              href="/panel/ayarlar"
              active={pathname === "/panel/ayarlar"}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-[18px] w-[18px]">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.8 6.2l-1.6 1.6M7.8 16.2l-1.6 1.6M17.8 17.8l-1.6-1.6M7.8 7.8L6.2 6.2" strokeLinecap="round" />
                </svg>
              }
              label="Ayarlar"
              collapsed={collapsed}
              tutorialId="nav-ayarlar"
            />
          </div>
        </nav>

        <div className="border-t px-2.5 py-3" style={{ borderColor: "var(--border)" }}>
          <button
            onClick={handleLogout}
            className={cx(
              "mb-1 flex w-full items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[13.5px] font-medium transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]",
              collapsed && "justify-center px-0"
            )}
            style={{ color: "var(--sidebar-text)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-[18px] w-[18px] shrink-0">
              <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" strokeLinecap="round" />
              <path d="M16 16l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 12H9" strokeLinecap="round" />
            </svg>
            {!collapsed && "Çıkış"}
          </button>
          <button
            onClick={onToggleCollapsed}
            className={cx(
              "hidden w-full items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[13.5px] font-medium transition-colors hover:bg-[var(--surface-2)] md:flex",
              collapsed && "justify-center px-0"
            )}
            style={{ color: "var(--sidebar-text-2)" }}
          >
            <ChevronLeftIcon className={cx("h-[18px] w-[18px] shrink-0 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Daralt"}
          </button>
        </div>
      </aside>
    </>
  );
}
