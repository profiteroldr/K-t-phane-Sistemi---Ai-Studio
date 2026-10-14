@echo off
chcp 65001 > nul
title Kütüphane Masa Doluluk Sistemi Başlatıcı

echo ======================================================
echo    KÜTÜPHANE MASA DOLULUK VE TAKİP SİSTEMİ
echo ======================================================
echo.

if not exist node_modules (
    echo [1/2] Gerekli paketler ilk kez kuruluyor, lütfen bekleyin...
    call npm install
    echo.
)

echo [2/2] Sistem yerel sunucuda başlatılıyor...
echo.
echo Tarayıcınızda açmak için:
echo   Bu bilgisayardan:    http://localhost:3000
echo   Yerel ağdaki diğer cihazlardan: http://[Bu-Bilgisayarin-IP-Adresi]:3000
echo.
echo Sistemi kapatmak için bu pencereyi kapatabilirsiniz.
echo ======================================================
echo.

call npm run dev
pause
