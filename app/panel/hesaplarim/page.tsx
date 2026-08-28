"use client";

import { useState } from "react";
import { useMobileMenu } from "../layout";
import { useSession, useAccent } from "@/components/providers";
import { Topbar } from "@/components/topbar";
import { Modal, LockedModal, PillButton, DemoBadge } from "@/components/ui";
import { ToolIcon, PencilIcon, TrashIcon, EyeIcon, GripIcon, CheckIcon, PlusIcon } from "@/components/icons";
import { ACCENT_COLORS, ACCOUNT_ICONS, accentGradient } from "@/lib/accent-colors";
import { STATS } from "@/lib/demo-data";
import type { ToolIconKey } from "@/lib/types";

function EditAccountModal({
  open,
  onClose,
  storeName,
}: {
  open: boolean;
  onClose: () => void;
  storeName: string;
}) {
  const { accentColor, accentIcon, setAccentColor, setAccentIcon } = useAccent();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Hesabı Düzenle"
      footer={
        <PillButton variant="primary" onClick={onClose}>
          Kapat
        </PillButton>
      }
    >
      <div className="mb-5 flex items-center gap-3 rounded-[14px] p-3.5" style={{ background: "var(--alert-bg)" }}>
        <div className="min-w-0 text-[12px] leading-relaxed" style={{ color: "var(--alert-text)" }}>
          Hesap adı ve e-posta demoda kilitlidir — gerçek sürümde bu bilgiler serbestçe düzenlenebilir. İkon ve
          rengi yine de özelleştirebilirsiniz.
        </div>
      </div>

      <label className="mb-1.5 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
        Hesap adı
      </label>
      <input
        disabled
        value={storeName}
        className="mb-4 w-full cursor-not-allowed rounded-[14px] border px-4 py-3 text-[14px] opacity-60 outline-none"
        style={{ borderColor: "var(--border-strong)", background: "var(--surface-2)", color: "var(--text)" }}
      />

      <label className="mb-2 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
        Hesap ikonu
      </label>
      <div className="mb-5 grid grid-cols-7 gap-2">
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

      <label className="mb-2 block text-[12px] font-semibold" style={{ color: "var(--muted)" }}>
        İkon rengi
      </label>
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
    </Modal>
  );
}

function PanelPageHeader() {
  const onMobileMenu = useMobileMenu();
  return <Topbar title="Hesaplarım" subtitle="Akakçe hesaplarını ekle, ikon ver, tarama sırasını belirle" onMobileMenu={onMobileMenu} />;
}

export default function HesaplarimPage() {
  const { session } = useSession();
  const { accentColor, accentIcon } = useAccent();
  const [lockedOpen, setLockedOpen] = useState(false);
  const [lockedMsg, setLockedMsg] = useState("");
  const [editOpen, setEditOpen] = useState(false);

  function openLocked(msg: string) {
    setLockedMsg(msg);
    setLockedOpen(true);
  }

  return (
    <>
      <PanelPageHeader />
      <div className="flex-1 p-4 sm:p-6">
        <div
          className="relative mb-6 overflow-hidden rounded-[24px] p-6 text-white sm:p-8"
          style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
          data-tutorial="hesaplarim-lock"
        >
          <div className="absolute right-4 top-4">
            <DemoBadge />
          </div>
          <div className="mb-1 text-[12px] font-bold uppercase tracking-wider opacity-80">Akakçe Kontrol Merkezi</div>
          <h2 className="mb-2 max-w-md text-[22px] font-extrabold sm:text-[26px]">Hesabını yönet, tarama sırasını belirle</h2>
          <p className="mb-6 max-w-lg text-[13.5px] opacity-90">
            Gerçek sürümde istediğin kadar Akakçe hesabı ekleyip her birine isim, ikon ve tarama sırası
            verebilirsin. Bu demoda tek bir örnek hesap üzerinden nasıl çalıştığını görebilirsin.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => openLocked("Bu demoda yeni Akakçe hesabı eklenemez. Tam sürümde istediğiniz kadar hesap ekleyip ayrı ayrı takip edebilirsiniz.")}
              className="locked-surface flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold opacity-90"
              style={{ color: "var(--brand-2)" }}
            >
              <PlusIcon className="h-4 w-4" /> Hesap Ekle
            </button>
            <button
              onClick={() => openLocked("Bu demoda sıralı tarama başlatılamaz — ürünler zaten önceden taranmış olarak hazır.")}
              className="locked-surface rounded-full border border-white/50 px-4 py-2.5 text-[13px] font-semibold opacity-90"
            >
              Sıralı Taramayı Başlat
            </button>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Kayıtlı Hesap", value: "1" },
              { label: "Taramaya Dahil", value: "1" },
              { label: "Taranmış Ürün", value: String(STATS.total) },
            ].map((s) => (
              <div key={s.label} className="rounded-[16px] p-3.5" style={{ background: "rgba(255,255,255,0.14)" }}>
                <div className="text-[19px] font-extrabold">{s.value}</div>
                <div className="text-[11px] opacity-85">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[20px] border p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <div className="flex items-center gap-3">
            <span className="cursor-not-allowed opacity-40" style={{ color: "var(--muted)" }}>
              <GripIcon className="h-4 w-4" />
            </span>
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: "var(--surface-2)", color: "var(--muted)" }}
            >
              1
            </span>
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] text-white"
              style={{ background: accentGradient(accentColor) }}
            >
              <ToolIcon icon={accentIcon as ToolIconKey} className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-bold" style={{ color: "var(--text)" }}>
                {session?.storeName}
              </div>
              <div className="truncate text-[12px]" style={{ color: "var(--muted)" }}>
                {STATS.total} ürün taranmış ·{" "}
                <span className="font-semibold" style={{ color: "var(--lead)" }}>
                  Tamamlandı
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
                <div className="h-full w-full rounded-full" style={{ background: "var(--lead)" }} />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <div className="relative h-6 w-11 rounded-full" style={{ background: "var(--brand-1)" }} title="Sıralı taramaya dahil">
                <span className="absolute top-0.5 h-5 w-5 translate-x-[22px] rounded-full bg-white shadow" />
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-2)]"
                style={{ color: "var(--muted)" }}
                title="Bu hesabın ürünlerini göster"
              >
                <EyeIcon className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => setEditOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--surface-2)]"
                style={{ color: "var(--muted)" }}
                title="Düzenle"
              >
                <PencilIcon className="h-[18px] w-[18px]" />
              </button>
              <button
                onClick={() => openLocked("Demo hesabı silinemez — bu, demoyu tamamen kullanılamaz hale getirir. Çıkış yapıp tekrar girerek demoyu istediğin an sıfırlayabilirsin.")}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
                style={{ color: "var(--muted)" }}
                title="Hesabı sil"
              >
                <TrashIcon className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditAccountModal open={editOpen} onClose={() => setEditOpen(false)} storeName={session?.storeName ?? ""} />
      <LockedModal open={lockedOpen} onClose={() => setLockedOpen(false)} title="Bu demoda kilitli" description={lockedMsg} />
    </>
  );
}
