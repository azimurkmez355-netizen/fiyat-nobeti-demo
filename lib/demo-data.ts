import type {
  CategoryInfo,
  CategorySlug,
  FilterInfo,
  Product,
  PriceHistoryPoint,
  Seller,
} from "./types";

export const CATEGORIES: CategoryInfo[] = [
  { slug: "taslama", label: "Taşlama Makineleri", icon: "grinder" },
  { slug: "dekupaj", label: "Dekupaj Testereler", icon: "jigsaw" },
  { slug: "delme-kirma", label: "Delme & Kırma", icon: "drill" },
  { slug: "el-aletleri", label: "El Aletleri & Set", icon: "toolset" },
  { slug: "temizlik-yikama", label: "Temizlik & Yıkama", icon: "vacuum" },
];

export const FILTERS: FilterInfo[] = [
  { key: "all", label: "Anasayfa", subtitle: "Taranan tüm ürünler" },
  { key: "geride", label: "Lider Değilim", subtitle: "1. sırada olmadığınız ürünler" },
  { key: "gap", label: "Makas Açık", subtitle: "Kendi konumunuza göre fiyat farkı eşiği aşan ürünler" },
  { key: "critical", label: "Kritik Ürünler", subtitle: "Fiyat skalasında kırılma tespit edilen ürünler" },
  { key: "listede-yok", label: "Liste Dışı", subtitle: "Fiyat listesinde bulunamayan ürünler" },
  { key: "yildizli", label: "Yıldızlı Ürünler", subtitle: "İşaretlediğiniz öncelikli ürünler" },
];

export const GAP_ALERT_PERCENT = 2.0;

export const MINE_SENTINEL = "__MINE__";

const NAME_POOL = [
  "TeknoMarket", "UstaShop", "YapıDepo", "MegaHırdavat", "ProAlet",
  "ElektroMarkt", "Bir Numara Teknik", "Doğru Fiyat", "Şehir Hırdavat",
  "Kampanya Nokta", "Hızlı Teknik", "Usta Elektronik", "Fiyat Uzmanı",
  "Malzeme Merkezi", "Anadolu Teknik",
];

interface RawSeller {
  name: string; // NAME_POOL entry, or MINE_SENTINEL for the store's own row
  price: number;
}

interface RawProduct {
  id: string;
  name: string;
  sku: string;
  category: CategorySlug;
  icon: Product["icon"];
  addedDaysAgo: number;
  sellers: RawSeller[]; // already ordered rank 1..N (cheapest first)
  critical: boolean;
}

function mine(price: number): RawSeller {
  return { name: MINE_SENTINEL, price };
}
function s(name: string, price: number): RawSeller {
  return { name, price };
}

