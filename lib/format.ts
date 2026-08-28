export function fmtPrice(value: number): string {
  return (
    value.toLocaleString("tr-TR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " TL"
  );
}

export function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

export function fmtDateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export function statusLabel(status: "lider" | "geride", rank: number): string {
  if (status === "lider") return "Lider";
  return `${rank}. sıra`;
}

export function slugifyStoreUrl(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
  return cleaned || "magazaniz.com";
}
