# Fiyat Nöbeti — Web Demo

Bu depo, masaüstü uygulaması **Fiyat Nöbeti**'nin gerçek arayüz dosyasını
(`index.html`, orijinal Python/pywebview uygulamasından **değiştirilmeden**
kopyalanmıştır) tarayıcıda çalışır hale getiren herkese açık bir demodur.

## Nasıl çalışıyor?

Masaüstü sürümünde bu arayüz, yerel bir Python/FastAPI sunucusuyla
(`fetch("/api/...")` ve bir `/ws` WebSocket'i üzerinden) konuşup gerçek bir
Akakçe taraması yapar, IdeaSoft'a fiyat gönderir ve Telegram bildirimleri
yollar.

Web demosunda o sunucu yok. Bunun yerine [`mock-backend.js`](mock-backend.js)
adlı bir dosya, `index.html` yüklenmeden hemen önce çalışıp tarayıcının
`fetch` ve `WebSocket` fonksiyonlarını devralır ve aynı API sözleşmesine
(aynı uç noktalar, aynı JSON şekilleri, aynı WebSocket mesaj tipleri)
tamamen tarayıcı içinde, örnek verilerle cevap verir. Hiçbir istek gerçek
Akakçe/IdeaSoft/Telegram sunucularına gitmez.

Sonuç: arayüzün kendisi (HTML/CSS/JS) orijinal uygulamayla birebir aynı;
sadece arkasındaki veri sahte.

## Yerelde çalıştırma

Bu statik bir sitedir, derleme adımı yoktur. Herhangi bir statik dosya
sunucusuyla açılabilir, örneğin:

```bash
npx serve .
```

## Yayınlama

Vercel'de "Other" (framework yok) olarak otomatik algılanır; `index.html`
kök dizinde olduğu için ek yapılandırma gerekmez.
