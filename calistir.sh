#!/usr/bin/env bash
# Kütüphane Masa Doluluk Sistemi Başlatıcı (macOS / Linux)

echo "======================================================"
echo "   KÜTÜPHANE MASA DOLULUK VE TAKİP SİSTEMİ"
echo "======================================================"
echo ""

cd "$(dirname "$0")" || exit

if [ ! -d "node_modules" ]; then
    echo "[1/2] Gerekli paketler ilk kez kuruluyor, lütfen bekleyin..."
    npm install
    echo ""
fi

echo "[2/2] Sistem yerel sunucuda başlatılıyor..."
echo ""
echo "Tarayıcınızda açmak için:"
echo "  Bu bilgisayardan:              http://localhost:3000"
echo "  Yerel ağdaki diğer cihazlardan: http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}'):3000"
echo ""
echo "Sistemi durdurmak için bu terminal penceresinde Ctrl+C tuşlarına basabilirsiniz."
echo "======================================================"
echo ""

npm run dev
