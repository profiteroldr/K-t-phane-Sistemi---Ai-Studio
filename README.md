# 📚 Kütüphane Masa Doluluk & Takip Sistemi

Çevrimdışı (offline) ve kütüphane yerel ağında (LAN / Wi-Fi) çalışan; masa doluluk takibi, kullanıcı girişi, mola/öğle arası sayaçları ve ziyaretçi kiosk ekranı sunan modern kütüphane yönetim yazılımı.

---

## 🌟 Temel Özellikler

* **%100 Çevrimdışı (Offline):** İnternet bağlantısına veya harici bulut sunucularına ihtiyaç duymaz. İnternet kesilse bile eksiksiz çalışır.
* **Çift Ekran Desteği:**
  * **Görevli Paneli:** Masa atama, mola başlatma/uzatma, masayı boşaltma ve mimari salon krokisi.
  * **Ziyaretçi Kiosk Ekranı:** Kütüphane girişindeki ekranda veya tablette boş masaları yeşil renkle gösteren ve ziyaretçilerin kendi yerlerini seçmesini sağlayan panel.
* **Akıllı Mola & Ayrılmış Yönetimi:** 15, 30, 45, 60 dk veya özel mola süresi; canlı geri sayım sayacı; süre dolduğunda sesli ve görsel alarm.
* **Geçmiş & Raporlama:** Günlük kullanım süreleri, toplam molalar ve tek tıkla Excel (CSV) raporu indirme.
* **Kolay Taşınabilirlik:** Tek tıkla JSON yedeği alıp başka bir bilgisayara saniyeler içinde aktarabilme.

---

## 📋 Ön Gereksinim (Ortak Adım)

Uygulamanın yerel bilgisayarınızda çalışabilmesi için sisteminizde **Node.js** kurulu olmalıdır.

* Bilgisayarınızda Node.js kurulu olup olmadığını kontrol etmek için:
  * **Windows:** Komut İstemi'ni (`cmd`) açın ve `node -v` yazın.
  * **macOS:** Terminal'i açın ve `node -v` yazın.