const RAW_PRODUCTS: RawProduct[] = [
  {
    id: "gbh-2-26-dre",
    name: "Bosch GBH 2-26 DRE 800 W Pnömatik Kırıcı-Delici",
    sku: "GBH2-26DRE",
    category: "delme-kirma",
    icon: "drill",
    addedDaysAgo: 34,
    critical: false,
    sellers: [mine(6079), s("TeknoMarket", 6155), s("UstaShop", 6220), s("YapıDepo", 6310), s("MegaHırdavat", 6395)],
  },
  {
    id: "gsb-185-li",
    name: "Bosch GSB 185 Li Darbeli Matkap",
    sku: "GSB185LI",
    category: "delme-kirma",
    icon: "drill",
    addedDaysAgo: 12,
    critical: false,
    sellers: [s("ProAlet", 3294), s("ElektroMarkt", 3325), mine(3359), s("Bir Numara Teknik", 3399), s("Doğru Fiyat", 3449)],
  },
  {
    id: "adv-1600a02by7",
    name: "Bosch Advanced 1600A02BY7 52 Parça El Aletleri Seti",
    sku: "1600A02BY7",
    category: "el-aletleri",
    icon: "toolset",
    addedDaysAgo: 27,
    critical: false,
    sellers: [s("Şehir Hırdavat", 4099), mine(4165), s("Kampanya Nokta", 4239), s("Hızlı Teknik", 4319)],
  },
  {
    id: "2607019504",
    name: "Bosch 2607019504 46 Parça Cırcırlı Tornavida Seti",
    sku: "2607019504",
    category: "el-aletleri",
    icon: "screwdriver",
    addedDaysAgo: 6,
    critical: true,
    sellers: [
      s("Usta Elektronik", 549), s("Fiyat Uzmanı", 566), s("Malzeme Merkezi", 581),
      mine(599), s("Anadolu Teknik", 615), s("TeknoMarket", 631),
    ],
  },
  {
    id: "easyaquatak-120",
    name: "Bosch EasyAquatak 120 1500 W Basınçlı Yıkama Makinesi",
    sku: "EASYAQUATAK120",
    category: "temizlik-yikama",
    icon: "pressure-washer",
    addedDaysAgo: 41,
    critical: false,
    sellers: [
      s("UstaShop", 3956), s("YapıDepo", 4015), s("MegaHırdavat", 4078), s("ProAlet", 4140),
      s("ElektroMarkt", 4205), mine(4275), s("Bir Numara Teknik", 4340),
    ],
  },
  {
    id: "universalaquatak-135",
    name: "Bosch UniversalAquatak 135 1900 W Basınçlı Yıkama Makinesi",
    sku: "UNIVAQUATAK135",
    category: "temizlik-yikama",
    icon: "pressure-washer",
    addedDaysAgo: 19,
    critical: false,
    sellers: [mine(6949), s("Doğru Fiyat", 7020), s("Şehir Hırdavat", 7110), s("Kampanya Nokta", 7210)],
  },
  {
    id: "bbs711tr",
    name: "Bosch Unlimited 7 BBS711TR Şarjlı Dikey Süpürge",
    sku: "BBS711TR",
    category: "temizlik-yikama",
    icon: "vacuum",
    addedDaysAgo: 9,
    critical: false,
    sellers: [s("Hızlı Teknik", 11950.8), mine(12120), s("Usta Elektronik", 12320), s("Fiyat Uzmanı", 12520)],
  },
  {
    id: "gws-750-115",
    name: "Bosch GWS 750-115 750 W Avuç Taşlama",
    sku: "GWS750-115",
    category: "taslama",
    icon: "grinder",
    addedDaysAgo: 24,
    critical: false,
    sellers: [
      s("Malzeme Merkezi", 2444.2), s("Anadolu Teknik", 2478), s("TeknoMarket", 2511), s("UstaShop", 2545),
      s("YapıDepo", 2579), s("MegaHırdavat", 2613), mine(2655), s("ProAlet", 2699),
    ],
  },
  {
    id: "gws-9-115",
    name: "Bosch GWS 9-115 900 W Avuç Taşlama Makinesi",
    sku: "GWS9-115",
    category: "taslama",
    icon: "grinder",
    addedDaysAgo: 3,
    critical: false,
    sellers: [mine(3333), s("ElektroMarkt", 3382), s("Bir Numara Teknik", 3429)],
  },
  {
    id: "gws-2200-180h",
    name: "Bosch GWS 2200-180 H 2200 W Büyük Taşlama Makinesi",
    sku: "GWS2200-180H",
    category: "taslama",
    icon: "grinder",
    addedDaysAgo: 30,
    critical: false,
    sellers: [s("Doğru Fiyat", 4999.5), mine(5079), s("Şehir Hırdavat", 5169), s("Kampanya Nokta", 5259)],
  },
  {
    id: "gws-18v-8",
    name: "Bosch GWS 18V-8 Taşlama Makinesi",
    sku: "GWS18V-8",
    category: "taslama",
    icon: "grinder",
    addedDaysAgo: 15,
    critical: false,
    sellers: [
      s("Hızlı Teknik", 5300), s("Usta Elektronik", 5369), mine(5385),
      s("Fiyat Uzmanı", 5459), s("Malzeme Merkezi", 5539),
    ],
  },
  {
    id: "gws-7-115",
    name: "Bosch GWS 7-115 720 W Avuç Taşlama Makinesi",
    sku: "GWS7-115",
    category: "taslama",
    icon: "grinder",
    addedDaysAgo: 21,
    critical: false,
    sellers: [
      s("Anadolu Teknik", 2744.5), s("TeknoMarket", 2778), s("UstaShop", 2811), s("YapıDepo", 2845),
      s("MegaHırdavat", 2879), s("ProAlet", 2913), s("ElektroMarkt", 2947), mine(2989),
    ],
  },
  {
    id: "gst-8000e",
    name: "Bosch GST 8000 E 710 W Dekupaj Testere",
    sku: "GST8000E",
    category: "dekupaj",
    icon: "jigsaw",
    addedDaysAgo: 38,
    critical: false,
    sellers: [mine(4430), s("Bir Numara Teknik", 4495), s("Doğru Fiyat", 4560)],
  },
  {
    id: "pst-650",
    name: "Bosch PST 650 500 W Dekupaj Testere",
    sku: "PST650",
    category: "dekupaj",
    icon: "jigsaw",
    addedDaysAgo: 8,
    critical: false,
    sellers: [s("Şehir Hırdavat", 2544.85), mine(2584), s("Kampanya Nokta", 2624), s("Hızlı Teknik", 2664)],
  },
  {
    id: "gst-185-li",
    name: "Bosch GST 185-Li Aküsüz Dekupaj Testere",
    sku: "GST185LI",
    category: "dekupaj",
    icon: "jigsaw",
    addedDaysAgo: 17,
    critical: false,
    sellers: [
      s("Usta Elektronik", 9240), s("Fiyat Uzmanı", 9340), s("Malzeme Merkezi", 9440),
      mine(9550), s("Anadolu Teknik", 9650), s("TeknoMarket", 9750),
    ],
  },
];

