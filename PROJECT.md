# SellerActions - Proje Dokümantasyonu

E-ticaret satıcıları için mikro-SaaS araç pazaryeri. Amazon, Shopify, Walmart, eBay, TikTok Shop ve Etsy satıcılarına yönelik 50 uygun fiyatlı, odaklanmış araç sunar.

## Genel Bakış

| Bilgi | Detay |
|-------|-------|
| Toplam Ürün | 50 (14 aktif, 36 yakında) |
| Kategori | 9 |
| Desteklenen Platform | 6 (Amazon, Shopify, Walmart, eBay, TikTok Shop, Etsy) |
| Ücretsiz Deneme | 14 gün |
| Hosting | GitHub Pages |
| Veritabanı | Supabase (PostgreSQL) |

---

## Teknoloji Yığını

### Frontend
- **HTML5** - Semantik markup, erişilebilir yapı
- **CSS3** - Custom properties, Grid/Flexbox, koyu tema, responsive tasarım
- **Vanilla JavaScript** - Framework yok, sıfır bağımlılık
- **Google Fonts** - DM Sans (gövde) + JetBrains Mono (kod)

### Backend / Servisler
- **Supabase** - Özellik istekleri, oylar, yorumlar (RLS politikaları ile)
- **Formspree** - "Beni Bilgilendir" ve deneme kayıt formları
- **GitHub Actions** - Otomatik CI/CD deployment

---

## Dizin Yapısı

```
SellerActions/
├── index.html                  # Ana sayfa (hero, öne çıkanlar, kategoriler, tüm araçlar)
├── product.html                # Dinamik ürün detay sayfası (?slug=xxx)
├── category.html               # Dinamik kategori listesi (?cat=xxx)
├── cart.html                   # 3 adımlı ödeme akışı
├── requests.html               # Özellik istek panosu (topluluk)
├── css/
│   └── style.css               # Tüm paylaşılan stiller (1.089 satır)
├── js/
│   ├── data.js                 # Ürün kataloğu, kategoriler, platformlar (1.308 satır)
│   ├── app.js                  # Sepet, modallar, bildirimler, ortak bileşenler (552 satır)
│   └── db.js                   # Supabase REST API entegrasyonu (240 satır)
├── supabase-schema.sql         # Veritabanı şeması, RLS politikaları, seed veriler
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
└── .gitignore
```

---

## Temel Özellikler

### 1. Ürün Kataloğu
- 9 kategoride 50 ürün: Finansal & Ücretler, Nakit Akışı, Geri Ödeme, Envanter, Listeleme, Reklamlar, İadeler, Operasyonlar, Çoklu Kanal
- Her üründe: slug, ad, fiyat, açıklama, özellikler, kullanım senaryoları, nasıl çalışır adımları
- "TOP PICK" (öne çıkan), "aktif" veya "yakında" durumları
- Pazar etkisi puanlaması (1-10 arası)

### 2. Alışveriş Sepeti
- `localStorage` tabanlı sepet sistemi
- **Paket indirimi**: Sepette 2+ ürün olduğunda %50+ indirim
- Site genelinde kalıcı indirim bandı
- Navigasyonda sepet sayacı

### 3. Dinamik Sayfa Yönlendirme
- `product.html?slug=buybox-watchdog` → Ürün detay sayfası
- `category.html?cat=financial` → Kategori listesi
- İstemci tarafı URL parametre çözümleme, sunucu tarafı yönlendirme gereksiz

### 4. Özellik İstek Sistemi
- Kullanıcılar araç fikirleri gönderebilir (e-posta, açıklama, platform)
- Tarayıcı parmak izi ile tekrarsız oy sistemi
- İstekler üzerinde yorum yapma
- Durum yaşam döngüsü: `pending` → `open` → `popular` → `planned` → `building` → `launched`
- Supabase kullanılamıyorsa `localStorage` + sabit seed veriye geri dönüş

### 5. Bildirimler ve Formlar
- Toast bildirimleri (sepete ekleme, abone olma vb.)
- Oy/yorum öncesi isteğe bağlı e-posta isteme modalı
- Formspree ile "Beni Bilgilendir" ve "Deneme Kayıt" form gönderimleri

### 6. SEO ve Meta Veriler
- Dinamik `<title>` ve `<meta description>` her sayfa için
- JSON-LD yapılandırılmış veri (SoftwareApplication şeması)
- Open Graph etiketleri
- Kanonik URL'ler
- Mobil öncelikli responsive tasarım

