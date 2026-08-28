"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { fmtPrice, fmtDate } from "@/lib/format";
import { Modal } from "./ui";
import { LockIcon } from "./icons";

const VB_W = 600;
const VB_H = 170;
const PAD = 28;

function buildPoints(values: number[], min: number, max: number) {
  const n = values.length;
  const span = Math.max(max - min, 1);
  return values.map((v, i) => {
    const x = PAD + (i * (VB_W - PAD * 2)) / Math.max(n - 1, 1);
    const y = PAD + (1 - (v - min) / span) * (VB_H - PAD * 2);
    return [x, y] as const;
  });
}

function pathFor(points: readonly (readonly [number, number])[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
}

function Sparkline({ product }: { product: Product }) {
  const { myValues, leaderValues, min, max } = useMemo(() => {
    const my = product.history.map((h) => h.myPrice);
    const leader = product.history.map((h) => h.leaderPrice);
    const all = [...my, ...leader];
    return { myValues: my, leaderValues: leader, min: Math.min(...all), max: Math.max(...all) };
  }, [product]);

  if (product.history.length === 0) {
    return (
      <div
        className="flex h-[170px] items-center justify-center rounded-[16px] px-6 text-center text-[12.5px]"
        style={{ background: "var(--surface-2)", color: "var(--muted)" }}
      >
        Henüz grafik çizecek kadar fiyat geçmişi birikmedi — birkaç tarama turu sonra burada fiyatınızın zaman
        içindeki seyrini göreceksiniz.
      </div>
    );
  }

  const myPoints = buildPoints(myValues, min, max);
  const leaderPoints = buildPoints(leaderValues, min, max);

  return (
    <div className="rounded-[16px] border p-3" style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full">
        {[0, 0.5, 1].map((t) => (
          <line
            key={t}
            x1={PAD}
            x2={VB_W - PAD}
            y1={PAD + t * (VB_H - PAD * 2)}
            y2={PAD + t * (VB_H - PAD * 2)}
            stroke="var(--border-strong)"
            strokeDasharray="4,4"
            strokeWidth={1}
          />
        ))}
        <path d={pathFor(leaderPoints)} fill="none" stroke="var(--muted-2)" strokeWidth={2} strokeDasharray="5,4" />
        <path d={pathFor(myPoints)} fill="none" stroke="var(--mine)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {myPoints.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="var(--mine)">
            <title>{`${fmtDate(product.history[i].date)} — ${fmtPrice(myValues[i])}`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between text-[11px]" style={{ color: "var(--muted)" }}>
        <span>{fmtDate(product.history[0].date)}</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded-full" style={{ background: "var(--mine)" }} /> Sizin Fiyatınız
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-3 rounded-full border-t border-dashed" style={{ borderColor: "var(--muted-2)" }} /> Lider Fiyatı
          </span>
        </div>
        <span>{fmtDate(product.history[product.history.length - 1].date)}</span>
      </div>
    </div>
  );
}

export function PriceModal({
  open,
  onClose,
  product,
  onLockedSend,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onLockedSend: () => void;
}) {
  const [customPrice, setCustomPrice] = useState("");

  useEffect(() => {
    setCustomPrice("");
  }, [product?.id]);

  if (!product) return null;

  const isLeader = product.myRank === 1;
  const threat = isLeader ? product.sellers[1]?.price : product.sellers[0]?.price;
  const suggestions = threat
    ? {
        under1: Math.max(0, Math.round((threat - 1) * 100) / 100),
        under1_5pct: Math.round(threat * 0.985 * 100) / 100,
      }
    : null;

  return (
    <Modal open={open} onClose={onClose} title="Fiyat Belirle" maxWidth={620}>
      <div className="mb-4">
        <div className="mb-0.5 text-[15px] font-bold" style={{ color: "var(--text)" }}>
          {product.name}
        </div>
        <div className="text-[12px]" style={{ color: "var(--muted)" }}>
          {product.sku} · Şu anki fiyatınız: <strong style={{ color: "var(--text)" }}>{fmtPrice(product.myPrice)}</strong>
        </div>
      </div>

      <Sparkline product={product} />

      {suggestions && (
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setCustomPrice(String(suggestions.under1))}
            className="rounded-[14px] border p-3 text-left transition-colors hover:bg-[var(--surface-2)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <div className="text-[11px] font-semibold" style={{ color: "var(--muted)" }}>
              1 TL Altına İn
            </div>
            <div className="text-[14.5px] font-bold" style={{ color: "var(--text)" }}>
              {fmtPrice(suggestions.under1)}
            </div>
          </button>
          <button
            onClick={() => setCustomPrice(String(suggestions.under1_5pct))}
            className="rounded-[14px] border p-3 text-left transition-colors hover:bg-[var(--surface-2)]"
            style={{ borderColor: "var(--border-strong)" }}
          >
            <div className="text-[11px] font-semibold" style={{ color: "var(--muted)" }}>
              %1.5 Daha Ucuz
            </div>
            <div className="text-[14.5px] font-bold" style={{ color: "var(--text)" }}>
              {fmtPrice(suggestions.under1_5pct)}
            </div>
          </button>
        </div>
      )}

      <div className="mt-4">
        <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
          Gönderilecek fiyat
        </label>
        <input
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          placeholder={String(product.myPrice)}
          inputMode="decimal"
          className="w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none"
          style={{ borderColor: "var(--border-strong)", background: "var(--surface)", color: "var(--text)" }}
        />
      </div>

      <button
        onClick={onLockedSend}
        className="locked-surface mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] py-3.5 text-[14px] font-semibold text-white opacity-60"
        style={{ background: "linear-gradient(135deg,#9CA3C4,#7B82A8)" }}
      >
        <LockIcon className="h-4 w-4" /> Fiyatı IdeaSoft&apos;a Gönder (Demoda Kilitli)
      </button>
    </Modal>
  );
}
