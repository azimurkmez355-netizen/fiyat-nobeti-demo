"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { fmtPrice } from "@/lib/format";
import { MINE_SENTINEL, computeSuggestion, computeDiff } from "@/lib/demo-data";
import { cx } from "@/lib/cx";
import { ToolIcon, StarIcon, LineChartIcon, TagIcon, TrashIcon, ScissorsIcon, AlertIcon, LockIcon } from "./icons";

function sellerName(name: string, storeName: string) {
  return name === MINE_SENTINEL ? storeName || "Mağazanız" : name;
}

function DiffChip({ kind, delta }: { kind: ReturnType<typeof computeDiff>["kind"]; delta: number }) {
  const map: Record<string, { bg: string; fg: string; label: string }> = {
    up: { bg: "var(--lead-bg)", fg: "var(--lead)", label: `▲ ${fmtPrice(Math.abs(delta))}` },
    down: { bg: "var(--danger-bg)", fg: "var(--danger)", label: `▼ ${fmtPrice(Math.abs(delta))}` },
    none: { bg: "var(--surface-2)", fg: "var(--muted)", label: "Değişim yok" },
    new: { bg: "var(--info-bg)", fg: "var(--info)", label: "Yeni" },
    critical: { bg: "var(--critical-bg)", fg: "var(--critical)", label: "Kritik" },
  };
  const m = map[kind];
  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[10.5px] font-bold"
      style={{ background: m.bg, color: m.fg }}
    >
      {m.label}
    </span>
  );
}

function Row({
  product,
  storeName,
  starred,
  note,
  onToggleStar,
  onOpenPrice,
  onOpenNote,
  onDelete,
  onLockedSend,
  tutorialTarget,
  enterDelayMs,
}: {
  product: Product;
  storeName: string;
  starred: boolean;
  note?: string;
  onToggleStar: () => void;
  onOpenPrice: () => void;
  onOpenNote: () => void;
  onDelete: () => void;
  onLockedSend: () => void;
  tutorialTarget: boolean;
  enterDelayMs: number;
}) {
  const [starPop, setStarPop] = useState(false);
  const isLider = product.status === "lider";
  const statusColor = isLider ? "var(--lead)" : "var(--info)";
  const suggestion = computeSuggestion(product);
  const diff = computeDiff(product);
  const shownSellers = product.sellers.slice(0, 4);
  const restCount = product.sellers.length - shownSellers.length;

  function handleStar() {
    setStarPop(true);
    setTimeout(() => setStarPop(false), 400);
    onToggleStar();
  }

  return (
    <tr
      className="card-enter align-top"
      style={{
        borderLeft: `4px solid ${starred ? "#F0A319" : statusColor}`,
        borderBottom: "1px solid var(--border)",
        ["--enter-delay" as string]: `${enterDelayMs}ms`,
      }}
      data-tutorial={tutorialTarget ? "product-row-0" : undefined}
    >
      <td className="py-3 pl-3 pr-2">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px]"
          style={{ background: "#F5F7FC" }}
        >
          <ToolIcon icon={product.icon} className="h-6 w-6" style={{ color: "#8B92B8" }} />
        </div>
      </td>

      <td className="min-w-[220px] max-w-[280px] py-3 pr-3">
        <div className="text-[13px] font-semibold leading-snug" style={{ color: "var(--text)" }}>
          {product.name}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
            style={{
              background: isLider ? "var(--lead-bg)" : "var(--info-bg)",
              color: isLider ? "var(--lead)" : "var(--info)",
            }}
          >
            {isLider ? "Lider" : `${product.myRank}. sıra`}
          </span>
          {product.critical && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
              style={{ background: "var(--critical-bg)", color: "var(--critical)" }}
            >
              <AlertIcon className="h-3 w-3" /> Kritik Fiyat
            </span>
          )}
          <span
            className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
            style={{ background: "var(--surface-2)", color: "var(--muted)" }}
          >
            {product.sku}
          </span>
          {note && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
              style={{ background: "var(--surface-2)", color: "var(--muted)" }}
            >
              <TagIcon className="h-3 w-3" /> Not
            </span>
          )}
        </div>
      </td>

      <td className="min-w-[210px] py-3 pr-3">
        <div className="flex flex-col gap-1">
          {shownSellers.map((seller) => (
            <div key={seller.rank} className="flex items-center gap-1.5 text-[11.5px]">
              <span
                className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold"
                style={{
                  background: seller.rank === 1 ? "linear-gradient(135deg,#FFD873,#FFAE1F)" : "var(--surface-2)",
                  color: seller.rank === 1 ? "#7A4B00" : "var(--muted)",
                  width: 18,
                  height: 18,
                }}
              >
                {seller.rank}
              </span>
              <span
                className="min-w-0 flex-1 truncate"
                style={{ color: seller.isMine ? "var(--mine)" : "var(--text)", fontWeight: seller.isMine ? 700 : 500 }}
              >
                {sellerName(seller.name, storeName)}
              </span>
              {seller.isMine && (
                <span className="rounded-full px-1.5 text-[9px] font-bold text-white" style={{ background: "var(--mine)" }}>
                  Siz
                </span>
              )}
              <span className="shrink-0 font-semibold" style={{ color: "var(--text)" }}>
                {fmtPrice(seller.price)}
              </span>
            </div>
          ))}
          {restCount > 0 && (
            <div className="text-[10.5px]" style={{ color: "var(--muted)" }}>
              +{restCount} satıcı daha
            </div>
          )}
        </div>
      </td>

      <td className="py-3 pr-3 text-[14px] font-bold" style={{ color: "var(--text)" }}>
        {fmtPrice(product.myPrice)}
      </td>

      <td className="py-3 pr-3">
        <div
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[11px] font-semibold"
          style={{
            background: product.gapAlert ? "var(--alert-bg)" : "var(--surface-2)",
            color: product.gapAlert ? "var(--alert-text)" : "var(--muted)",
          }}
        >
          {product.gapAlert && <ScissorsIcon className="h-3 w-3" />}
          %{product.gapPct.toFixed(2).replace(".", ",")}
        </div>
      </td>

      <td className="py-3 pr-3">
        {product.critical ? (
          <span
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1 text-[10.5px] font-bold"
            style={{ background: "var(--critical-bg)", color: "var(--critical)" }}
          >
            <AlertIcon className="h-3 w-3" /> Kritik
          </span>
        ) : suggestion ? (
          <span className="whitespace-nowrap text-[13px] font-semibold" style={{ color: "var(--text)" }}>
            {fmtPrice(suggestion)}
          </span>
        ) : (
          <span className="text-[11px]" style={{ color: "var(--muted-2)" }}>
            —
          </span>
        )}
      </td>

      <td className="py-3 pr-3">
        <DiffChip kind={diff.kind} delta={diff.delta} />
      </td>

      <td className="py-3 pl-1 pr-3">
        <div className="flex flex-col items-stretch gap-1.5" data-tutorial={tutorialTarget ? "product-actions-0" : undefined}>
          <div className="flex items-center justify-center gap-1 rounded-full p-1" style={{ background: "var(--surface-2)" }}>
            <button
              onClick={handleStar}
              className={cx("flex h-7 w-7 items-center justify-center rounded-full transition-colors", starPop && "star-pop")}
              style={{ color: starred ? "#FFAE1F" : "var(--muted)" }}
              aria-label="Yıldızla"
            >
              <StarIcon filled={starred} className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onOpenPrice}
              className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface)]"
              style={{ color: "var(--text)" }}
              aria-label="Fiyat Belirle"
              title="Fiyat Belirle (detaylı)"
            >
              <LineChartIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onOpenNote}
              className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface)]"
              style={{ color: "var(--text)" }}
              aria-label="Not"
            >
              <TagIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
              style={{ color: "var(--muted)" }}
              aria-label="Ürünü Sil"
              title="Ürünü Sil"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            onClick={onLockedSend}
            className="locked-surface flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[12px] py-2 text-[11.5px] font-semibold text-white opacity-60"
            style={{
              background: product.critical
                ? "linear-gradient(135deg,#FF8FBB,var(--critical))"
                : "linear-gradient(135deg,#9CA3C4,#7B82A8)",
            }}
          >
            <LockIcon className="h-3 w-3" />
            {product.critical ? "Elle Gönder" : "Fiyat Gönder"}
          </button>
        </div>
      </td>
    </tr>
  );
}

