"use client";

import { useState } from "react";
import { Modal, LockedModal, PillButton } from "./ui";
import { LockIcon, PlusIcon, XIcon } from "./icons";
import { slugifyStoreUrl } from "@/lib/format";

export function IdeasoftModal({
  open,
  onClose,
  storeUrl,
}: {
  open: boolean;
  onClose: () => void;
  storeUrl: string;
}) {
  const [lockedOpen, setLockedOpen] = useState(false);
  const domain = `${slugifyStoreUrl(storeUrl).replace(/\.(com|com\.tr|net|org).*$/, "")}.myideasoft.com`;

  return (
    <>
      <Modal open={open} onClose={onClose} title="IdeaSoft'a Bağlan" maxWidth={520}>
        <div className="mb-4">
          <div className="mb-2 text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
            Bağlı mağazalar
          </div>
          <div
            className="flex items-center gap-3 rounded-[14px] border px-3.5 py-3"
            style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: "var(--lead)" }} />
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium" style={{ color: "var(--text)" }}>
              {domain}
            </span>
            <button
              onClick={() => setLockedOpen(true)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
              style={{ color: "var(--muted)" }}
              aria-label="Kaldır"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setLockedOpen(true)}
          className="locked-surface flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed py-3 text-[13px] font-semibold opacity-70"
          style={{ borderColor: "var(--border-strong)", color: "var(--muted)" }}
        >
          <PlusIcon className="h-4 w-4" /> Mağaza Ekle
        </button>

        <div
          className="mt-4 flex items-start gap-2.5 rounded-[14px] p-3.5 text-[12px] leading-relaxed"
          style={{ background: "var(--brand-bg)", color: "var(--brand-3)" }}
        >
          <LockIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Bu herkese açık demoda IdeaSoft bağlantısı ve &quot;Fiyat Gönder&quot; işlemleri kilitlidir. Gerçek
            sürümde önerilen fiyat, Euro&apos;ya çevrilip yukarıda bağlı tüm mağazalara tek tıkla gönderilir.
          </span>
        </div>
      </Modal>

      <LockedModal
        open={lockedOpen}
        onClose={() => setLockedOpen(false)}
        title="Bu demoda kilitli"
        description="Herkese açık demo sürümünde IdeaSoft bağlantıları değiştirilemez veya kaldırılamaz. Kendi mağazanızla gerçek bağlantıyı tam sürümde kurabilirsiniz."
      />
    </>
  );
}

export function NoteModal({
  open,
  onClose,
  productName,
  initialNote,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [value, setValue] = useState(initialNote);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Not Ekle"
      footer={
        <>
          <PillButton variant="ghost" onClick={onClose}>
            Vazgeç
          </PillButton>
          <PillButton
            variant="primary"
            onClick={() => {
              onSave(value);
              onClose();
            }}
          >
            Kaydet
          </PillButton>
        </>
      }
    >
      <div className="mb-3 truncate text-[13px] font-semibold" style={{ color: "var(--text)" }}>
        {productName}
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        placeholder="Bu ürünle ilgili kendine not bırak..."
        className="w-full resize-none rounded-[14px] border px-4 py-3 text-[13.5px] outline-none"
        style={{ borderColor: "var(--border-strong)", background: "var(--surface)", color: "var(--text)" }}
      />
    </Modal>
  );
}
