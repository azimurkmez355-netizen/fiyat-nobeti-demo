import type { AccentColorKey, ToolIconKey } from "./types";

export const ACCENT_COLORS: { key: AccentColorKey; label: string; gradient: string }[] = [
  { key: "indigo", label: "İndigo", gradient: "linear-gradient(135deg,#6E7BFF,#4F46E5)" },
  { key: "violet", label: "Mor", gradient: "linear-gradient(135deg,#A78BFA,#7C3AED)" },
  { key: "emerald", label: "Zümrüt", gradient: "linear-gradient(135deg,#34D399,#059669)" },
  { key: "amber", label: "Amber", gradient: "linear-gradient(135deg,#FBBF24,#D97706)" },
  { key: "rose", label: "Gül", gradient: "linear-gradient(135deg,#FB7185,#E11D48)" },
  { key: "sky", label: "Gökyüzü", gradient: "linear-gradient(135deg,#38BDF8,#0284C7)" },
  { key: "teal", label: "Turkuaz", gradient: "linear-gradient(135deg,#2DD4BF,#0D9488)" },
  { key: "slate", label: "Arduvaz", gradient: "linear-gradient(135deg,#94A3B8,#475569)" },
];

export function accentGradient(key: AccentColorKey): string {
  return ACCENT_COLORS.find((c) => c.key === key)?.gradient ?? ACCENT_COLORS[0].gradient;
}

export const ACCOUNT_ICONS: { key: ToolIconKey; label: string }[] = [
  { key: "drill", label: "Matkap" },
  { key: "grinder", label: "Taşlama Makinesi" },
  { key: "jigsaw", label: "Testere" },
  { key: "toolset", label: "Alet Çantası" },
  { key: "screwdriver", label: "Tornavida" },
  { key: "pressure-washer", label: "Yıkama Makinesi" },
  { key: "vacuum", label: "Süpürge" },
];
