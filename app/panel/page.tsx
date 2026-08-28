"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMobileMenu } from "./layout";
import { useSession, useToast } from "@/components/providers";
import { Topbar } from "@/components/topbar";
import { ProductTable } from "@/components/product-table";
import { PriceModal } from "@/components/price-modal";
import { NoteModal } from "@/components/feature-modals";
import { IconDialog, LockedModal } from "@/components/ui";
import { TrashIcon, SearchIcon } from "@/components/icons";
import {
  CATEGORIES,
  FILTERS,
  STATS,
  getProductsInDisplayOrder,
  getProductsByCategory,
} from "@/lib/demo-data";
import {
  getStarredIds,
  toggleStarred,
  getHiddenIds,
  hideProduct,
  getNotes,
  saveNote,
  getNotifHistory,
} from "@/lib/session";
import type { CategorySlug, FilterKey, Product } from "@/lib/types";

function EmptyState({ filterKey }: { filterKey: FilterKey }) {
  const copy: Record<FilterKey, { title: string; body: string }> = {
    all: { title: "Veri bekleniyor", body: "İlk tarama tamamlandığında ürünler burada görünecek." },
    geride: { title: "Sonuç yok", body: "Filtreyi veya aramayı değiştirmeyi dene." },
    gap: { title: "Şu an makas açık ürün yok", body: "Harika gidiyor! Fiyat farkı hiçbir üründe eşiği aşmıyor." },
    critical: { title: "Kritik fiyat yok", body: "Fiyat skalasında anormal bir kırılma tespit edilmedi." },
    "listede-yok": { title: "Tüm ürünler listede", body: "Akakçe favori listenizde eksik ürün bulunmuyor." },
    yildizli: { title: "Henüz yıldızlı ürün yok", body: "Bir satırdaki yıldız ikonuna tıklayarak öncelikli ürünlerini burada topla." },
  };
  const c = copy[filterKey] ?? copy.all;
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed py-20 text-center" style={{ borderColor: "var(--border-strong)" }}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--surface-2)", color: "var(--muted-2)" }}>
        <SearchIcon className="h-6 w-6" />
      </div>
      <div className="mb-1 text-[15px] font-bold" style={{ color: "var(--text)" }}>
        {c.title}
      </div>
      <div className="max-w-[320px] text-[13px]" style={{ color: "var(--muted)" }}>
        {c.body}
      </div>
    </div>
  );
}

function PanelPageInner() {
  const searchParams = useSearchParams();
  const onMobileMenu = useMobileMenu();
  const { session } = useSession();
  const { showToast } = useToast();

  const filter = (searchParams.get("filter") ?? "all") as FilterKey;
  const kategori = searchParams.get("kategori") as CategorySlug | null;

  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [priceProduct, setPriceProduct] = useState<Product | null>(null);
  const [noteProduct, setNoteProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [lockedOpen, setLockedOpen] = useState(false);
  const announced = useRef(false);

  useEffect(() => {
    setStarredIds(getStarredIds());
    setHiddenIds(getHiddenIds());
    setNotes(getNotes());
  }, []);

  useEffect(() => {
    if (announced.current) return;
    announced.current = true;
    if (getNotifHistory().some((h) => h.type === "complete")) return;
    const t = setTimeout(
      () => showToast("complete", "Tarama Tamamlandı", `${STATS.total} ürün başarıyla tarandı.`),
      1100
    );
    return () => clearTimeout(t);
  }, [showToast]);

  const baseList = kategori ? getProductsByCategory(kategori) : getProductsInDisplayOrder();
  const visible = baseList.filter((p) => !hiddenIds.includes(p.id));

  let filtered = visible;
  if (!kategori) {
    if (filter === "geride") filtered = visible.filter((p) => p.status === "geride");
    else if (filter === "gap") filtered = visible.filter((p) => p.gapAlert);
    else if (filter === "critical") filtered = visible.filter((p) => p.critical);
    else if (filter === "listede-yok") filtered = [];
    else if (filter === "yildizli") filtered = visible.filter((p) => starredIds.includes(p.id));
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }

  const { title, subtitle } = useMemo(() => {
    if (kategori) {
      const cat = CATEGORIES.find((c) => c.slug === kategori);
      return { title: cat?.label ?? "Kategori", subtitle: `${filtered.length} ürün` };
    }
    const f = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];
    return { title: f.label, subtitle: f.subtitle };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kategori, filter, filtered.length]);

  function toggleStar(id: string) {
    setStarredIds(toggleStarred(id));
  }
  function handleDeleteConfirm() {
    if (!deleteProduct) return;
    setHiddenIds(hideProduct(deleteProduct.id));
    setDeleteProduct(null);
  }
  function handleSaveNote(note: string) {
    if (!noteProduct) return;
    saveNote(noteProduct.id, note);
    setNotes(getNotes());
  }

  const isFirstRowEligible = !kategori && filter === "all" && !search.trim();

  return (
    <>
      <Topbar title={title} subtitle={subtitle} onMobileMenu={onMobileMenu} search={{ value: search, onChange: setSearch }} />
      <div className="flex-1 p-4 sm:p-6">
        {filtered.length === 0 ? (
          <EmptyState filterKey={kategori ? "all" : filter} />
        ) : (
          <ProductTable
            products={filtered}
            storeName={session?.storeName ?? ""}
            starredIds={starredIds}
            notes={notes}
            onToggleStar={toggleStar}
            onOpenPrice={setPriceProduct}
            onOpenNote={setNoteProduct}
            onDelete={setDeleteProduct}
            onLockedSend={() => setLockedOpen(true)}
            firstRowTutorial={isFirstRowEligible}
          />
        )}
      </div>

      <PriceModal open={!!priceProduct} onClose={() => setPriceProduct(null)} product={priceProduct} onLockedSend={() => setLockedOpen(true)} />
      <NoteModal
        open={!!noteProduct}
        onClose={() => setNoteProduct(null)}
        productName={noteProduct?.name ?? ""}
        initialNote={(noteProduct && notes[noteProduct.id]) ?? ""}
        onSave={handleSaveNote}
      />
      <IconDialog
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        tone="danger"
        icon={<TrashIcon className="h-7 w-7" />}
        title="Ürünü sil?"
        body={
          <>
            &quot;{deleteProduct?.name}&quot; listenizden kalıcı olarak kaldırılacak. Bu işlem geri alınamaz — ama
            çıkış yapıp tekrar giriş yaptığınızda demo baştan sıfırlanır.
          </>
        }
        primaryLabel="Ürünü Sil"
        onPrimary={handleDeleteConfirm}
        secondaryLabel="Vazgeç"
      />
      <LockedModal
        open={lockedOpen}
        onClose={() => setLockedOpen(false)}
        title="Bu demoda kilitli"
        description="Herkese açık demo sürümünde IdeaSoft'a fiyat gönderimi kapalıdır. Tam sürümde bu buton, önerilen fiyatı Euro'ya çevirip doğrudan mağazanıza iletir."
      />
    </>
  );
}

export default function PanelPage() {
  return (
    <Suspense fallback={null}>
      <PanelPageInner />
    </Suspense>
  );
}
