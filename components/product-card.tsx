"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { fmtPrice } from "@/lib/format";
import { MINE_SENTINEL } from "@/lib/demo-data";
import { cx } from "@/lib/cx";
import { StatusBadge } from "./ui";
import { ToolIcon, StarIcon, LineChartIcon, TagIcon, TrashIcon, ScissorsIcon, AlertIcon, LockIcon } from "./icons";

function sellerName(name: string, storeName: string) {
  return name === MINE_SENTINEL ? storeName || "Mağazanız" : name;
}

export function SellerList({ product, storeName, limit = 4 }: { product: Product; storeName: string; limit?: number }) {
  const shown = product.sellers.slice(0, limit);
  const rest = product.sellers.length - shown.length;
  return (
    <div className="flex flex-col gap-1">
      {shown.map((seller) => (
        <div
          key={seller.rank}
          className="flex items-center gap-2 rounded-[10px] px-2 py-1.5 text-[12px]"
          style={{
            background: seller.isMine ? "var(--mine-bg)" : "transparent",
            border: seller.isMine ? "1px solid var(--mine-border)" : "1px solid transparent",
          }}
        >
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
            style={{
              background: seller.rank === 1 ? "linear-gradient(135deg,#FFD873,#FFAE1F)" : "var(--surface-2)",
              color: seller.rank === 1 ? "#7A4B00" : "var(--muted)",
            }}
          >
            {seller.rank}
          </span>
          <span
            className="min-w-0 flex-1 truncate font-medium"
            style={{ color: seller.isMine ? "var(--mine)" : "var(--text)" }}
          >
            {sellerName(seller.name, storeName)}
          </span>
          {seller.isMine && (
            <span
              className="rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
              style={{ background: "var(--mine)" }}
            >
              Siz
            </span>
          )}
          <span className="shrink-0 font-semibold" style={{ color: "var(--text)" }}>
            {fmtPrice(seller.price)}
          </span>
        </div>
      ))}
      {rest > 0 && (
        <div className="px-2 py-1 text-[11.5px]" style={{ color: "var(--muted)" }}>
          +{rest} satıcı daha
        </div>
      )}
    </div>
  );
}

export function ProductCard({
  product,
  storeName,
  starred,
  note,
  onToggleStar,
  onOpenPrice,
  onOpenNote,
  onDelete,
  onLockedSend,
  tutorialTarget = false,
  enterDelayMs = 0,
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
  tutorialTarget?: boolean;
  enterDelayMs?: number;
}) {
  const [starPop, setStarPop] = useState(false);
  const isLider = product.status === "lider";

  function handleStar() {
    setStarPop(true);
    setTimeout(() => setStarPop(false), 400);
    onToggleStar();
  }

  return (
    <div
      className="card-enter card-lift flex flex-col overflow-hidden rounded-[20px] border"
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        borderTop: `3px solid ${isLider ? "var(--lead)" : "var(--info)"}`,
        boxShadow: "var(--shadow-1)",
        ["--enter-delay" as string]: `${enterDelayMs}ms`,
      }}
      data-tutorial={tutorialTarget ? "product-card-0" : undefined}
    >
      <div className="relative flex h-[132px] items-center justify-center" style={{ background: "#F5F7FC" }}>
        <ToolIcon icon={product.icon} className="h-16 w-16" style={{ color: "#8B92B8" }} />
        <span
          className="absolute left-2.5 top-2.5 rounded-full px-2 py-1 text-[10.5px] font-bold backdrop-blur"
          style={{
            background: isLider ? "rgba(18,184,114,0.16)" : "rgba(124,92,252,0.16)",
            color: isLider ? "var(--lead)" : "var(--info)",
          }}
        >
          {isLider ? "Lider" : `${product.myRank}. sıra`}
        </span>
        <button
          onClick={handleStar}
          className={cx(
            "absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full transition-colors",
            starPop && "star-pop"
          )}
          style={{
            background: starred ? "linear-gradient(135deg,#FFD873,#FFAE1F)" : "rgba(255,255,255,0.9)",
            color: starred ? "#fff" : "#B7BBD6",
            boxShadow: "var(--shadow-1)",
          }}
          aria-label="Yıldızla"
        >
          <StarIcon filled={starred} className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug" style={{ color: "var(--text)" }}>
          {product.name}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
            style={{ background: "var(--surface-2)", color: "var(--muted)" }}
          >
            {product.sku}
          </span>
          <StatusBadge status={product.status} rank={product.myRank} />
          {product.critical && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
              style={{ background: "var(--critical-bg)", color: "var(--critical)" }}
            >
              <AlertIcon className="h-3 w-3" /> Kritik Fiyat
            </span>
          )}
          {note && (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
              style={{ background: "var(--surface-2)", color: "var(--muted)" }}
            >
              <TagIcon className="h-3 w-3" /> Not
            </span>
          )}
        </div>

        <div className="text-[19px] font-bold" style={{ color: "var(--text)" }}>
          {fmtPrice(product.myPrice)}
        </div>

        <div
          className={cx(
            "flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 text-[11.5px] font-medium",
          )}
          style={{
            background: product.gapAlert ? "var(--alert-bg)" : "var(--surface-2)",
            color: product.gapAlert ? "var(--alert-text)" : "var(--muted)",
          }}
        >
          <ScissorsIcon className="h-3.5 w-3.5" />
          Makas: %{product.gapPct.toFixed(2).replace(".", ",")}
          {product.gapAlert && <span className="font-semibold">— eşik aşıldı</span>}
        </div>

        <SellerList product={product} storeName={storeName} />

        <div className="mt-auto flex flex-col gap-2 pt-1">
          <div
            className="flex items-center justify-center gap-1 rounded-full p-1"
            style={{ background: "var(--surface-2)" }}
            data-tutorial={tutorialTarget ? "product-actions-0" : undefined}
          >
            <button
              onClick={onOpenPrice}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[11.5px] font-semibold transition-colors hover:bg-[var(--surface)]"
              style={{ color: "var(--text)" }}
            >
              <LineChartIcon className="h-3.5 w-3.5" /> Fiyat Belirle
            </button>
            <button
              onClick={onOpenNote}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[11.5px] font-semibold transition-colors hover:bg-[var(--surface)]"
              style={{ color: "var(--text)" }}
            >
              <TagIcon className="h-3.5 w-3.5" /> Not
            </button>
            <button
              onClick={onDelete}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-[11.5px] font-semibold transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
              style={{ color: "var(--muted)" }}
            >
              <TrashIcon className="h-3.5 w-3.5" /> Sil
            </button>
          </div>
          <button
            onClick={onLockedSend}
            className="locked-surface flex items-center justify-center gap-2 rounded-[14px] py-2.5 text-[13px] font-semibold text-white opacity-60"
            style={{ background: "linear-gradient(135deg,#9CA3C4,#7B82A8)" }}
          >
            <LockIcon className="h-3.5 w-3.5" /> Fiyat Gönder
          </button>
        </div>
      </div>
    </div>
  );
}
