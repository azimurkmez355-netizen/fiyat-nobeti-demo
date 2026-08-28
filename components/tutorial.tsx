"use client";

import { useEffect, useState } from "react";
import { useTutorial } from "./providers";
import { GraduationCapIcon, ArrowRightIcon, XIcon } from "./icons";

export function TutorialOfferModal() {
  const { isOfferOpen, startTour, declineOffer } = useTutorial();
  if (!isOfferOpen) return null;
  return (
    <div className="modal-scrim fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div
        className="wg-card-in w-full max-w-[460px] rounded-[24px] border p-8 text-center"
        style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-2)" }}
      >
        <div
          className="wg-pulse mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] text-white"
          style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
        >
          <GraduationCapIcon className="h-7 w-7" />
        </div>
        <h3 className="mb-2 text-[19px] font-bold" style={{ color: "var(--text)" }}>
          Uygulama eğitimine girmek ister misiniz?
        </h3>
        <p className="mb-7 text-[14px] leading-relaxed" style={{ color: "var(--muted)" }}>
          Fiyat Nöbeti&apos;nin tüm özelliklerini birlikte, adım adım keşfedelim — sadece 2 dakika sürer.
          Panelde neyin nerede olduğunu görmenin en hızlı yolu.
        </p>
        <button
          onClick={startTour}
          className="wg-shine relative mb-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[16px] py-4 text-[15px] font-bold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))", boxShadow: "var(--shadow-2)" }}
        >
          Eğitime Başla
          <ArrowRightIcon className="h-4 w-4" />
        </button>
        <button
          onClick={declineOffer}
          className="text-[13px] font-medium underline-offset-2 hover:underline"
          style={{ color: "var(--muted)" }}
        >
          Eğitimden Çık
        </button>
      </div>
    </div>
  );
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function SpotlightOverlay() {
  const { isRunning, currentStep, stepIndex, totalSteps, next, prev, exitTour } = useTutorial();
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (!isRunning || !currentStep) {
      setRect(null);
      return;
    }
    let cancelled = false;
    let attempts = 0;

    function centerFallback(): Rect {
      return { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 };
    }

    function measure() {
      if (cancelled) return;
      const targetId = currentStep!.targetId;
      if (!targetId) {
        setRect(centerFallback());
        return;
      }
      const el = document.querySelector(`[data-tutorial="${targetId}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setTimeout(() => {
          if (cancelled) return;
          const r2 = el.getBoundingClientRect();
          setRect({ top: r2.top, left: r2.left, width: r2.width, height: r2.height });
        }, 380);
      } else if (attempts < 25) {
        attempts++;
        requestAnimationFrame(measure);
      } else {
        setRect(centerFallback());
      }
    }
    measure();

    const onReflow = () => {
      if (!currentStep!.targetId) return setRect(centerFallback());
      const el = document.querySelector(`[data-tutorial="${currentStep!.targetId}"]`);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [isRunning, currentStep]);

  if (!isRunning || !currentStep || !rect) return null;

  const hasTarget = !!currentStep.targetId;
  const pad = 6;
  const ringStyle: React.CSSProperties = hasTarget
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : { top: rect.top, left: rect.left, width: 0, height: 0 };

  const calloutWidth = 360;
  let calloutStyle: React.CSSProperties;
  if (!hasTarget) {
    calloutStyle = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: calloutWidth };
  } else {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const margin = 18;
    const estHeight = 220;
    let top = ringStyle.top !== undefined ? (ringStyle.top as number) + (ringStyle.height as number) + margin : 100;
    if (top + estHeight > vh) {
      top = (ringStyle.top as number) - margin - estHeight;
    }
    top = Math.max(10, Math.min(top, vh - estHeight - 10));
    let left = (ringStyle.left as number) + (ringStyle.width as number) / 2 - calloutWidth / 2;
    left = Math.max(12, Math.min(left, vw - calloutWidth - 12));
    calloutStyle = { position: "fixed", top, left, width: calloutWidth };
  }

  return (
    <>
      <div
        className="fixed inset-0 z-[1900]"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
      <div
        className="spotlight-ring pointer-events-none fixed z-[1901] rounded-2xl border-2"
        style={{
          ...ringStyle,
          borderColor: "var(--brand-1)",
          transition: "top .32s cubic-bezier(.16,.84,.44,1), left .32s cubic-bezier(.16,.84,.44,1), width .32s cubic-bezier(.16,.84,.44,1), height .32s cubic-bezier(.16,.84,.44,1)",
        }}
      />
      <div
        className="z-[1950] rounded-[20px] border p-5"
        style={{ ...calloutStyle, background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-2)" }}
      >
        <div className="mb-2.5 flex items-center justify-between">
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{ background: "var(--brand-bg)", color: "var(--brand-3)" }}
          >
            {stepIndex + 1} / {totalSteps}
          </span>
        </div>
        <h4 className="mb-1.5 text-[15px] font-bold" style={{ color: "var(--text)" }}>
          {currentStep.title}
        </h4>
        <p className="mb-4 text-[13px] leading-relaxed" style={{ color: "var(--muted)" }}>
          {currentStep.body}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={stepIndex === 0}
            className="rounded-[12px] border px-3.5 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-40"
            style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
          >
            Geri
          </button>
          <button
            onClick={next}
            className="flex-1 rounded-[12px] py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
          >
            {stepIndex + 1 >= totalSteps ? "Bitir" : "İleri"}
          </button>
        </div>
      </div>
      <button
        onClick={exitTour}
        className="fixed right-5 top-5 z-[2000] flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold backdrop-blur transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
        style={{ background: "var(--surface)", borderColor: "var(--border-strong)", color: "var(--text)", boxShadow: "var(--shadow-1)" }}
      >
        <XIcon className="h-3.5 w-3.5" />
        Eğitimden Çık
      </button>
    </>
  );
}
