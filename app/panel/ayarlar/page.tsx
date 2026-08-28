"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMobileMenu } from "../layout";
import { useTheme, useAccent, useToast, useTutorial } from "@/components/providers";
import { Topbar } from "@/components/topbar";
import { Toggle, LockedModal, PillButton } from "@/components/ui";
import { ToolIcon, CheckIcon, SunIcon, MoonIcon, LineChartIcon } from "@/components/icons";
import { ACCENT_COLORS, ACCOUNT_ICONS, accentGradient } from "@/lib/accent-colors";
import type { ToolIconKey } from "@/lib/types";
import { cx } from "@/lib/cx";

type TabKey = "fiyat" | "tarama" | "gorunum" | "telegram";
const TABS: { key: TabKey; label: string }[] = [
  { key: "fiyat", label: "Fiyatlandırma" },
  { key: "tarama", label: "Tarama & Bildirim" },
  { key: "gorunum", label: "Görünüm & Rapor" },
  { key: "telegram", label: "Telegram" },
];

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <h3 className="mb-4 text-[14px] font-bold" style={{ color: "var(--text)" }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
          {label}
        </div>
        {hint && (
          <div className="mt-0.5 text-[11.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
            {hint}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const SOUND_OPTIONS = ["Klasik", "Yumuşak Çan", "Dijital", "Marimba", "Net Uyarı"];

export default function AyarlarPage() {
  const onMobileMenu = useMobileMenu();
  const { theme, toggleTheme } = useTheme();
  const { accentColor, accentIcon, setAccentColor, setAccentIcon } = useAccent();
  const { showToast } = useToast();
  const { isRunning, currentStep } = useTutorial();
  const [tab, setTab] = useState<TabKey>("fiyat");
  const [lockedOpen, setLockedOpen] = useState(false);

  useEffect(() => {
    if (isRunning && currentStep?.targetId === "ayarlar-appearance") setTab("gorunum");
  }, [isRunning, currentStep]);

  const [gapThreshold, setGapThreshold] = useState(2.0);
  const [eurRate, setEurRate] = useState(55);
  const [autoSendCritical, setAutoSendCritical] = useState(false);

  const [notifGap, setNotifGap] = useState(true);
  const [notifNotListed, setNotifNotListed] = useState(true);
  const [notifComplete, setNotifComplete] = useState(true);
  const [visualNotif, setVisualNotif] = useState(true);
  const [soundNotif, setSoundNotif] = useState(true);
  const [volume, setVolume] = useState(70);
  const [sound, setSound] = useState(SOUND_OPTIONS[0]);

  return (
    <>
      <Topbar title="Ayarlar" subtitle="Tercihlerini özelleştir" onMobileMenu={onMobileMenu} />
      <div className="flex-1 p-4 sm:p-6">
        <div className="mb-5 flex gap-1 overflow-x-auto rounded-full border p-1" style={{ borderColor: "var(--border)", background: "var(--surface)", width: "fit-content" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="whitespace-nowrap rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors"
              style={{
                background: tab === t.key ? "linear-gradient(135deg,var(--brand-1),var(--brand-2))" : "transparent",
                color: tab === t.key ? "#fff" : "var(--muted)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "fiyat" && (
          <div className="flex flex-col gap-4">
            <SettingsCard title="Makas Eşiği">
              <p className="mb-4 text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
                Kendi konumunuzla lider (veya sizi tehdit eden rakip) arasındaki fark bu yüzdeyi aştığında ürün
                &quot;Makas Açık&quot; sayılır.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={gapThreshold}
                  onChange={(e) => setGapThreshold(Number(e.target.value))}
                  className="flex-1 accent-[var(--brand-1)]"
                />
                <span className="w-14 shrink-0 rounded-[10px] px-2.5 py-1.5 text-center text-[13px] font-bold" style={{ background: "var(--surface-2)", color: "var(--text)" }}>
                  %{gapThreshold.toFixed(1)}
                </span>
              </div>
            </SettingsCard>

            <SettingsCard title="Euro Kuru">
              <Row label="1 EUR = ? TL" hint="Fiyat gönderiminde TL tutarı bu kurla Euro'ya çevrilir.">
                <input
                  type="number"
                  value={eurRate}
                  onChange={(e) => setEurRate(Number(e.target.value))}
                  className="w-24 rounded-[10px] border px-3 py-2 text-right text-[13px] font-semibold outline-none"
                  style={{ borderColor: "var(--border-strong)", background: "var(--surface)", color: "var(--text)" }}
                />
              </Row>
              <Row label="Kritik Fiyatlarda Otomatik Gönder" hint="Kapalıyken kritik işaretli ürünler elle onay bekler.">
                <Toggle checked={autoSendCritical} onChange={setAutoSendCritical} />
              </Row>
            </SettingsCard>
          </div>
        )}

        {tab === "tarama" && (
          <div className="flex flex-col gap-4">
            <SettingsCard title="Bildirim Türleri">
              <Row label="'Bu Üründe Makas Açıldı' bildirimi">
                <Toggle checked={notifGap} onChange={setNotifGap} />
              </Row>
              <Row label="'Bu Ürün Listede Yok' bildirimi">
                <Toggle checked={notifNotListed} onChange={setNotifNotListed} />
              </Row>
              <Row label="'Tarama Tamamlandı' bildirimi">
                <Toggle checked={notifComplete} onChange={setNotifComplete} />
              </Row>
            </SettingsCard>
            <SettingsCard title="Uyarı Şekli">
              <Row label="Görsel bildirim (üstten kayan kutu)">
                <Toggle checked={visualNotif} onChange={setVisualNotif} />
              </Row>
              <Row label="Sesli uyarı">
                <Toggle checked={soundNotif} onChange={setSoundNotif} />
              </Row>
              <Row label="Ses düzeyi">
                <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} className="w-32 accent-[var(--brand-1)]" />
              </Row>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {SOUND_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSound(opt)}
                    className="rounded-[12px] border px-2 py-2 text-[11.5px] font-semibold transition-colors"
                    style={{
                      borderColor: sound === opt ? "var(--brand-1)" : "var(--border-strong)",
                      color: sound === opt ? "var(--brand-3)" : "var(--text)",
                      background: sound === opt ? "var(--brand-bg)" : "transparent",
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                onClick={() => showToast("price_ok", `🔊 ${sound}`, "Bildirim sesi önizlemesi")}
                className="mt-3 rounded-full border px-4 py-2 text-[12px] font-semibold transition-colors hover:bg-[var(--surface-2)]"
                style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
              >
                Dinle
              </button>
            </SettingsCard>
          </div>
        )}

        {tab === "gorunum" && (
          <div className="flex flex-col gap-4" data-tutorial="ayarlar-appearance">
            <SettingsCard title="Tema">
              <Row label="Karanlık mod" hint="Tercihiniz bu tarayıcıda hatırlanır.">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--surface-2)]"
                  style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
                >
                  {theme === "light" ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
                  {theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
                </button>
              </Row>
            </SettingsCard>

            <SettingsCard title="Hesap İkonu & Rengi">
              <p className="mb-3 text-[12.5px]" style={{ color: "var(--muted)" }}>
                Sidebar ve Hesaplarım sayfasında görünen simge.
              </p>
              <div className="mb-4 grid grid-cols-7 gap-2">
                {ACCOUNT_ICONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setAccentIcon(opt.key)}
                    title={opt.label}
                    className="flex aspect-square items-center justify-center rounded-[12px] border-2 transition-colors"
                    style={{
                      borderColor: accentIcon === opt.key ? "var(--brand-1)" : "var(--border)",
                      background: "var(--surface-2)",
                      color: "var(--text)",
                    }}
                  >
                    <ToolIcon icon={opt.key} className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {ACCENT_COLORS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setAccentColor(opt.key)}
                    title={opt.label}
                    className="relative flex h-9 w-9 items-center justify-center rounded-full"
                    style={{ background: opt.gradient }}
                  >
                    {accentColor === opt.key && <CheckIcon className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-[14px] border p-3" style={{ borderColor: "var(--border)" }}>
                <span className="flex h-9 w-9 items-center justify-center rounded-[11px] text-white" style={{ background: accentGradient(accentColor) }}>
                  <ToolIcon icon={accentIcon as ToolIconKey} className="h-4 w-4" />
                </span>
                <span className="text-[12px]" style={{ color: "var(--muted)" }}>
                  Önizleme
                </span>
              </div>
            </SettingsCard>

            <SettingsCard title="Rapor">
              <Row label="Durum dağılımı ve detaylı istatistikler" hint="Lider / Geride / Makas / Kritik sayıları tek bakışta.">
                <Link href="/panel/rapor">
                  <PillButton variant="surface">
                    <LineChartIcon className="h-4 w-4" /> Raporu Görüntüle
                  </PillButton>
                </Link>
              </Row>
            </SettingsCard>
          </div>
        )}

        {tab === "telegram" && (
          <SettingsCard title="Telegram Bildirimleri">
            <p className="mb-4 text-[12.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
              Gerçek sürümde kritik fiyat ve makas uyarıları Telegram botunuza da düşer. Bu demoda Telegram
              entegrasyonu kilitlidir.
            </p>
            <div className="flex flex-col gap-3 opacity-60">
              <input
                disabled
                placeholder="Bot Token"
                onFocus={() => setLockedOpen(true)}
                className="cursor-not-allowed rounded-[14px] border px-4 py-3 text-[13px] outline-none"
                style={{ borderColor: "var(--border-strong)", background: "var(--surface-2)" }}
              />
              <input
                disabled
                placeholder="Chat ID"
                onFocus={() => setLockedOpen(true)}
                className="cursor-not-allowed rounded-[14px] border px-4 py-3 text-[13px] outline-none"
                style={{ borderColor: "var(--border-strong)", background: "var(--surface-2)" }}
              />
            </div>
            <button
              onClick={() => setLockedOpen(true)}
              className={cx("locked-surface mt-4 rounded-[14px] px-4 py-2.5 text-[13px] font-semibold text-white opacity-70")}
              style={{ background: "linear-gradient(135deg,#9CA3C4,#7B82A8)" }}
            >
              Bağlantıyı Test Et
            </button>
          </SettingsCard>
        )}
      </div>

      <LockedModal
        open={lockedOpen}
        onClose={() => setLockedOpen(false)}
        title="Bu demoda kilitli"
        description="Telegram bot bağlantısı herkese açık demoda devre dışıdır. Tam sürümde kendi bot token'ınızla saniyeler içinde kurabilirsiniz."
      />
    </>
  );
}
