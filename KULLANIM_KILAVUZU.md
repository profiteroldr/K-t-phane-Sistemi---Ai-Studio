# Kütüphane Masa Doluluk & Takip Sistemi - Kurulum Kılavuzu

Bu uygulama hiçbir harici sunucuya veya internet bağlantısına ihtiyaç duymadan, tamamen kendi bilgisayarınızda veya kütüphanenizin yerel ağında (Wi-Fi / Ethernet) çalışır.

---

## 1. Hazırlık (Yalnızca İlk Seferde)

Bilgisayarınızda **Node.js** kurulu olmalıdır:
* Eğer kurulu değilse [nodejs.org](https://nodejs.org/) adresine gidin.
* **LTS (Önerilen)** sürümünü indirip bilgisayarınıza kurun (İleri > İleri > Bitir).

---

## 2. Windows'ta Tek Tıkla Çalıştırma (En Kolay Yol)

1. Proje klasörünü bilgisayarınıza kopyalayın (Masaüstü, Belgeler vb.).
2. Klasör içindeki **`baslat.bat`** dosyasına çift tıklayın.
3. İlk çalıştırmada gerekli kütüphaneler otomatik yüklenecektir.
4. Tarayıcınızda otomatik veya manuel olarak şu adresi açın:
   👉 **`http://localhost:3000`**

---

## 3. Komut Satırı ile Çalıştırma (Windows / Mac / Linux)

1. Proje klasörünü açın.
2. Klasörün içinde bir terminal/komut satırı açın:
   * **Windows:** Klasörün adres çubuğuna `cmd` yazıp `Enter` tuşuna basın.
   * **Mac / Linux:** Terminal açıp `cd /klasor-yolu` yazın.
3. Şu iki komutu sırasıyla çalıştırın:
   ```bash
   npm install
   npm run dev
   ```
4. Tarayıcınızda açın:
   👉 **`http://localhost:3000`**

---

## 4. Kütüphanedeki Diğer Bilgisayar ve Tabletlerden Bağlanma (Yerel Ağ)

Uygulama çalışırken, aynı modeme/ağa bağlı diğer personeller veya kiosk tabletleri doğrudan bağlanabilir:

1. Ana bilgisayarınızın yerel IP adresini öğrenin:
   * **Windows:** `cmd` açıp `ipconfig` yazın. `IPv4 Adresi` kısmındaki sayıyı not edin (Örn: `192.168.1.50`).
   * **Mac:** Sistem Ayarları > Ağ bölümünden IP'nize bakın.
2. Diğer bilgisayar, telefon veya tabletteki tarayıcının adres satırına şunu yazın:
   👉 **`http://192.168.1.50:3000`**
3. Tablette üst menüden **"Ziyaretçi Kiosk Ekranı"** moduna geçerek kütüphane girişine yerleştirebilirsiniz!

---

## 5. Başka Bir Bilgisayara Taşıma & Yedekleme

* **Verileri Aktarma:** Üst menüdeki **İndir** butonuna basarak tek bir `.json` yedek dosyası indirin.
* **Yeni Bilgisayara Yükleme:** Yeni bilgisayardaki uygulamayı açıp **Ayarlar > Yedek Yükle** butonuna tıklayın ve indirdiğiniz `.json` dosyasını seçin. Tüm masalarınız, aktif molalarınız ve geçmiş kayıtlarınız anında geri gelir.