---

## Kod Yapısı

### `js/data.js` - Veri Katmanı
```javascript
PLATFORMS    // Amazon, Shopify, Walmart, eBay, TikTok, Etsy, Multi
CATEGORIES   // 9 kategori tanımı (slug, ad, ikon, açıklama)
PRODUCTS     // 50 ürün objesi

// Yardımcı Fonksiyonlar
getProductBySlug(slug)
getProductsByCategory(catSlug)
getLiveProducts() / getComingSoonProducts() / getFeaturedProducts()
searchProducts(query)
getCategoryCount(catSlug)
```

### `js/app.js` - Uygulama Mantığı
```javascript
Cart          // addItem, removeItem, getProducts, updateBadge
Toast         // show(title, message, type)
Modal         // showNotifyForm(product)
Discount      // applies(itemCount), calculate(price, itemCount)
Notify        // subscribe(slug, email), sendToFormspree(data)

// Paylaşılan Bileşenler
renderToolCard(product)
renderCategoryCard(catSlug)
renderNav(activePage)
renderFooter()

// Olay İşleyiciler
handleAddToCart(slug, redirect)
handleNotifySubmit(slug)
submitTrialSignup(data)
```

### `js/db.js` - Veritabanı Katmanı
```javascript
// Düşük seviye REST API
db.query(table, params)
db.insert(table, data)
db.update(table, id, data)
db.delete(table, id)

// Yüksek seviye Özellik İstek API'si
RequestsDB.getAll(sortBy)
RequestsDB.vote(requestId, email)
RequestsDB.addComment(requestId, author, text, email)
RequestsDB.submitRequest(title, desc, email, platform)
RequestsDB.hasVoted(requestId)
RequestsDB.getFallbackData(sortBy)  // Supabase yoksa yedek veri
```

---

## Veritabanı Şeması (Supabase)

| Tablo | Amaç | RLS Politikası |
|-------|-------|----------------|
| `feature_requests` | Gönderilen fikirler, durum, oy sayısı | Herkese açık okuma (pending hariç), herkese açık ekleme |
| `votes` | Oy kaydı, tarayıcı parmak izi ile tekrarsız | Herkese açık okuma/ekleme/silme |
| `comments` | İstekler üzerine kullanıcı yorumları | Herkese açık okuma/ekleme |

---

## Deployment

### GitHub Pages
- Her `main` dalına push'ta otomatik tetiklenir
- Derleme adımı gereksiz, dosyalar doğrudan sunulur
- Adres: `avocorecom.github.io/SellerActions/`

### Yerel Geliştirme
```bash
python3 -m http.server 8080
# veya
npx serve .
```

---

## Mimari Kararlar

1. **Framework yok** - Saf HTML/CSS/JS, sıfır bağımlılık, anlık yükleme
2. **İstemci tarafı render** - URL parametreleri ile dinamik sayfa oluşturma
3. **localStorage ile durum yönetimi** - Sepet, oylar, e-postalar yerel olarak saklanır
4. **Tarayıcı parmak izi** - Kimlik doğrulama olmadan oy spam'ini önler
5. **Zarif geri dönüş** - Supabase yoksa sabit verilere dönüş
6. **İsteğe bağlı e-posta toplama** - Oy/yorum için e-posta zorunlu değil
7. **Statik hosting** - GitHub Pages (ücretsiz, hızlı, git entegreli)
8. **Formspree** - Backend endpoint ihtiyacını ortadan kaldırır

---

## Ürün Kategorileri

| Kategori | Slug | Açıklama |
|----------|------|----------|
| Finansal & Ücretler | `financial` | Ücret hesaplama ve kârlılık araçları |
| Nakit Akışı | `cashflow` | Nakit akışı takibi ve tahminleme |
| Geri Ödeme | `reimbursement` | Kayıp/hasarlı envanter geri ödemeleri |
| Envanter | `inventory` | Stok yönetimi ve optimizasyonu |
| Listeleme | `listing` | Ürün listesi optimizasyonu |
| Reklamlar | `ads` | PPC ve reklam yönetimi |
| İadeler | `returns` | İade analizi ve yönetimi |
| Operasyonlar | `operations` | Genel operasyon araçları |
| Çoklu Kanal | `multichannel` | Çoklu platform yönetimi |
