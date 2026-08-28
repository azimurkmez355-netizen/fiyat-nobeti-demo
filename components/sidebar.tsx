"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { cx } from "@/lib/cx";
import { CATEGORIES, FILTERS, STATS } from "@/lib/demo-data";
import { useSession, useAccent } from "./providers";
import { GemLogo, ToolIcon, ChevronLeftIcon, RawIcon } from "./icons";
import { getStarredIds } from "@/lib/session";
import type { FilterKey, ToolIconKey } from "@/lib/types";

const ICON_SVG: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  people:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  home: '<path d="M3 11.5L12 4l9 7.5"/><path d="M5.5 9.7V19a1 1 0 0 0 1 1h4.2v-6h2.6v6H17.5a1 1 0 0 0 1-1V9.7"/>',
  trendDown: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>',
  alertTriangle:
    '<path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>',
  circleX: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5l5 5m0-5l-5 5"/>',
  star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
};

const Icon = RawIcon;

const FILTER_ICON: Record<FilterKey, string> = {
  all: ICON_SVG.home,
  geride: ICON_SVG.trendDown,
  gap: ICON_SVG.scissors,
  critical: ICON_SVG.alertTriangle,
  "listede-yok": ICON_SVG.circleX,
  yildizli: ICON_SVG.star,
};

function NavLink({
  href,
  active,
  iconPath,
  label,
  badge,
  collapsed,
  tutorialId,
}: {
  href: string;
  active: boolean;
  iconPath: string;
  label: string;
  badge?: number;
  collapsed: boolean;
  tutorialId?: string;
}) {
  return (
    <Link
      href={href}
      data-tutorial={tutorialId}
      className={cx("sidebar-link", active && "active")}
      style={collapsed ? { justifyContent: "center", padding: 11 } : undefined}
      title={label}
    >
      <span className="sidebar-link-icon">
        <Icon path={iconPath} />
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{label}</span>
          {typeof badge === "number" && (
            <span className="sidebar-link-count">{badge}</span>
          )}
        </>
      )}
    </Link>
  );
}

function GroupLabel({ children, collapsed }: { children: React.ReactNode; collapsed: boolean }) {
  if (collapsed) return <div className="my-2 h-px" style={{ background: "var(--border)" }} />;
  return <div className="sidebar-nav-label" style={{ marginTop: 20 }}>{children}</div>;
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
  onOpenIdeasoft,
  onOpenKaziyici,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onOpenIdeasoft: () => void;
  onOpenKaziyici: () => void;
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
          "sidebar-shell fixed inset-y-0 left-0 z-50 flex flex-col border-r md:sticky md:top-0 md:z-0 md:h-screen",
          !mobileOpen && "sidebar-shell-closed"
        )}
        style={{
          width: collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)",
          background: "var(--surface)",
          borderColor: "var(--border)",
          padding: "20px 14px 16px",
          transition: "width .2s ease, transform .2s ease",
        }}
      >
        <div
          className={cx("flex items-center gap-3 pb-[18px] mb-2 border-b", collapsed && "justify-center")}
          style={{ borderColor: "var(--border)", padding: collapsed ? "4px 0 18px" : "4px 8px 18px" }}
        >
          <div
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[15px] text-white"
            style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
          >
            <GemLogo className="h-[21px] w-[21px]" />
          </div>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[14.5px] font-extrabold" style={{ color: "var(--text)" }}>
                Fiyat Nöbeti
              </div>
              <div className="truncate text-[10.5px] font-semibold" style={{ color: "var(--muted)" }}>
                {session?.storeName || "Mağazam"}
              </div>
            </div>
          )}
        </div>

        <nav className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
          <GroupLabel collapsed={collapsed}>Akakçe Kontrol</GroupLabel>
          <div className="flex flex-col gap-0.5">
            <button onClick={onOpenKaziyici} className="sidebar-link" style={collapsed ? { justifyContent: "center", padding: 11 } : undefined} title="Kazıyıcı">
              <span className="sidebar-link-icon"><Icon path={ICON_SVG.search} /></span>
              {!collapsed && <span className="flex-1 truncate">Kazıyıcı</span>}
              {!collapsed && <span className="sidebar-link-count">0</span>}
            </button>
            <NavLink
              href="/panel/hesaplarim"
              active={pathname === "/panel/hesaplarim"}
              iconPath={ICON_SVG.people}
              label="Hesaplarım"
              badge={1}
              collapsed={collapsed}
              tutorialId="nav-hesaplarim"
            />
          </div>

          <GroupLabel collapsed={collapsed}>Menü</GroupLabel>
          <div className="flex flex-col gap-0.5">
            {FILTERS.map((f) => (
              <NavLink
                key={f.key}
                href={f.key === "all" ? "/panel" : `/panel?filter=${f.key}`}
                active={onHome && !activeKategori && activeFilter === f.key}
                iconPath={FILTER_ICON[f.key]}
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
              <NavLinkIcon
                key={c.slug}
                href={`/panel?kategori=${c.slug}`}
                active={onHome && activeKategori === c.slug}
                icon={c.icon}
                label={c.label}
                collapsed={collapsed}
                tutorialId={c.slug === "taslama" ? "nav-category-taslama" : undefined}
              />
            ))}
          </div>

          <GroupLabel collapsed={collapsed}>Bağlantı &amp; Ayarlar</GroupLabel>
          <div className="flex flex-col gap-0.5">
            <button
              data-tutorial="nav-ideasoft"
              onClick={onOpenIdeasoft}
              className="sidebar-link connected"
              style={collapsed ? { justifyContent: "center", padding: 11 } : undefined}
              title="IdeaSoft bağlantısı"
            >
              <span className="sidebar-link-icon"><Icon path={ICON_SVG.link} /></span>
              {!collapsed && <span className="flex-1 truncate text-left">1 Mağaza Bağlı</span>}
              <span className="is-dot" style={collapsed ? { marginLeft: 0 } : undefined} />
            </button>
            <NavLink
              href="/panel/ayarlar"
              active={pathname === "/panel/ayarlar"}
              iconPath={ICON_SVG.gear}
              label="Ayarlar"
              collapsed={collapsed}
              tutorialId="nav-ayarlar"
            />
          </div>
        </nav>

        <div
          className="mt-auto pt-[14px]"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={handleLogout}
            className="sidebar-link sidebar-link-danger mb-1.5"
            style={collapsed ? { justifyContent: "center", padding: 11 } : undefined}
            title="Çıkış yap"
          >
            <span className="sidebar-link-icon"><Icon path={ICON_SVG.logout} /></span>
            {!collapsed && "Çıkış"}
          </button>
          <button
            onClick={onToggleCollapsed}
            className="hidden w-full items-center justify-center gap-2 rounded-full py-2.5 text-[11.5px] font-bold md:flex"
            style={{ border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--muted)" }}
          >
            <ChevronLeftIcon className={cx("h-3.5 w-3.5 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && "Daralt"}
          </button>
        </div>
      </aside>
    </>
  );
}

function NavLinkIcon({
  href,
  active,
  icon,
  label,
  collapsed,
  tutorialId,
}: {
  href: string;
  active: boolean;
  icon: ToolIconKey;
  label: string;
  collapsed: boolean;
  tutorialId?: string;
}) {
  return (
    <Link
      href={href}
      data-tutorial={tutorialId}
      className={cx("sidebar-link", active && "active")}
      style={collapsed ? { justifyContent: "center", padding: 11 } : undefined}
      title={label}
    >
      <span className="sidebar-link-icon">
        <ToolIcon icon={icon} className="h-[18px] w-[18px]" />
      </span>
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
    </Link>
  );
}
