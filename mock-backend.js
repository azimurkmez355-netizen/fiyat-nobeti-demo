/*
 * Fiyat Nöbeti — web demo mock backend.
 *
 * The rest of this app is the ORIGINAL desktop app's frontend (index.html),
 * copied unmodified. That file normally talks to a local Python/FastAPI
 * server (main.py) over fetch("/api/...") and a WebSocket ("/ws") for a
 * real Akakçe scraper + IdeaSoft/Telegram integration.
 *
 * This script stands in for that server entirely inside the browser: it
 * patches window.fetch and window.WebSocket before the app's own script
 * runs, keeps state in localStorage/memory, and answers every endpoint the
 * frontend calls with realistic sample data. No network requests to
 * Akakçe/IdeaSoft/Telegram are ever made — everything here is simulated.
 */
(function () {
  "use strict";

  // ---------------------------------------------------------------------
  // Storage helpers
  // ---------------------------------------------------------------------
  const LS_SETTINGS = "fn_mock_settings";
  const LS_ACCOUNTS = "fn_mock_accounts";
  const LS_SCRAPER_SITES = "fn_mock_scraper_sites";
  const LS_NOTES = "fn_mock_product_notes";
  const LS_HISTORY = "fn_mock_price_history";
  const LS_IDEASOFT = "fn_mock_ideasoft_stores";
  const LS_ADDED_AT = "fn_mock_added_at";

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* localStorage dolu/erişilemez olabilir - demo veri kaybı kritik değil */
    }
  }
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function nowSec() {
    return Date.now() / 1000;
  }
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  // ---------------------------------------------------------------------
  // Default settings — mirrors backend/config.py DEFAULT_SETTINGS exactly.
  // ---------------------------------------------------------------------
  const DEFAULT_SETTINGS = {
    store_name: "",
    store_url_fragment: "",
    gap_alert_percent: 2.0,
    eur_rate: 55.0,
    auto_scan_enabled: false,
    auto_scan_interval_minutes: 30,
    notif_banner_enabled: true,
    notif_sound_enabled: true,
    notif_gap_enabled: true,
    notif_not_listed_enabled: true,
    notif_scan_complete_enabled: true,
    notif_sound_volume: 0.5,
    notif_sound_type: "classic",
    dark_mode_enabled: false,
    price_tiers: [
      { min: 0, max: 2500, step: 1 },
      { min: 2500, max: 5000, step: 5 },
      { min: 5000, max: 10000, step: 25 },
      { min: 10000, max: 15000, step: 100 },
      { min: 15000, max: 20000, step: 175 },
      { min: 20000, max: 30000, step: 300 },
      { min: 30000, max: null, step: 400 },
    ],
    telegram_enabled: true,
    telegram_chat_ids: [],
    telegram_show_image: true,
    telegram_show_link: true,
    telegram_critical_auto_price_enabled: false,
    telegram_ulupinar_low_stock_enabled: false,
    telegram_ulupinar_critical_leader_enabled: false,
    telegram_ulupinar_found_enabled: false,
  };

  const DEFAULT_ACCOUNTS = [
    {
      id: "demo-hesap-1",
      name: "Ana Hesap",
      email: "hesap@example.com",
      password: "demo",
      store_name: "",
      store_url_fragment: "",
      icon: "toolbox",
      color: "indigo",
      enabled: true,
      order: 0,
    },
  ];

  const DEFAULT_SCRAPER_SITES = [
    {
      id: "ulupinar",
      name: "Ulupınar",
      base_url: "https://www.ulupinar.com.tr",
      color: "#E11D48",
      adapter: "ideasoft_generic",
      enabled: false,
      order: 0,
      builtin: true,
    },
  ];

  // ---------------------------------------------------------------------
  // Demo ürün havuzu — gerçek Bosch model adları, kurgusal rakip mağaza
  // isimleri. "mine: true" olan satır taramada, kullanıcının Giriş
  // ekranında girdiği Mağaza Adı ile değiştirilir (bkz. buildProduct).
  // Fiyat farkları kasıtlı çeşitli: bazıları %2 makas eşiğini aşıyor,
  // biri ilk 5 satıcı arasında gerçek bir "kırılma" (kritik fiyat)
  // içeriyor, biri de favori listesinde ama fiyat sayfasında hiç
  // bulunamamış ("Liste Dışı") durumunu gösteriyor.
  // ---------------------------------------------------------------------
  const PRODUCT_TEMPLATES = [
    {
      name: "Bosch GWS 9-115 900 W Avuç Taşlama Makinesi",
      sku: "GWS9-115",
      addedDaysAgo: 3,
      sellers: [
        { mine: true, price: 3300 },
        { name: "ElektroMarkt", price: 3382 },
        { name: "Bir Numara Teknik", price: 3429 },
      ],
    },
    {
      name: "Bosch 2607019504 46 Parça Cırcırlı Tornavida Seti",
      sku: "2607019504",
      addedDaysAgo: 6,
      sellers: [
        { name: "Usta Elektronik", price: 549 },
        { name: "Fiyat Uzmanı", price: 566 },
        { name: "Malzeme Merkezi", price: 581 },
        { mine: true, price: 599 },
        { name: "Anadolu Teknik", price: 615 },
        { name: "TeknoMarket", price: 631 },
      ],
    },
    {
      name: "Bosch GST 185-Li Aküsüz Dekupaj Testere",
      sku: "GST185LI",
      addedDaysAgo: 17,
      sellers: [
        { name: "Usta Elektronik", price: 9240 },
        { name: "Fiyat Uzmanı", price: 9340 },
        { name: "Malzeme Merkezi", price: 9440 },
        { mine: true, price: 9550 },
        { name: "Anadolu Teknik", price: 9650 },
        { name: "TeknoMarket", price: 9750 },
      ],
    },
    {
      name: "Bosch GBH 2-26 DRE 800 W Pnömatik Kırıcı-Delici",
      sku: "GBH2-26DRE",
      addedDaysAgo: 34,
      sellers: [
        { mine: true, price: 6079 },
        { name: "TeknoMarket", price: 6155 },
        { name: "UstaShop", price: 6220 },
        { name: "YapıDepo", price: 6310, stock: "Son 2 ürün", stock_level: "yellow" },
        { name: "MegaHırdavat", price: 6395 },
      ],
    },
    {
      name: "Bosch GWS 750-115 750 W Avuç Taşlama",
      sku: "GWS750-115",
      addedDaysAgo: 24,
      sellers: [
        { name: "Malzeme Merkezi", price: 2444.2 },
        { name: "Anadolu Teknik", price: 2478 },
        { name: "TeknoMarket", price: 2511 },
        { name: "UstaShop", price: 2545 },
        { name: "YapıDepo", price: 2579 },
        { name: "MegaHırdavat", price: 2613 },
        { mine: true, price: 2655 },
        { name: "ProAlet", price: 2699 },
      ],
    },
    {
      name: "Bosch PST 650 500 W Dekupaj Testere",
      sku: "PST650",
      addedDaysAgo: 8,
      sellers: [
        { name: "Şehir Hırdavat", price: 2544.85 },
        { mine: true, price: 2584 },
        { name: "Kampanya Nokta", price: 2624 },
        { name: "Hızlı Teknik", price: 2664 },
      ],
    },
    {
      name: "Bosch UniversalAquatak 135 1900 W Basınçlı Yıkama Makinesi",
      sku: "UNIVAQUATAK135",
      addedDaysAgo: 19,
      sellers: [
        { mine: true, price: 6949 },
        { name: "Doğru Fiyat", price: 7020 },
        { name: "Şehir Hırdavat", price: 7110 },
        { name: "Kampanya Nokta", price: 7210 },
      ],
    },
    {
      name: "Bosch GWS 2200-180 H 2200 W Büyük Taşlama Makinesi",
      sku: "GWS2200-180H",
      addedDaysAgo: 30,
      sellers: [
        { name: "Doğru Fiyat", price: 4999.5 },
        { mine: true, price: 5079 },
        { name: "Şehir Hırdavat", price: 5169, stock: "Tükendi", stock_level: "red" },
        { name: "Kampanya Nokta", price: 5259 },
      ],
    },
    {
      name: "Bosch EasyAquatak 120 1500 W Basınçlı Yıkama Makinesi",
      sku: "EASYAQUATAK120",
      addedDaysAgo: 41,
      sellers: [
        { name: "UstaShop", price: 3956 },
        { name: "YapıDepo", price: 4015 },
        { name: "MegaHırdavat", price: 4078 },
        { name: "ProAlet", price: 4140 },
        { name: "ElektroMarkt", price: 4205 },
        { mine: true, price: 4275 },
        { name: "Bir Numara Teknik", price: 4340 },
      ],
    },
    {
      name: "Bosch Advanced 1600A02BY7 52 Parça El Aletleri Seti",
      sku: "1600A02BY7",
      addedDaysAgo: 27,
      sellers: [
        { name: "Şehir Hırdavat", price: 4099 },
        { mine: true, price: 4165 },
        { name: "Kampanya Nokta", price: 4239 },
        { name: "Hızlı Teknik", price: 4319 },
      ],
    },
    {
      name: "Bosch GWS 7-115 720 W Avuç Taşlama Makinesi",
      sku: "GWS7-115",
      addedDaysAgo: 21,
      sellers: [
        { name: "Anadolu Teknik", price: 2744.5 },
        { name: "TeknoMarket", price: 2778 },
        { name: "UstaShop", price: 2811 },
        { name: "YapıDepo", price: 2845 },
        { name: "MegaHırdavat", price: 2879 },
        { name: "ProAlet", price: 2913 },
        { name: "ElektroMarkt", price: 2947 },
        { mine: true, price: 2989 },
      ],
    },
    {
      name: "Bosch GSB 185 Li Darbeli Matkap",
      sku: "GSB185LI",
      addedDaysAgo: 12,
      sellers: [
        { name: "ProAlet", price: 3294 },
        { name: "ElektroMarkt", price: 3325 },
        { mine: true, price: 3359 },
        { name: "Bir Numara Teknik", price: 3399 },
        { name: "Doğru Fiyat", price: 3449 },
      ],
    },
    {
      name: "Bosch GST 8000 E 710 W Dekupaj Testere",
      sku: "GST8000E",
      addedDaysAgo: 38,
      sellers: [
        { mine: true, price: 4430 },
        { name: "Bir Numara Teknik", price: 4495 },
        { name: "Doğru Fiyat", price: 4560 },
      ],
    },
    {
      name: "Bosch GWS 18V-8 Taşlama Makinesi",
      sku: "GWS18V-8",
      addedDaysAgo: 15,
      sellers: [
        { name: "Hızlı Teknik", price: 5300 },
        { name: "Usta Elektronik", price: 5369 },
        { mine: true, price: 5385 },
        { name: "Fiyat Uzmanı", price: 5459 },
        { name: "Malzeme Merkezi", price: 5539 },
      ],
    },
    {
      name: "Bosch Unlimited 7 BBS711TR Şarjlı Dikey Süpürge",
      sku: "BBS711TR",
      addedDaysAgo: 9,
      sellers: [
        { name: "Hızlı Teknik", price: 11950.8 },
        { mine: true, price: 12120 },
        { name: "Usta Elektronik", price: 12320, stock: "Son 1 ürün", stock_level: "yellow" },
        { name: "Fiyat Uzmanı", price: 12520 },
      ],
    },
    // v72 kırılma analizinin kendi yorumundaki örnek: ilk 5 satıcı arasında
    // %11.8 ve %22.6'lık iki sıçrama var -> ürün "Kritik Fiyat" sayılır.
    {
      name: "Bosch GCM 8 SDE 1400 W Gönye Kesme Testeresi",
      sku: "GCM8SDE",
      addedDaysAgo: 5,
      sellers: [
        { name: "Fiyat Uzmanı", price: 7828 },
        { name: "TeknoMarket", price: 8750 },
        { mine: true, price: 8850 },
        { name: "UstaShop", price: 10850 },
        { name: "YapıDepo", price: 11800 },
      ],
    },
    // Favori listesinde ama fiyat sayfasındaki satıcılar arasında kendi
    // mağazamız hiç bulunamamış -> "Liste Dışı" durumu.
    {
      name: "Bosch GSR 12V-15 FC Akülü Vidalama Makinesi",
      sku: null,
      addedDaysAgo: 2,
      sellers: [
        { name: "TeknoMarket", price: 4890 },
        { name: "UstaShop", price: 4950 },
        { name: "YapıDepo", price: 5020 },
      ],
      notListed: true,
    },
  ];

  // ---------------------------------------------------------------------
  // Kalıcı (localStorage) durum
  // ---------------------------------------------------------------------
  let settings = Object.assign({}, DEFAULT_SETTINGS, loadJSON(LS_SETTINGS, {}));
  let accounts = loadJSON(LS_ACCOUNTS, null) || DEFAULT_ACCOUNTS.map((a) => Object.assign({}, a));
  let scraperSites = loadJSON(LS_SCRAPER_SITES, null) || DEFAULT_SCRAPER_SITES.map((s) => Object.assign({}, s));
  let productNotes = loadJSON(LS_NOTES, {});
  let priceHistory = loadJSON(LS_HISTORY, {});
  let ideasoftStores = loadJSON(LS_IDEASOFT, []);
  let addedAt = loadJSON(LS_ADDED_AT, {});

  function persistSettings() { saveJSON(LS_SETTINGS, settings); }
  function persistAccounts() { saveJSON(LS_ACCOUNTS, accounts); }
  function persistScraperSites() { saveJSON(LS_SCRAPER_SITES, scraperSites); }
  function persistNotes() { saveJSON(LS_NOTES, productNotes); }
  function persistHistory() { saveJSON(LS_HISTORY, priceHistory); }
  function persistIdeasoft() { saveJSON(LS_IDEASOFT, ideasoftStores); }
  function persistAddedAt() { saveJSON(LS_ADDED_AT, addedAt); }

  // ---------------------------------------------------------------------
  // Oturum içi (bellek) durum — gerçek uygulamada da her yeniden başlatmada
  // sıfırlanan STATE alanlarının karşılığı.
  // ---------------------------------------------------------------------
  const STATE = {
    status: "giris_bekleniyor",
    status_detail: "",
    products: new Map(), // key -> product dict
    scanned_count: 0,
    total_favorites: 0,
    scan_started_at: null,
    scan_finished_at: null,
    paused: false,
    logged_in: false,
    app_entered: false,
    account_stats: {},
    active_account_id: null,
    scanGeneration: 0,
  };

  function publicAccount(acc) {
    return {
      id: acc.id,
      name: acc.name || "",
      email: acc.email || "",
      store_name: acc.store_name || "",
      store_url_fragment: acc.store_url_fragment || "",
      icon: acc.icon || "measure",
      color: acc.color || "indigo",
      icon_url: acc.custom_icon_data || null,
      enabled: !!acc.enabled,
      order: acc.order || 0,
      has_password: !!acc.password,
    };
  }
  function publicScraperSite(site) {
    return {
      id: site.id,
      name: site.name || "",
      base_url: site.base_url || "",
      color: site.color || "#4F6BFF",
      adapter: site.adapter || "ideasoft_generic",
      enabled: !!site.enabled,
      order: site.order || 0,
      builtin: !!site.builtin,
    };
  }
  function accountById(id) { return accounts.find((a) => a.id === id) || null; }
  function scraperSiteById(id) { return scraperSites.find((s) => s.id === id) || null; }
  function statsFor(accountId) {
    let st = STATE.account_stats[accountId];
    if (!st) { st = { status: "bekliyor", detail: "", scanned: 0, total: 0, last_scan_at: null }; STATE.account_stats[accountId] = st; }
    return st;
  }
  function accountsResponse() {
    return {
      ok: true,
      accounts: accounts.map(publicAccount),
      stats: STATE.account_stats,
      active_account_id: STATE.active_account_id,
      scanning: STATE.status === "taraniyor",
    };
  }
  function scraperSitesResponse() {
    return { ok: true, sites: scraperSites.map(publicScraperSite) };
  }

  // ---------------------------------------------------------------------
  // Sahte WebSocket — gerçek sunucudaki _broadcast()'in karşılığı.
  // ---------------------------------------------------------------------
  const wsClients = new Set();

  function broadcast(message) {
    const text = JSON.stringify(message);
    wsClients.forEach((ws) => ws.__deliver(text));
  }

  function snapshotMessage() {
    return {
      type: "snapshot",
      status: STATE.status,
      detail: STATE.status_detail,
      products: Array.from(STATE.products.values()),
      scanned_count: STATE.scanned_count,
      total_favorites: STATE.total_favorites,
      paused: STATE.paused,
      settings: settings,
      accounts: accounts.map(publicAccount),
      account_stats: STATE.account_stats,
      active_account_id: STATE.active_account_id,
      scraper_sites: scraperSites.map(publicScraperSite),
    };
  }

  class MockWebSocket {
    constructor(url) {
      this.url = url;
      this.readyState = 0; // CONNECTING
      this.onopen = null;
      this.onmessage = null;
      this.onerror = null;
      this.onclose = null;
      wsClients.add(this);
      setTimeout(() => {
        if (this.readyState === 3) return; // already closed
        this.readyState = 1; // OPEN
        if (this.onopen) this.onopen(new Event("open"));
        this.__deliver(JSON.stringify(snapshotMessage()));
      }, 180 + Math.random() * 120);
    }
    __deliver(text) {
      if (this.readyState !== 1) return;
      if (this.onmessage) this.onmessage({ data: text });
    }
    send() {
      /* frontend bu mock'ta hiç mesaj göndermiyor - gerçek backend'de de tek yönlü */
    }
    close() {
      this.readyState = 3;
      wsClients.delete(this);
      if (this.onclose) this.onclose(new CloseEvent("close"));
    }
  }
  MockWebSocket.CONNECTING = 0;
  MockWebSocket.OPEN = 1;
  MockWebSocket.CLOSING = 2;
  MockWebSocket.CLOSED = 3;

  window.WebSocket = MockWebSocket;

  // ---------------------------------------------------------------------
  // Ürün üretimi
  // ---------------------------------------------------------------------
  function buildProductForAccount(template, account) {
    const storeName = (settings.store_name || "").trim() || "Mağazanız";
    const sellers = template.sellers.map((s, idx) => ({
      rank: idx + 1,
      name: s.mine ? storeName : s.name,
      price: s.price,
      stock: s.stock || null,
      stock_level: s.stock_level || null,
    }));

    const url = `https://www.akakce.com/demo/${encodeURIComponent(template.sku || template.name)}.html`;
    const key = `${account.id}::${url}`;

    let myIndex = template.notListed ? -1 : template.sellers.findIndex((s) => s.mine);
    const result = {
      name: template.name,
      url,
      sellers,
      sellers_expected: sellers.length,
      image_url: null,
      my_rank: null,
      my_price: null,
      sku: template.notListed ? null : template.sku,
      gap_to_next_pct: null,
      gap_alert: false,
      status: "listede_yok",
      error: null,
    };

    if (myIndex >= 0) {
      result.my_rank = myIndex + 1;
      result.my_price = sellers[myIndex].price;
      result.status = myIndex === 0 ? "lider" : "geride";
      const threshold = Number(settings.gap_alert_percent) || 0;
      if (myIndex === 0 && sellers.length >= 2) {
        const gapPct = ((sellers[1].price - sellers[0].price) / sellers[0].price) * 100;
        result.gap_to_next_pct = Math.round(gapPct * 100) / 100;
        result.gap_alert = gapPct > threshold;
      } else {
        const gapPct = ((result.my_price - sellers[0].price) / sellers[0].price) * 100;
        result.gap_to_next_pct = Math.round(gapPct * 100) / 100;
        result.gap_alert = gapPct > threshold;
      }
    }

    result.key = key;
    result.account_id = account.id;
    result.account_name = account.name;
    result.account_icon = account.icon || "measure";
    result.account_color = account.color || "indigo";
    result.store_name = storeName;

    if (!(key in addedAt)) {
      addedAt[key] = nowSec() - (template.addedDaysAgo || 0) * 86400;
      persistAddedAt();
    }
    result.added_at = addedAt[key];
    result.starred = false;
    result.note = productNotes[key] || "";
    result._rev = uuid();
    result.scraper_sites = scraperSites
      .filter((s) => s.enabled)
      .map((s) => ({
        site_id: s.id,
        site_name: s.name,
        color: s.color || "#4F6BFF",
        status: "not_found",
        price: null,
        stock_label: null,
        stock_level: null,
        url: null,
        checked_at: nowSec(),
      }));

    recordPriceHistory(key, result);
    return result;
  }

  function recordPriceHistory(key, product) {
    const history = priceHistory[key] || (priceHistory[key] = []);
    const last = history[history.length - 1];
    const leaderPrice = product.sellers.length ? product.sellers[0].price : null;
    const changed = !last || last.price !== product.my_price || last.status !== product.status || last.leader_price !== leaderPrice;
    if (changed) {
      history.push({ t: nowSec(), price: product.my_price, leader_price: leaderPrice, status: product.status });
      if (history.length > 400) history.splice(0, history.length - 400);
      persistHistory();
    }
  }

  function findProduct(ref) {
    if (STATE.products.has(ref)) return STATE.products.get(ref);
    for (const p of STATE.products.values()) {
      if (p.url === ref) return p;
    }
    return null;
  }

  // ---------------------------------------------------------------------
  // Tarama simülasyonu
  // ---------------------------------------------------------------------
  function enabledScanQueue() {
    return accounts.filter((a) => a.enabled).sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitWhilePaused(generation) {
    while (STATE.paused && generation === STATE.scanGeneration) {
      await sleep(150);
    }
  }

  async function runScan(generation) {
    const queue = enabledScanQueue();
    STATE.total_favorites = queue.length * PRODUCT_TEMPLATES.length;
    STATE.scanned_count = 0;
    STATE.scan_started_at = nowSec();
    STATE.status = "taraniyor";
    broadcast({ type: "status", status: "taraniyor", detail: "Tarama başlatıldı..." });

    for (let qi = 0; qi < queue.length; qi++) {
      if (generation !== STATE.scanGeneration) return;
      const account = queue[qi];
      STATE.active_account_id = account.id;
      const stats = statsFor(account.id);
      stats.status = "taraniyor";
      stats.detail = `${PRODUCT_TEMPLATES.length} ürün taranıyor`;
      broadcast({
        type: "scan_progress_reset",
        scanned_count: 0,
        total_favorites: STATE.total_favorites,
        account_id: account.id,
        account_name: account.name,
        queue_index: qi + 1,
        queue_total: queue.length,
      });
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
      broadcast({ type: "status", status: "taraniyor", detail: `[${qi + 1}/${queue.length}] ${account.name} — ${PRODUCT_TEMPLATES.length} ürün taranıyor...` });

      for (const template of PRODUCT_TEMPLATES) {
        if (generation !== STATE.scanGeneration) return;
        await waitWhilePaused(generation);
        if (generation !== STATE.scanGeneration) return;

        const product = buildProductForAccount(template, account);
        STATE.products.set(product.key, product);
        STATE.scanned_count += 1;
        stats.scanned = STATE.scanned_count;
        stats.total = PRODUCT_TEMPLATES.length;

        broadcast({
          type: "product",
          product,
          scanned_count: STATE.scanned_count,
          total_favorites: STATE.total_favorites,
          account_id: account.id,
        });

        await sleep(260 + Math.random() * 260);
      }

      stats.status = "tamamlandi";
      stats.detail = `${PRODUCT_TEMPLATES.length} ürün tarandı`;
      stats.last_scan_at = nowSec();
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
    }

    if (generation !== STATE.scanGeneration) return;
    STATE.status = "bekliyor";
    STATE.scan_finished_at = nowSec();
    STATE.logged_in = true;
    broadcast({ type: "scan_complete", scanned_count: STATE.scanned_count, total_favorites: STATE.total_favorites });
    broadcast({ type: "status", status: "bekliyor", detail: "Tarama tamamlandı." });
  }

  function startScan() {
    const queue = enabledScanQueue();
    if (!queue.length) return false;
    STATE.products.clear();
    STATE.scanGeneration += 1;
    STATE.logged_in = true;
    const generation = STATE.scanGeneration;
    runScan(generation);
    return true;
  }

  function stopScan() {
    STATE.scanGeneration += 1;
    STATE.logged_in = false;
    STATE.active_account_id = null;
    STATE.paused = false;
    STATE.status = "giris_bekleniyor";
    broadcast({ type: "status", status: "giris_bekleniyor", detail: "Tarama durduruldu." });
  }

  // ---------------------------------------------------------------------
  // fetch() router
  // ---------------------------------------------------------------------
  const realFetch = window.fetch.bind(window);

  function jsonResponse(body, status) {
    return new Response(JSON.stringify(body), {
      status: status || 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  function errorResponse(message, status) {
    return jsonResponse({ ok: false, error: message }, status || 400);
  }

  async function readJsonBody(init) {
    if (!init || !init.body) return {};
    try {
      if (typeof init.body === "string") return JSON.parse(init.body);
      if (init.body instanceof Blob) return JSON.parse(await init.body.text());
    } catch (e) {
      /* boş/parse edilemeyen gövde - boş obje kabul edilir */
    }
    return {};
  }

  async function handleApi(pathname, method, init) {
    const parts = pathname.split("/").filter(Boolean); // ["api", ...]
    const p1 = parts[1];

    // ---- Login / oturum ----
    if (pathname === "/api/login-status" && method === "GET") {
      return jsonResponse({
        logged_in: STATE.logged_in,
        app_entered: STATE.app_entered,
        status: STATE.status,
        paused: STATE.paused,
        has_accounts: accounts.length > 0,
        account_count: accounts.length,
        scanning: STATE.status === "taraniyor",
      });
    }
    if (pathname === "/api/enter" && method === "POST") {
      STATE.app_entered = true;
      return jsonResponse({ ok: true, accounts: accounts.map(publicAccount), has_accounts: accounts.length > 0 });
    }
    if (pathname === "/api/logout" && method === "POST") {
      STATE.scanGeneration += 1;
      STATE.products.clear();
      STATE.scanned_count = 0;
      STATE.total_favorites = 0;
      STATE.paused = false;
      STATE.logged_in = false;
      STATE.app_entered = false;
      STATE.active_account_id = null;
      STATE.account_stats = {};
      STATE.status = "giris_bekleniyor";
      settings.store_name = "";
      settings.store_url_fragment = "";
      persistSettings();
      return jsonResponse({ ok: true });
    }
    if (pathname === "/api/factory-reset" && method === "POST") {
      [LS_SETTINGS, LS_ACCOUNTS, LS_SCRAPER_SITES, LS_NOTES, LS_HISTORY, LS_IDEASOFT, LS_ADDED_AT].forEach((k) => {
        try { localStorage.removeItem(k); } catch (e) {}
      });
      return jsonResponse({ ok: true });
    }

    // ---- Ayarlar ----
    if (pathname === "/api/settings" && method === "GET") {
      return jsonResponse(settings);
    }
    if (pathname === "/api/settings" && method === "POST") {
      const body = await readJsonBody(init);
      const updates = {};
      Object.keys(body).forEach((k) => { if (body[k] !== null && body[k] !== undefined) updates[k] = body[k]; });
      if ("store_name" in updates) updates.store_name = String(updates.store_name).trim().slice(0, 80);
      if ("store_url_fragment" in updates) updates.store_url_fragment = String(updates.store_url_fragment).trim().slice(0, 120);
      if ("gap_alert_percent" in updates) updates.gap_alert_percent = clamp(Number(updates.gap_alert_percent), 0, 100);
      if ("eur_rate" in updates) updates.eur_rate = clamp(Number(updates.eur_rate), 1, 1000);
      if ("auto_scan_interval_minutes" in updates) updates.auto_scan_interval_minutes = Math.max(1, Number(updates.auto_scan_interval_minutes));
      if ("notif_sound_volume" in updates) updates.notif_sound_volume = clamp(Number(updates.notif_sound_volume), 0, 1);
      if ("telegram_chat_ids" in updates) {
        const seen = new Set();
        updates.telegram_chat_ids = (updates.telegram_chat_ids || []).map(String).map((s) => s.trim())
          .filter((s) => /^\d{5,15}$/.test(s) && !seen.has(s) && seen.add(s));
      }
      Object.assign(settings, updates);
      persistSettings();
      broadcast({ type: "settings", settings });
      return jsonResponse({ ok: true, settings });
    }

    if (pathname === "/api/state" && method === "GET") {
      return jsonResponse({
        status: STATE.status,
        status_detail: STATE.status_detail,
        products: Array.from(STATE.products.values()),
        scan_started_at: STATE.scan_started_at,
        scan_finished_at: STATE.scan_finished_at,
        cycle_seconds: 60,
        total_favorites: STATE.total_favorites,
        scanned_count: STATE.scanned_count,
        store_name: settings.store_name,
        logged_in: STATE.logged_in,
        paused: STATE.paused,
        settings,
        accounts: accounts.map(publicAccount),
        account_stats: STATE.account_stats,
        active_account_id: STATE.active_account_id,
        scraper_sites: scraperSites.map(publicScraperSite),
      });
    }

    // ---- Akakçe hesapları ----
    if (pathname === "/api/akakce/accounts" && method === "GET") {
      return jsonResponse(accountsResponse());
    }
    if (pathname === "/api/akakce/accounts" && method === "POST") {
      const body = await readJsonBody(init);
      if (!String(body.name || "").trim()) return errorResponse("Hesaba bir isim ver (ör. Bahçe).");
      if (!String(body.email || "").trim() || !String(body.password || "").trim()) return errorResponse("E-posta ve şifre boş olamaz.");
      if (accounts.some((a) => (a.email || "").toLowerCase() === String(body.email).trim().toLowerCase())) {
        return errorResponse("Bu e-posta ile kayıtlı bir hesap zaten var.");
      }
      const account = {
        id: uuid(), name: String(body.name).trim(), email: String(body.email).trim(), password: body.password || "",
        store_name: "", store_url_fragment: "", icon: body.icon || "measure", color: body.color || "indigo",
        enabled: body.enabled !== false, order: accounts.length,
      };
      accounts.push(account);
      persistAccounts();
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
      return jsonResponse(accountsResponse());
    }
    if (p1 === "akakce" && parts[2] === "accounts" && parts[3] === "reorder" && method === "POST") {
      const body = await readJsonBody(init);
      const order = body.ids || [];
      order.forEach((id, idx) => { const a = accountById(id); if (a) a.order = idx; });
      accounts.sort((a, b) => (a.order || 0) - (b.order || 0));
      persistAccounts();
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
      return jsonResponse(accountsResponse());
    }
    if (p1 === "akakce" && parts[2] === "accounts" && parts[4] === "enabled" && method === "POST") {
      const id = decodeURIComponent(parts[3]);
      const acc = accountById(id);
      if (!acc) return errorResponse("Hesap bulunamadı.", 404);
      const body = await readJsonBody(init);
      acc.enabled = !!body.enabled;
      persistAccounts();
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
      return jsonResponse(accountsResponse());
    }
    if (p1 === "akakce" && parts[2] === "accounts" && parts[4] === "icon" && method === "POST") {
      const id = decodeURIComponent(parts[3]);
      const acc = accountById(id);
      if (!acc) return errorResponse("Hesap bulunamadı.", 404);
      try {
        const form = await init.body;
        // init.body burada zaten bir FormData örneği (bkz. fetch override).
        const file = form && typeof form.get === "function" ? form.get("file") : null;
        if (file && typeof file.arrayBuffer === "function") {
          const buf = await file.arrayBuffer();
          const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
          acc.custom_icon_data = `data:${file.type || "image/png"};base64,${b64}`;
        }
      } catch (e) { /* dosya okunamadıysa ikon değişmeden kalır */ }
      persistAccounts();
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
      return jsonResponse(accountsResponse());
    }
    if (p1 === "akakce" && parts[2] === "accounts" && parts[4] === "icon" && method === "DELETE") {
      const id = decodeURIComponent(parts[3]);
      const acc = accountById(id);
      if (!acc) return errorResponse("Hesap bulunamadı.", 404);
      delete acc.custom_icon_data;
      persistAccounts();
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
      return jsonResponse(accountsResponse());
    }
    if (p1 === "akakce" && parts[2] === "accounts" && parts.length === 4 && method === "PUT") {
      const id = decodeURIComponent(parts[3]);
      const acc = accountById(id);
      if (!acc) return errorResponse("Hesap bulunamadı.", 404);
      const body = await readJsonBody(init);
      if (!String(body.name || "").trim()) return errorResponse("Hesaba bir isim ver (ör. Bahçe).");
      if (!String(body.email || "").trim()) return errorResponse("E-posta boş olamaz.");
      acc.name = String(body.name).trim();
      acc.email = String(body.email).trim();
      if (String(body.password || "").trim()) acc.password = body.password;
      acc.icon = body.icon || "measure";
      acc.color = body.color || "indigo";
      acc.enabled = body.enabled !== false;
      persistAccounts();
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
      return jsonResponse(accountsResponse());
    }
    if (p1 === "akakce" && parts[2] === "accounts" && parts.length === 4 && method === "DELETE") {
      const id = decodeURIComponent(parts[3]);
      const acc = accountById(id);
      if (!acc) return errorResponse("Hesap bulunamadı.", 404);
      accounts = accounts.filter((a) => a.id !== id);
      accounts.forEach((a, idx) => { a.order = idx; });
      delete STATE.account_stats[id];
      Array.from(STATE.products.keys()).forEach((k) => { if (STATE.products.get(k).account_id === id) STATE.products.delete(k); });
      persistAccounts();
      broadcast({ type: "accounts", accounts: accounts.map(publicAccount), stats: STATE.account_stats, active_account_id: STATE.active_account_id });
      broadcast({ type: "account_products_cleared", account_id: id });
      return jsonResponse(accountsResponse());
    }
    if (pathname === "/api/akakce/start" && method === "POST") {
      const started = startScan();
      if (!started) return errorResponse("Taramaya dahil edilmiş hesap yok. En az bir hesabı işaretle.");
      return jsonResponse(accountsResponse());
    }
    if (pathname === "/api/akakce/stop" && method === "POST") {
      stopScan();
      return jsonResponse(accountsResponse());
    }

    // ---- Kazıyıcı siteleri ----
    if (pathname === "/api/scraper-sites" && method === "GET") return jsonResponse(scraperSitesResponse());
    if (pathname === "/api/scraper-sites" && method === "POST") {
      const body = await readJsonBody(init);
      if (!String(body.name || "").trim()) return errorResponse("Siteye bir isim ver (ör. Ulupınar).");
      const baseUrl = String(body.base_url || "").trim().replace(/\/+$/, "");
      if (!/^https?:\/\//i.test(baseUrl)) return errorResponse("Site adresi http:// veya https:// ile başlamalı.");
      if (scraperSites.some((s) => (s.base_url || "").toLowerCase() === baseUrl.toLowerCase())) {
        return errorResponse("Bu adresle kayıtlı bir site zaten var.");
      }
      const site = { id: uuid(), name: String(body.name).trim(), base_url: baseUrl, color: /^#[0-9a-f]{6}$/i.test(body.color || "") ? body.color : "#4F6BFF", adapter: "ideasoft_generic", enabled: body.enabled !== false, order: scraperSites.length, builtin: false };
      scraperSites.push(site);
      persistScraperSites();
      broadcast({ type: "scraper_sites", sites: scraperSites.map(publicScraperSite) });
      return jsonResponse(scraperSitesResponse());
    }
    if (p1 === "scraper-sites" && parts[2] === "reorder" && method === "POST") {
      const body = await readJsonBody(init);
      const order = body.ids || [];
      order.forEach((id, idx) => { const s = scraperSiteById(id); if (s) s.order = idx; });
      scraperSites.sort((a, b) => (a.order || 0) - (b.order || 0));
      persistScraperSites();
      broadcast({ type: "scraper_sites", sites: scraperSites.map(publicScraperSite) });
      return jsonResponse(scraperSitesResponse());
    }
    if (p1 === "scraper-sites" && parts[3] === "enabled" && method === "POST") {
      const id = decodeURIComponent(parts[2]);
      const site = scraperSiteById(id);
      if (!site) return errorResponse("Site bulunamadı.", 404);
      const body = await readJsonBody(init);
      site.enabled = !!body.enabled;
      persistScraperSites();
      broadcast({ type: "scraper_sites", sites: scraperSites.map(publicScraperSite) });
      return jsonResponse(scraperSitesResponse());
    }
    if (p1 === "scraper-sites" && parts.length === 3 && method === "PUT") {
      const id = decodeURIComponent(parts[2]);
      const site = scraperSiteById(id);
      if (!site) return errorResponse("Site bulunamadı.", 404);
      const body = await readJsonBody(init);
      if (!String(body.name || "").trim()) return errorResponse("Siteye bir isim ver (ör. Ulupınar).");
      const baseUrl = String(body.base_url || "").trim().replace(/\/+$/, "");
      if (!/^https?:\/\//i.test(baseUrl)) return errorResponse("Site adresi http:// veya https:// ile başlamalı.");
      site.name = String(body.name).trim();
      site.base_url = baseUrl;
      site.color = /^#[0-9a-f]{6}$/i.test(body.color || "") ? body.color : site.color;
      site.enabled = body.enabled !== false;
      persistScraperSites();
      broadcast({ type: "scraper_sites", sites: scraperSites.map(publicScraperSite) });
      return jsonResponse(scraperSitesResponse());
    }
    if (p1 === "scraper-sites" && parts.length === 3 && method === "DELETE") {
      const id = decodeURIComponent(parts[2]);
      const site = scraperSiteById(id);
      if (!site) return errorResponse("Site bulunamadı.", 404);
      scraperSites = scraperSites.filter((s) => s.id !== id);
      scraperSites.forEach((s, idx) => { s.order = idx; });
      STATE.products.forEach((p) => { if (p.scraper_sites) p.scraper_sites = p.scraper_sites.filter((e) => e.site_id !== id); });
      persistScraperSites();
      broadcast({ type: "scraper_sites", sites: scraperSites.map(publicScraperSite) });
      broadcast({ type: "scraper_sites_removed", site_id: id });
      return jsonResponse(scraperSitesResponse());
    }

    // ---- Tarama kontrolü ----
    if (pathname === "/api/pause" && method === "POST") {
      if (!STATE.logged_in) return errorResponse("Duraklatılacak aktif bir tarama yok.");
      STATE.paused = true;
      broadcast({ type: "paused", paused: true });
      return jsonResponse({ ok: true, paused: true });
    }
    if (pathname === "/api/resume" && method === "POST") {
      STATE.paused = false;
      broadcast({ type: "paused", paused: false });
      return jsonResponse({ ok: true, paused: false });
    }
    if (pathname === "/api/refresh" && method === "POST") {
      if (!enabledScanQueue().length) return errorResponse("Taranacak hesap yok — 'Hesaplarım' sayfasından en az bir Akakçe hesabını taramaya dahil et.");
      startScan();
      return jsonResponse({ ok: true });
    }

    // ---- Ürünler ----
    if (p1 === "products" && parts[3] === "star" && method === "POST") {
      const key = decodeURIComponent(parts[2]);
      const body = await readJsonBody(init);
      const product = findProduct(key);
      if (product) { product.starred = !!body.starred; broadcast({ type: "product", product, scanned_count: STATE.scanned_count }); }
      return jsonResponse({ ok: true, starred: !!body.starred });
    }
    if (p1 === "products" && parts[3] === "note" && method === "POST") {
      const key = decodeURIComponent(parts[2]);
      const body = await readJsonBody(init);
      const note = String(body.note || "").trim();
      if (note.length > 300) return errorResponse("Not en fazla 300 karakter olabilir.");
      if (note) productNotes[key] = note; else delete productNotes[key];
      persistNotes();
      const product = findProduct(key);
      if (product) { product.note = note; broadcast({ type: "product", product, scanned_count: STATE.scanned_count }); }
      return jsonResponse({ ok: true, note });
    }
    if (p1 === "products" && parts[3] === "price-history" && method === "GET") {
      const key = decodeURIComponent(parts[2]);
      return jsonResponse({ ok: true, history: priceHistory[key] || [] });
    }
    if (p1 === "products" && parts.length === 3 && method === "DELETE") {
      const key = decodeURIComponent(parts[2]);
      const product = findProduct(key);
      const realKey = product ? product.key : key;
      STATE.products.delete(realKey);
      delete addedAt[realKey];
      persistAddedAt();
      broadcast({ type: "product_removed", url: realKey });
      return jsonResponse({ ok: true });
    }

    // ---- IdeaSoft (gerçek OAuth/gönderim burada SİMÜLE edilir) ----
    if (pathname === "/api/ideasoft/status" && method === "GET") {
      return jsonResponse({ stores: ideasoftStores.map((s) => ({ id: s.id, store_domain: s.store_domain, connected: true })) });
    }
    if (pathname === "/api/ideasoft/connect" && method === "POST") {
      const body = await readJsonBody(init);
      const domain = String(body.store_domain || "").replace(/^https?:\/\//, "").replace(/\/$/, "").trim();
      if (!domain || !String(body.client_id || "").trim() || !String(body.client_secret || "").trim()) {
        return errorResponse("Mağaza adresi, Client ID ve Client Secret boş olamaz.");
      }
      let store = body.store_id ? ideasoftStores.find((s) => s.id === body.store_id) : null;
      if (!store) { store = { id: uuid() }; ideasoftStores.push(store); }
      store.store_domain = domain;
      persistIdeasoft();
      return jsonResponse({ ok: true });
    }
    if (p1 === "ideasoft" && parts[2] === "disconnect" && method === "POST") {
      const id = decodeURIComponent(parts[3]);
      ideasoftStores = ideasoftStores.filter((s) => s.id !== id);
      persistIdeasoft();
      return jsonResponse({ ok: true });
    }
    if (pathname === "/api/ideasoft/send-price" && method === "POST") {
      if (!ideasoftStores.length) {
        return errorResponse("Hiçbir IdeaSoft mağazasına bağlı değilsin. Önce yukarıdaki 'IdeaSoft' menüsünden bir mağaza ekle.");
      }
      const results = ideasoftStores.map((s) => ({ store_id: s.id, store_domain: s.store_domain, ok: true }));
      return jsonResponse({ ok: true, results });
    }
    if (p1 === "ideasoft" && parts[2] === "forget-match" && method === "POST") {
      return jsonResponse({ ok: true });
    }

    // ---- Telegram (gerçek bir mesaj hiçbir zaman gönderilmez) ----
    if (pathname === "/api/telegram/test" && method === "POST") {
      const body = await readJsonBody(init);
      const chatIds = (body.chat_ids && body.chat_ids.length ? body.chat_ids : settings.telegram_chat_ids) || [];
      if (!chatIds.length) return errorResponse("Önce en az bir Telegram ID'si ekleyip kaydetmelisin.");
      return jsonResponse({ ok: true, results: chatIds.map((id) => ({ ok: true, chat_id: id })) });
    }
    if (pathname === "/api/telegram/notify-critical" && method === "POST") {
      return jsonResponse({ ok: true, auto_sent: false, auto_send_error: null, telegram_results: [] });
    }
    if (pathname === "/api/telegram/notify-ulupinar" && method === "POST") {
      return jsonResponse({ ok: true, skipped: true });
    }

    // ---- Excel raporu: tarayıcıdan kullanıcının masaüstüne yazamayız ----
    if (pathname === "/api/export/excel" && method === "GET") {
      return errorResponse("Bu web demosunda Excel raporu bilgisayarınıza kaydedilemez. Tam sürümde rapor doğrudan masaüstünüze yazılır.", 501);
    }

    return jsonResponse({ ok: false, error: `Bilinmeyen uç nokta (demo): ${method} ${pathname}` }, 404);
  }

  window.fetch = async function (input, init) {
    const url = typeof input === "string" ? input : input && input.url;
    let pathname = url;
    try { pathname = new URL(url, location.href).pathname; } catch (e) {}

    if (typeof pathname === "string" && pathname.startsWith("/api/")) {
      const method = ((init && init.method) || (input && input.method) || "GET").toUpperCase();
      let realInit = init;
      if ((!init || init.body === undefined) && input && typeof input === "object" && input.body !== undefined) {
        realInit = { method, body: input.body };
      }
      // multipart/form-data (hesap ikonu yükleme) - FormData zaten body'de.
      try {
        return await handleApi(pathname, method, realInit);
      } catch (err) {
        return errorResponse("Demo backend hatası: " + (err && err.message), 500);
      }
    }
    return realFetch(input, init);
  };

  console.info("[Fiyat Nöbeti demo] Mock backend aktif — tüm veriler tarayıcıda üretilir, gerçek Akakçe/IdeaSoft/Telegram bağlantısı yoktur.");
})();