* Eğer bir sürüm numarası çıkmıyorsa (örn: `v20.x.x`):
  1. Resmi web sitesine gidin: **[https://nodejs.org/](https://nodejs.org/)**
  2. Yeşil renkli **LTS (Önerilen)** sürümünü indirin ve kurun.

---

## 🪟 Windows İçin Kurulum ve Çalıştırma

### Adım 1: Dosyaları Klasöre Çıkartın
İndirdiğiniz ZIP dosyasını bilgisayarınızda dilediğiniz bir konuma çıkartın (Örn: `Masaüstü\kutuphane-sistemi` veya `C:\kutuphane-sistemi`).

### Adım 2: Çalıştırma (2 Farklı Seçenek)

#### Seçenek A: Tek Tıkla Çalıştırma (En Kolay Yol)
1. Klasörün içinde bulunan **`baslat.bat`** dosyasına **çift tıklayın**.
2. Açılan siyah pencere, ilk seferde gerekli paketleri otomatik olarak kuracaktır (`npm install`).
3. Kurulum tamamlandıktan sonra yerel sunucu otomatik olarak başlayacaktır.
4. Tarayıcınızda şu adresi açın:
   👉 **`http://localhost:3000`**

#### Seçenek B: Komut İstemi (CMD) ile Çalıştırma
1. Proje klasörünü açın.
2. Dosya Gezgini'nin üst kısmındaki adres çubuğuna `cmd` yazıp **Enter** tuşuna basın (Böylece komut satırı doğrudan o klasörde açılır).
3. Sırasıyla şu iki komutu yazın ve çalıştırın:
   ```cmd
   npm install
   npm run dev
   ```
4. Tarayıcınızı açıp **`http://localhost:3000`** adresine gidin.

> **İpucu:** Windows Güvenlik Duvarı *"Node.js için ağ erişimine izin verilsin mi?"* uyarısı verirse, kütüphane yerel ağındaki diğer cihazların da bağlanabilmesi için **"Özel Ağlar"** seçeneğini işaretleyip **"Erişime İzin Ver"** butonuna basın.

---

## 🍎 macOS İçin Kurulum ve Çalıştırma

### Adım 1: Dosyaları Klasöre Çıkartın
İndirdiğiniz ZIP arşivini çift tıklayarak açın ve oluşan klasörü örneğin **Masaüstü** veya **Uygulamalar** dizinine taşıyın.

### Adım 2: Terminal'i Açın ve Klasöre Gidin
1. Klavyenizden `Command + Boşluk` (Spotlight) tuşlarına basın, **Terminal** yazıp `Enter` ile Terminal uygulamasını açın.
2. Klasörün içine girmek için `cd` yazıp bir boşluk bırakın ve Finder'daki proje klasörünü sürükleyip Terminal penceresine bırakın, ardından `Enter` tuşuna basın. Örnek:
   ```bash
   cd ~/Desktop/kutuphane-sistemi
   ```

### Adım 3: Çalıştırma (2 Farklı Seçenek)

#### Seçenek A: Komut Satırı ile Çalıştırma
Terminal ekranında sırasıyla şu iki komutu girin:
```bash
npm install
npm run dev
```
Konsolda `Local: http://localhost:3000` yazısını gördüğünüzde işlem tamamdır!
Safari veya Chrome tarayıcınızı açıp şu adrese gidin:
👉 **`http://localhost:3000`**

#### Seçenek B: Hazır Betik (`calistir.sh`) ile Çalıştırma
1. Terminalde bir defaya mahsus çalıştırma izni verin:
   ```bash
   chmod +x calistir.sh
   ```
2. Ardından şu komutla başlatın:
   ```bash
   ./calistir.sh
   ```

---

## 🌐 Kütüphane Yerel Ağında (Wi-Fi / Ethernet) Paylaşma

Uygulama çalışırken, aynı modeme veya ağa bağlı tüm tabletler, telefonlar ve diğer bilgisayarlar ana bilgisayara bağlanabilir (İnternet bağlantısı olmasa dahi yerel router üzerinden çalışır).

### 1. Ana Bilgisayarın Yerel IP Adresini Öğrenme:
* **Windows'ta:**
  1. `cmd` ekranını açın.
  2. `ipconfig` yazıp `Enter`a basın.
  3. `IPv4 Adresi` satırındaki IP'yi not edin (Örn: `192.168.1.45`).
* **macOS'ta:**
  1. `Sistem Ayarları > Ağ > Wi-Fi (veya Ethernet) > Ayrıntılar` kısmına bakın.
  2. Veya Terminalde şu komutu yazın:
     ```bash
     ipconfig getifaddr en0
     ```
     (Örn: `192.168.1.45` değerini döndürecektir).

### 2. Diğer Cihazlardan Bağlanma:
Kütüphanedeki tablet, telefon veya diğer personel bilgisayarının tarayıcısını açın ve adres çubuğuna şunu yazın:
👉 **`http://192.168.1.45:3000`** *(45 yerine kendi yerel IP'nizi yazınız)*

* **Giriş Kiosk Tableti:** Kütüphane girişindeki tablette üst menüden **"Ziyaretçi Kiosk Ekranı"** moduna geçin. Gelen öğrenciler boş masaları görerek buradan doğrudan masa seçimi yapabilirler!

---

## 💾 Verileri Yedekleme & Yeni Bilgisayara Aktarma

Tüm masa durumları, mola sayaçları ve kullanım geçmişi tarayıcınızın yerel depolama alanında (`localStorage`) güvenle tutulur.

* **Yedek Almak İçin:**
  1. Üst menüdeki **İndir (Ok) simgesine** tıklayın.
  2. Bilgisayarınıza anında `kutuphane_masa_yedek_YYYY-AA-GG.json` dosyası inecektir.
* **Yedeği Başka Bir Bilgisayara Yüklemek İçin:**
  1. Yeni bilgisayarda uygulamayı açın.
  2. Üst menüden **Ayarlar (Çark simgesi)** penceresini açın.
  3. **"Yedek Yükle"** butonuna basarak aldığınız `.json` dosyasını seçin.
  4. Tüm salonlar, masalar ve geçmiş saniyeler içinde geri yüklenecektir.

---

## 🖥️ Bağımsız Masaüstü Uygulaması Olarak Yükleme (PWA)

Web tarayıcısının adres çubuğunu gizleyip uygulamayı tıpkı bir masaüstü yazılımı gibi kullanabilirsiniz:

* **Google Chrome & Microsoft Edge:**
  1. `http://localhost:3000` adresine gidin.
  2. Adres çubuğunun sağ tarafındaki **"Uygulamayı Yükle"** (veya Menü > *Uygulamalar* > *Bu siteyi uygulama olarak yükle*) butonuna tıklayın.
  3. Masaüstünüze ve Başlat menünüze kısayol eklenecektir.
* **macOS Safari:**
  1. Safari menüsünden `Dosya > Dock'a Ekle` seçeneğini seçin.
  2. Uygulama Mac'inizin Dock alanına yerleşir ve bağımsız bir pencerede açılır.

---

## ❓ Sıkça Karşılaşılan Durumlar ve Çözümleri

1. **`Port 3000 is already in use` Hatası:**
   * Bilgisayarınızda 3000 portunu kullanan başka bir program varsa, terminalde `npx vite --port 3005 --host` yazarak uygulamayı farklı bir portta (örn: 3005) çalıştırabilirsiniz.
2. **`npm: command not found` Hatası:**
   * Node.js henüz kurulmamış veya kurulumdan sonra komut satırı yeniden başlatılmamıştır. [nodejs.org](https://nodejs.org/) adresinden kurulumu tamamlayıp komut satırını kapatıp yeniden açın.
3. **Mola Sesli Uyarısı Çalmıyor:**
   * Tarayıcılar ilk kullanıcı etkileşimi (tıklama) gerçekleşene kadar ses çalmayı engelleyebilir. Ekranda herhangi bir yere bir kez tıkladığınızda Web Audio sentezleyicisi aktif hale gelecektir. Ayrıca üst menüdeki hoparlör simgesinin açık olduğundan emin olun.
