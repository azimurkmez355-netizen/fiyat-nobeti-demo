"use client";

import { useToast } from "./providers";
import { ScissorsIcon, AlertIcon, CheckIcon } from "./icons";
import type { NotifHistoryItem } from "@/lib/types";

function typeMeta(type: NotifHistoryItem["type"]) {
  switch (type) {
    case "gap":
      return { Icon: ScissorsIcon, bg: "linear-gradient(135deg,#FFC15E,var(--alert))", duration: 6000 };
    case "not_listed":
      return { Icon: AlertIcon, bg: "linear-gradient(135deg,#FF8098,var(--danger))", duration: 6000 };
    case "critical":
      return { Icon: AlertIcon, bg: "linear-gradient(135deg,#FF5FA8,var(--critical))", duration: 8000 };
    default:
      return { Icon: CheckIcon, bg: "linear-gradient(135deg,#3CE29B,var(--lead))", duration: 4200 };
  }
}

export function ToastStack() {
  const { toasts, dismissToast } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[1800] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => {
        const { Icon, bg, duration } = typeMeta(toast.type);
        return (
          <div
            key={toast.id}
            className="toast-in pointer-events-auto relative flex w-full max-w-[380px] items-start gap-3 overflow-hidden rounded-[18px] border p-3.5"
            style={{ background: "var(--bg-translucent)", backdropFilter: "blur(14px)", borderColor: "var(--border)", boxShadow: "var(--shadow-2)" }}
          >
            <span
              className={toast.type === "critical" ? "critical-pulse flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-white" : "flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] text-white"}
              style={{ background: bg }}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="truncate text-[13px] font-bold" style={{ color: "var(--text)" }}>
                {toast.title}
              </div>
              <div className="truncate text-[12px]" style={{ color: "var(--muted)" }}>
                {toast.description}
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 text-[16px] leading-none"
              style={{ color: "var(--muted-2)" }}
              aria-label="Kapat"
            >
              ×
            </button>
            <div
              className="absolute bottom-0 left-0 h-[3px]"
              style={{
                background: bg,
                animation: `toastShrink ${duration}ms linear forwards`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
