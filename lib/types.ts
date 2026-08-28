export type ProductStatus = "lider" | "geride";

export type ToolIconKey =
  | "drill"
  | "grinder"
  | "jigsaw"
  | "toolset"
  | "screwdriver"
  | "pressure-washer"
  | "vacuum";

export type CategorySlug =
  | "taslama"
  | "dekupaj"
  | "delme-kirma"
  | "el-aletleri"
  | "temizlik-yikama";

export interface Seller {
  rank: number;
  name: string;
  price: number;
  isMine: boolean;
}

export interface PriceHistoryPoint {
  date: string; // ISO date
  myPrice: number;
  leaderPrice: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: CategorySlug;
  icon: ToolIconKey;
  myPrice: number;
  sellers: Seller[];
  myRank: number;
  status: ProductStatus;
  gapPct: number;
  gapAlert: boolean;
  critical: boolean;
  addedAt: string; // ISO date
  note?: string;
  history: PriceHistoryPoint[];
}

export type SortKey = "risk" | "gap" | "az" | "added_new" | "added_old";

export interface CategoryInfo {
  slug: CategorySlug;
  label: string;
  icon: ToolIconKey;
}

export type FilterKey = "all" | "geride" | "gap" | "critical" | "listede-yok" | "yildizli";

export interface FilterInfo {
  key: FilterKey;
  label: string;
  subtitle: string;
}

export interface StoreSession {
  storeName: string;
  storeUrl: string;
  createdAt: string;
}

export type AccentColorKey =
  | "indigo"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "teal"
  | "slate";

export interface NotifHistoryItem {
  id: string;
  type: "gap" | "not_listed" | "complete" | "critical" | "price_ok";
  title: string;
  description: string;
  createdAt: string;
}