// Fixed display shuffle so ranks/categories interleave (not grouped by rank or list order),
// but stays stable across reloads.
export const DISPLAY_ORDER = [
  "gws-9-115", "2607019504", "gst-185-li", "gbh-2-26-dre", "gws-750-115",
  "pst-650", "universalaquatak-135", "gws-2200-180h", "easyaquatak-120", "adv-1600a02by7",
  "gws-7-115", "gsb-185-li", "gst-8000e", "gws-18v-8", "bbs711tr",
];

export const DEFAULT_STARRED_IDS = ["gbh-2-26-dre", "gws-9-115", "2607019504"];

// Deterministic pseudo-random (mulberry32) so the sparkline is stable across renders/builds.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

function buildHistory(id: string, myPrice: number, leaderPrice: number): PriceHistoryPoint[] {
  const rand = mulberry32(seedFromId(id));
  const points = 9;
  const history: PriceHistoryPoint[] = [];
  const today = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const daysAgo = i * 4;
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const drift = (rand() - 0.5) * 0.05; // +-2.5%
    const decay = i / (points - 1); // 1 -> 0 as we approach today
    const myWalk = myPrice * (1 - drift * decay);
    const leaderWalk = leaderPrice * (1 - (rand() - 0.5) * 0.05 * decay);
    history.push({
      date: date.toISOString().slice(0, 10),
      myPrice: i === 0 ? myPrice : Math.round(myWalk * 100) / 100,
      leaderPrice: i === 0 ? leaderPrice : Math.round(leaderWalk * 100) / 100,
    });
  }
  return history;
}

function build(raw: RawProduct): Product {
  const sellers: Seller[] = raw.sellers.map((rs, idx) => ({
    rank: idx + 1,
    name: rs.name,
    price: rs.price,
    isMine: rs.name === MINE_SENTINEL,
  }));
  const mineIdx = sellers.findIndex((x) => x.isMine);
  const myRank = mineIdx + 1;
  const myPrice = sellers[mineIdx].price;
  const leaderPrice = sellers[0].price;
  const status: Product["status"] = myRank === 1 ? "lider" : "geride";

  let gapPct: number;
  if (myRank === 1) {
    const next = sellers[1];
    gapPct = next ? ((next.price - myPrice) / myPrice) * 100 : 0;
  } else {
    gapPct = ((myPrice - leaderPrice) / leaderPrice) * 100;
  }
  const gapAlert = gapPct > GAP_ALERT_PERCENT;

  const addedAt = new Date();
  addedAt.setDate(addedAt.getDate() - raw.addedDaysAgo);

  return {
    id: raw.id,
    name: raw.name,
    sku: raw.sku,
    category: raw.category,
    icon: raw.icon,
    myPrice,
    sellers,
    myRank,
    status,
    gapPct: Math.round(gapPct * 100) / 100,
    gapAlert,
    critical: raw.critical,
    addedAt: addedAt.toISOString(),
    history: buildHistory(raw.id, myPrice, leaderPrice),
  };
}

export const PRODUCTS: Product[] = RAW_PRODUCTS.map(build);

export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p])
);

export function getProductsInDisplayOrder(): Product[] {
  return DISPLAY_ORDER.map((id) => PRODUCTS_BY_ID[id]).filter(Boolean);
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return getProductsInDisplayOrder().filter((p) => p.category === slug);
}

export const STATS = {
  total: PRODUCTS.length,
  lider: PRODUCTS.filter((p) => p.status === "lider").length,
  geride: PRODUCTS.filter((p) => p.status === "geride").length,
  gapAlert: PRODUCTS.filter((p) => p.gapAlert).length,
  critical: PRODUCTS.filter((p) => p.critical).length,
  listedeYok: 0,
};

export { NAME_POOL };

export function computeSuggestion(product: Product): number | null {
  const isLeader = product.myRank === 1;
  const threat = isLeader ? product.sellers[1]?.price : product.sellers[0]?.price;
  if (!threat) return null;
  return Math.round(threat * 0.985 * 100) / 100;
}

export type DiffKind = "up" | "down" | "none" | "new" | "critical";

export function computeDiff(product: Product): { kind: DiffKind; delta: number } {
  if (product.critical) return { kind: "critical", delta: 0 };
  const h = product.history;
  if (h.length < 2) return { kind: "new", delta: 0 };
  const prev = h[h.length - 2].myPrice;
  const curr = h[h.length - 1].myPrice;
  const delta = Math.round((curr - prev) * 100) / 100;
  if (Math.abs(delta) < 0.01) return { kind: "none", delta: 0 };
  return { kind: delta > 0 ? "up" : "down", delta };
}
