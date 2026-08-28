"use client";

import { useMobileMenu } from "../layout";
import { Topbar } from "@/components/topbar";
import { STATS, getProductsInDisplayOrder } from "@/lib/demo-data";

function DonutChart() {
  const r = 68;
  const stroke = 22;
  const c = 2 * Math.PI * r;
  const liderLen = (STATS.lider / STATS.total) * c;
  const gerideLen = c - liderLen;

  return (
    <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
      <circle cx="90" cy="90" r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
      <circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke="var(--lead)"
        strokeWidth={stroke}
        strokeDasharray={`${liderLen} ${c - liderLen}`}
        strokeLinecap="round"
      />
      <circle
        cx="90"
        cy="90"
        r={r}
        fill="none"
        stroke="var(--info)"
        strokeWidth={stroke}
        strokeDasharray={`${gerideLen} ${c - gerideLen}`}
        strokeDashoffset={-liderLen}
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatTile({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="rounded-[18px] border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="text-[24px] font-extrabold" style={{ color: color ?? "var(--text)" }}>
        {value}
      </div>
      <div className="mt-0.5 text-[12px] font-medium" style={{ color: "var(--muted)" }}>
        {label}
      </div>
    </div>
  );
}

export default function RaporPage() {
  const onMobileMenu = useMobileMenu();
  const products = getProductsInDisplayOrder();
  const sorted = [...products].sort((a, b) => b.gapPct - a.gapPct);
  const maxGap = Math.max(...sorted.map((p) => p.gapPct), 1);

  return (
    <>
      <Topbar title="Detaylı Rapor" subtitle="Durum dağılımı ve fiyat farkı analizi" onMobileMenu={onMobileMenu} />
      <div className="flex-1 p-4 sm:p-6">
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Toplam Ürün" value={STATS.total} />
          <StatTile label="Lider" value={STATS.lider} color="var(--lead)" />
          <StatTile label="Geride" value={STATS.geride} color="var(--info)" />
          <StatTile label="Makas Açık" value={STATS.gapAlert} color="var(--alert-text)" />
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center justify-center rounded-[20px] border p-6" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <DonutChart />
            <div className="mt-4 flex gap-5">
              <div className="flex items-center gap-2 text-[12.5px]" style={{ color: "var(--text)" }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--lead)" }} />
                Lider ({STATS.lider})
              </div>
              <div className="flex items-center gap-2 text-[12.5px]" style={{ color: "var(--text)" }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--info)" }} />
                Geride ({STATS.geride})
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <h3 className="mb-4 text-[14px] font-bold" style={{ color: "var(--text)" }}>
              Ürün başına fiyat farkı (Makas %)
            </h3>
            <div className="flex flex-col gap-2.5">
              {sorted.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-[170px] shrink-0 truncate text-[11.5px]" style={{ color: "var(--muted)" }} title={p.name}>
                    {p.name}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(p.gapPct / maxGap) * 100}%`,
                        background: p.gapAlert ? "var(--alert)" : "var(--brand-1)",
                      }}
                    />
                  </div>
                  <span className="w-14 shrink-0 text-right text-[11.5px] font-semibold" style={{ color: "var(--text)" }}>
                    %{p.gapPct.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
