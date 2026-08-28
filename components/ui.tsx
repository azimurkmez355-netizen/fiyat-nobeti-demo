"use client";

import { useEffect, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { XIcon, LockIcon } from "./icons";

// ============================== Modal shell ==============================

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidth = 520,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="modal-scrim fixed inset-0 z-[1200] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="wg-card-in flex max-h-[86vh] w-full flex-col overflow-hidden rounded-[24px] border"
        style={{
          maxWidth,
          background: "var(--surface)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-2)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-6 py-4"
          style={{ borderColor: "var(--border)" }}
        >
          <h3 className="text-[17px] font-semibold" style={{ color: "var(--text)" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            style={{ color: "var(--muted)" }}
            aria-label="Kapat"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="no-scrollbar overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div
            className="flex items-center justify-end gap-3 border-t px-6 py-4"
            style={{ borderColor: "var(--border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================== Icon / confirm dialog ==============================

export function IconDialog({
  open,
  onClose,
  icon,
  tone = "brand",
  title,
  body,
  primaryLabel = "Onayla",
  onPrimary,
  secondaryLabel = "Vazgeç",
  onSecondary,
  hideSecondary = false,
}: {
  open: boolean;
  onClose: () => void;
  icon?: ReactNode;
  tone?: "brand" | "danger" | "lock";
  title: string;
  body: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  hideSecondary?: boolean;
}) {
  if (!open) return null;

  const gradient =
    tone === "danger"
      ? "linear-gradient(135deg,#FF8A9B,var(--danger))"
      : tone === "lock"
      ? "linear-gradient(135deg,#FFC15E,var(--alert))"
      : "linear-gradient(135deg,var(--brand-1),var(--brand-2))";

  return (
    <div
      className="modal-scrim fixed inset-0 z-[1200] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="wg-card-in w-full max-w-[440px] rounded-[24px] border p-7 text-center"
        style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "var(--shadow-2)" }}
      >
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] text-white"
          style={{ background: gradient }}
        >
          {icon ?? <LockIcon className="h-7 w-7" />}
        </div>
        <h3 className="mb-2 text-[18px] font-bold" style={{ color: "var(--text)" }}>
          {title}
        </h3>
        <div className="mb-6 text-left text-[14px] leading-relaxed" style={{ color: "var(--muted)" }}>
          {body}
        </div>
        <div className="flex gap-3">
          {!hideSecondary && (
            <button
              onClick={onSecondary ?? onClose}
              className="flex-1 rounded-[14px] border py-3 text-[14px] font-semibold transition-colors hover:bg-[var(--surface-2)]"
              style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
            >
              {secondaryLabel}
            </button>
          )}
          <button
            onClick={onPrimary ?? onClose}
            className="flex-1 rounded-[14px] py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: gradient }}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================== Locked feature modal ==============================

export function LockedModal({
  open,
  onClose,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}) {
  return (
    <IconDialog
      open={open}
      onClose={onClose}
      tone="lock"
      icon={<LockIcon className="h-7 w-7" />}
      title={title}
      body={description}
      primaryLabel="Anladım"
      onPrimary={onClose}
      hideSecondary
    />
  );
}

// ============================== Badges ==============================

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-white uppercase",
        className
      )}
      style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
    >
      Demo
    </span>
  );
}

export function LockedChip({ label = "Kilitli" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: "var(--alert-bg)", color: "var(--alert-text)", border: "1px solid var(--alert-border)" }}
    >
      <LockIcon className="h-3 w-3" />
      {label}
    </span>
  );
}

export function StatusBadge({ status, rank }: { status: "lider" | "geride"; rank: number }) {
  const isLider = status === "lider";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
      style={{
        background: isLider ? "var(--lead-bg)" : "var(--info-bg)",
        color: isLider ? "var(--lead)" : "var(--info)",
        border: `1px solid ${isLider ? "var(--lead-border)" : "var(--info-border)"}`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: isLider ? "var(--lead)" : "var(--info)" }}
      />
      {isLider ? "Lider" : `${rank}. sıra`}
    </span>
  );
}

// ============================== Toggle switch ==============================

export function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cx(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        disabled && "cursor-not-allowed opacity-50"
      )}
      style={{ background: checked ? "var(--brand-1)" : "var(--border-strong)" }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

// ============================== Buttons ==============================

export function PillButton({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "surface";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const base = "inline-flex items-center justify-center gap-2 rounded-[14px] px-4 py-2.5 text-[13.5px] font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50";
  if (variant === "primary") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cx(base, "text-white hover:opacity-90", className)}
        style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
      >
        {children}
      </button>
    );
  }
  if (variant === "danger") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cx(base, "text-white hover:opacity-90", className)}
        style={{ background: "linear-gradient(135deg,#FF8A9B,var(--danger))" }}
      >
        {children}
      </button>
    );
  }
  if (variant === "surface") {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cx(base, "border hover:bg-[var(--surface-2)]", className)}
        style={{ borderColor: "var(--border-strong)", color: "var(--text)", background: "var(--surface)" }}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, "hover:bg-[var(--surface-2)]", className)}
      style={{ color: "var(--muted)" }}
    >
      {children}
    </button>
  );
}
