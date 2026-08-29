"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/providers";
import { GemLogo, ArrowRightIcon, ShieldIcon } from "@/components/icons";
import { DemoBadge } from "@/components/ui";

export default function LoginPage() {
  const { session, ready, login } = useSession();
  const router = useRouter();
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ready && session) router.replace("/panel");
  }, [ready, session, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!storeName.trim() || !storeUrl.trim()) {
      setError("Mağaza adı ve mağaza web adresi zorunludur.");
      return;
    }
    setError("");
    setSubmitting(true);
    login(storeName, storeUrl);
    setTimeout(() => router.push("/panel"), 350);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="wg-blob h-[420px] w-[420px]" style={{ top: "-8%", left: "-6%", background: "rgba(79,107,255,0.55)", animation: "wgFloat1 22s ease-in-out infinite" }} />
      <div className="wg-blob h-[380px] w-[380px]" style={{ top: "8%", right: "-8%", background: "rgba(139,92,246,0.5)", animation: "wgFloat2 26s ease-in-out infinite" }} />
      <div className="wg-blob h-[340px] w-[340px]" style={{ bottom: "-6%", left: "10%", background: "rgba(18,184,114,0.3)", animation: "wgFloat3 20s ease-in-out infinite" }} />
      <div className="wg-blob h-[320px] w-[320px]" style={{ bottom: "-8%", right: "8%", background: "rgba(255,111,174,0.28)", animation: "wgFloat4 24s ease-in-out infinite" }} />

      <div className="absolute right-5 top-5 z-10">
        <DemoBadge />
      </div>

      <div
        className="wg-card-in relative z-10 w-full max-w-[520px] rounded-[32px] border px-8 py-11 sm:px-11"
        style={{
          background: "rgba(255,255,255,0.86)",
          backdropFilter: "blur(26px) saturate(180%)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-2)",
        }}
      >
        <div
          className="wg-pulse mx-auto mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-[22px] text-white"
          style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
        >
          <GemLogo className="h-9 w-9" />
        </div>

        <div className="mb-4 flex justify-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold"
            style={{ background: "var(--brand-bg)", color: "var(--brand-3)" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--lead)" }} />
            Fiyat Nöbeti
          </span>
        </div>

        <h1 className="brand-gradient-text mb-2.5 text-center text-[30px] font-extrabold sm:text-[34px]">
          Hoş geldiniz
        </h1>
        <p className="mx-auto mb-8 max-w-[380px] text-center text-[13.5px] leading-relaxed" style={{ color: "var(--muted)" }}>
          Akakçe favori listelerinizi arka planda tarayan, sıralamanız değiştiğinde sizi anında uyaran fiyat takip
          merkezinin demo sürümüne hoş geldiniz.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: "var(--text)" }}>
              Mağaza Adı
            </label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="ör. Usta Pazar Hırdavat"
              className="w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none transition-colors focus:border-[var(--brand-1)]"
              style={{ borderColor: "var(--border-strong)", background: "var(--surface)", color: "var(--text)" }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12.5px] font-semibold" style={{ color: "var(--text)" }}>
              Mağaza Web Adresi
            </label>
            <input
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              placeholder="ör. magazaniz.com"
              className="w-full rounded-[14px] border px-4 py-3 text-[14px] outline-none transition-colors focus:border-[var(--brand-1)]"
              style={{ borderColor: "var(--border-strong)", background: "var(--surface)", color: "var(--text)" }}
            />
          </div>

          {error && (
            <div className="rounded-[12px] px-3.5 py-2.5 text-[12.5px] font-medium" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="wg-shine relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-[16px] py-4 text-[15px] font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-70"
            style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))", boxShadow: "var(--shadow-2)" }}
          >
            {submitting ? "Açılıyor..." : "Başla"}
            {!submitting && <ArrowRightIcon className="h-4 w-4" />}
          </button>
        </form>

        <div className="mt-7 flex items-center justify-center gap-2 text-[11.5px]" style={{ color: "var(--muted-2)" }}>
          <ShieldIcon className="h-3.5 w-3.5" />
          Bilgileriniz yalnızca bu tarayıcıda saklanır — hiçbir sunucuya gönderilmez.
        </div>
      </div>
    </div>
  );
}
