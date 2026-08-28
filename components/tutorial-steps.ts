export interface TutorialStep {
  route: string;
  targetId: string; // matches a data-tutorial="..." attribute; "" = centered, no spotlight cutout
  title: string;
  body: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    route: "/panel",
    targetId: "",
    title: "Fiyat Nöbeti'ne hoş geldiniz",
    body: "Bu kısa tur, panelin tüm bölümlerini birlikte gezdirecek — yaklaşık 2 dakika sürer. İstediğin an sağ üstteki butondan çıkabilirsin.",
  },
  {
    route: "/panel",
    targetId: "nav-all",
    title: "Anasayfa",
    body: "Akakçe'de takip ettiğin tüm ürünler burada listelenir. Bu demoda 15 gerçek Bosch ürünü önceden taranmış olarak seni bekliyor.",
  },
  {
    route: "/panel",
    targetId: "product-row-0",
    title: "Ürün satırı",
    body: "Her satırda ürün adı, ilk sıradaki satıcılar, sizin fiyatınız, makas yüzdesi, önerilen fiyat ve değişim bilgisi görünür. Mavi \"Siz\" etiketi kendi mağaza satırınızı gösterir.",
  },
  {
    route: "/panel",
    targetId: "product-actions-0",
    title: "Hızlı işlemler",
    body: "Yıldız ile öne çıkar, grafik ikonuyla detaylı fiyat geçmişini aç, not ekle veya ürünü listeden kaldır — hepsi tek tıkla buradan.",
  },
  {
    route: "/panel",
    targetId: "nav-gap",
    title: "Makas Açık",
    body: "Fiyat farkınız belirlediğiniz eşiği (%2) aştığında ürün burada listelenir — ya rakibe çok yaklaşılmış ya da liderlikte rahat bir pay bırakılmıştır.",
  },
  {
    route: "/panel",
    targetId: "nav-critical",
    title: "Kritik Ürünler",
    body: "Fiyat skalasında ani bir kırılma tespit edilirse ürün burada işaretlenir — otomatik fiyat gönderimi güvenlik için bu ürünlerde durur.",
  },
  {
    route: "/panel",
    targetId: "nav-starred",
    title: "Yıldızlı Ürünler",
    body: "Öncelikli takip ettiğin ürünleri yıldızlayarak burada tek listede toplayabilirsin.",
  },
  {
    route: "/panel",
    targetId: "nav-category-taslama",
    title: "Kategori sayfaları",
    body: "Sol menüde ürünleriniz kategorilere göre de ayrılır — sadece taşlama makinelerini, sadece testereleri görmek gibi.",
  },
  {
    route: "/panel/hesaplarim",
    targetId: "hesaplarim-lock",
    title: "Hesaplarım",
    body: "Gerçek uygulamada buradan birden fazla Akakçe hesabı ekleyip sırayla taratabilirsiniz. Bu herkese açık demoda yeni hesap eklemek kilitli — ama simge ve rengi yine de özelleştirebilirsiniz.",
  },
  {
    route: "/panel",
    targetId: "nav-ideasoft",
    title: "IdeaSoft'a Bağlan",
    body: "Gerçek sürümde önerilen fiyat tek tıkla IdeaSoft mağazanıza gönderilir. Demoda bu bağlantı ve fiyat gönderimi kilitlidir.",
  },
  {
    route: "/panel/ayarlar",
    targetId: "ayarlar-appearance",
    title: "Görünüm & Rapor",
    body: "Tema, ikon ve renk tercihlerinizi buradan özelleştirebilirsiniz — bu ayarlar demoda tamamen etkileşimlidir.",
  },
  {
    route: "/panel",
    targetId: "notif-bell",
    title: "Bildirimler",
    body: "Makas açılması, kritik fiyat tespiti veya tarama tamamlanması gibi olaylar burada birikir.",
  },
  {
    route: "/panel",
    targetId: "",
    title: "Hazırsınız!",
    body: "Artık paneli özgürce keşfedebilirsiniz. Turu istediğiniz zaman sağ üstteki yardım simgesinden tekrar başlatabilirsiniz.",
  },
];
