"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { fmtPrice } from "@/lib/format";
import { MINE_SENTINEL, computeSuggestion, computeDiff } from "@/lib/demo-data";
import { cx } from "@/lib/cx";
import { ToolIcon, StarIcon, LineChartIcon, TagIcon, TrashIcon, AlertIcon, LockIcon } from "./icons";

function sellerName(name: string, storeName: string) {
  return name === MINE_SENTINEL ? storeName || "Mağazanız" : name;
}

function DiffChip({ kind, delta }: { kind: ReturnType<typeof computeDiff>["kind"]; delta: number }) {
  const label =
    kind === "up"
      ? `▲ ${fmtPrice(Math.abs(delta))}`
      : kind === "down"
      ? `▼ ${fmtPrice(Math.abs(delta))}`
      : kind === "new"
      ? "Yeni"
      : kind === "critical"
      ? "Kritik"
      : "Değişim yok";
  return <span className={`diff-chip diff-${kind}`}>{label}</span>;
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
  const shownSellers = product.sellers.slice(0, 5);
  const restCount = product.sellers.length - shownSellers.length;

  function handleStar() {
    setStarPop(true);
    setTimeout(() => setStarPop(false), 400);
    onToggleStar();
  }

  return (
    <tr
      className={cx("prod-row card-enter", starred && "is-starred")}
      style={{ ["--status-color" as string]: statusColor, ["--enter-delay" as string]: `${enterDelayMs}ms` }}
      data-tutorial={tutorialTarget ? "product-row-0" : undefined}
    >
      <td className="col-photo">
        <div className="row-image">
          <ToolIcon icon={product.icon} className="h-11 w-11" style={{ color: "#8B92B8" }} />
        </div>
      </td>

      <td className="col-name">
        <div className="row-name-wrap">
          <div className="row-name-text">{product.name}</div>
          <div className="row-name-meta">
            <span className={`badge-inline ${isLider ? "lider" : "geride"}`}>{isLider ? "Lider" : `${product.myRank}. sıra`}</span>
            {product.critical && (
              <span className="badge-inline critical">
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
              <span className="note-chip-mini">
                <TagIcon className="h-2.5 w-2.5" /> Not
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="col-sellers">
        <div className="sellers-compact flex flex-col gap-1">
          {shownSellers.map((seller) => (
            <div key={seller.rank} className="flex items-center gap-1.5 text-[11.5px]">
              <span
                className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[9.5px] font-bold"
                style={{
                  background: seller.rank === 1 ? "linear-gradient(135deg,#FFD873,#FFAE1F)" : "var(--surface-2)",
                  color: seller.rank === 1 ? "#7A4B00" : "var(--muted)",
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

      <td className="col-myprice">{fmtPrice(product.myPrice)}</td>

      <td className={cx("col-gap gap-cell", product.gapAlert && "warn")}>
        %{product.gapPct.toFixed(2).replace(".", ",")}
      </td>

      <td className="col-suggested">
        {product.critical ? (
          <span className="sug-price sug-critical">
            <AlertIcon className="h-3 w-3" /> Kritik
          </span>
        ) : suggestion ? (
          <span className="sug-price">{fmtPrice(suggestion)}</span>
        ) : (
          <span className="sug-price sug-empty">—</span>
        )}
      </td>

      <td className="col-diff">
        <DiffChip kind={diff.kind} delta={diff.delta} />
      </td>

      <td className="col-actions">
        <div className="row-actions" data-tutorial={tutorialTarget ? "product-actions-0" : undefined}>
          <div className="row-tools">
            <button
              onClick={handleStar}
              className={cx("icon-only star-btn table-star", starred && "active", starPop && "star-pop")}
              aria-label="Yıldızla"
            >
              <StarIcon filled={starred} />
            </button>
            <button onClick={onOpenPrice} className="icon-only" aria-label="Fiyat Belirle" title="Fiyat Belirle (detaylı)">
              <LineChartIcon />
            </button>
            <button onClick={onOpenNote} className="icon-only" aria-label="Not">
              <TagIcon />
            </button>
            <button onClick={onDelete} className="icon-only" aria-label="Ürünü Sil" title="Ürünü Sil">
              <TrashIcon />
            </button>
          </div>
          <button
            onClick={onLockedSend}
            className={cx("row-send-btn locked-surface opacity-75", product.critical && "row-send-btn-manual")}
          >
            <LockIcon className="h-3 w-3" />
            {product.critical ? "Elle Gönder" : "Fiyat Gönder"}
          </button>
        </div>
      </td>
    </tr>
  );
}

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
    <div className="table-scroll -mx-4 sm:-mx-6" style={{ padding: "0 16px 8px" }}>
      <table className="products-table">
        <thead>
          <tr>
            <th className="col-photo">Ürün</th>
            <th className="col-name">Ürün Adı</th>
            <th className="col-sellers">İlk 5 Mağaza</th>
            <th className="col-myprice">Sizin Fiyatınız</th>
            <th className="col-gap">Makas</th>
            <th className="col-suggested">Önerilen Fiyat</th>
            <th className="col-diff">Değişim</th>
            <th className="col-actions">İşlemler</th>
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