const HEAD_CELLS = ["Ürün", "Ürün Adı", "İlk 5 Mağaza", "Sizin Fiyatınız", "Makas", "Önerilen Fiyat", "Değişim", "İşlemler"];

export function ProductTable({
  products,
  storeName,
  starredIds,
  notes,
  onToggleStar,
  onOpenPrice,
  onOpenNote,
  onDelete,
  onLockedSend,
  firstRowTutorial,
}: {
  products: Product[];
  storeName: string;
  starredIds: string[];
  notes: Record<string, string>;
  onToggleStar: (id: string) => void;
  onOpenPrice: (p: Product) => void;
  onOpenNote: (p: Product) => void;
  onDelete: (p: Product) => void;
  onLockedSend: () => void;
  firstRowTutorial: boolean;
}) {
  return (
    <div
      className="overflow-x-auto rounded-[20px] border"
      style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-1)" }}
    >
      <table className="w-full min-w-[1080px] border-collapse">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {HEAD_CELLS.map((h) => (
              <th
                key={h}
                className="whitespace-nowrap px-3 py-3 text-left text-[11px] font-bold uppercase tracking-wide"
                style={{ color: "var(--muted)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p, idx) => (
            <Row
              key={p.id}
              product={p}
              storeName={storeName}
              starred={starredIds.includes(p.id)}
              note={notes[p.id]}
              onToggleStar={() => onToggleStar(p.id)}
              onOpenPrice={() => onOpenPrice(p)}
              onOpenNote={() => onOpenNote(p)}
              onDelete={() => onDelete(p)}
              onLockedSend={onLockedSend}
              tutorialTarget={firstRowTutorial && idx === 0}
              enterDelayMs={Math.min(idx, 8) * 35}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
