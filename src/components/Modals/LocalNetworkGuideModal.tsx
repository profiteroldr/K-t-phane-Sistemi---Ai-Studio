import { Wifi, Copy, Check, HardDrive, Share2, ShieldCheck, Laptop } from 'lucide-react';
import { useState } from 'react';

interface LocalNetworkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocalNetworkGuideModal({ isOpen, onClose }: LocalNetworkGuideModalProps) {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Çevrimdışı & Yerel Ağ Rehberi
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Lokalde ve Başka Bilgisayarda Çalıştırma
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 overflow-y-auto pr-1 text-xs text-slate-600 leading-relaxed">
          {/* Box 1: Zero Internet Guarantee */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-950 text-sm">
                %100 Çevrimdışı ve Bağımsız Çalışma
              </h3>
              <p className="mt-0.5 text-emerald-800">
                Bu sistem hiçbir harici bulut sunucusuna ihtiyaç duymaz. Tüm masa durumları, mola sayaçları, kullanıcı bilgileri ve geçmiş kayıtlar tarayıcının yerel belleğinde (LocalStorage) tutulur. İnternetiniz tamamen kesilse bile eksiksiz çalışır.
              </p>
            </div>
          </div>

          {/* Box 2: Transfer to another PC */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              1. Dosyaları İstediğiniz Bilgisayara Aktarma
            </h3>
            <p>
              Proje klasörünü bir USB belleğe atarak veya yerel ağ üzerinden istediğiniz Windows / Mac / Linux bilgisayara kopyalayabilirsiniz.
            </p>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] space-y-1">
              <div className="text-slate-400"># 1. Klasöre girin ve bağımlılıkları kurun:</div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400">npm install</span>
                <button
                  onClick={() => copyToClipboard('npm install', 'install')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedCmd === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-slate-400 pt-1"># 2. Yerel sunucuyu başlatın:</div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400">npm run dev -- --host</span>
                <button
                  onClick={() => copyToClipboard('npm run dev -- --host', 'dev')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedCmd === 'dev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Box 3: Local Network (Wi-Fi / Ethernet) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4 text-emerald-600" />
              2. Kütüphane Yerel Ağında (Wi-Fi / Kablo) Paylaşma
            </h3>
            <p>
              Görevli bilgisayarında sunucu açıkken, kütüphanedeki tüm diğer bilgisayarlar, tabletler veya kiosk ekranı aynı Wi-Fi ya da kablolu ağ üzerinden bağlanabilir:
            </p>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1.5 text-indigo-950">
              <p className="font-semibold">Örnek Bağlantı Adresi:</p>
              <div className="bg-white p-2 rounded-lg border border-indigo-200 font-mono text-xs text-indigo-700 font-bold flex items-center justify-between">
                <span>http://192.168.1.X:3000</span>
                <span className="text-[10px] text-slate-400 font-normal">(Görevli bilgisayarının yerel IP'si)</span>
              </div>
              <p className="text-[11px] text-indigo-800">
                Tablet veya ekranda üst menüden <strong>"Ziyaretçi Kiosk Ekranı"</strong> modunu açarak gelen okuyucuların kendi masalarını seçmesini sağlayabilirsiniz.
              </p>
            </div>
          </div>

          {/* Box 4: Backup & Migration */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Laptop className="w-4 h-4 text-amber-600" />
              3. Verileri Tek Tıkla Yedekleme ve Aktarma
            </h3>
            <p>
              Eski bilgisayarınızdaki tüm masa durumlarını, geçmiş kayıtları ve ayarları yeni bilgisayara aktarmak için:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-slate-700">
              <li>Üst menüdeki <strong>Yedekleme (İndir)</strong> butonuna tıklayın. Bir JSON dosyası inecektir.</li>
              <li>Yeni bilgisayara geçip Ayarlar menüsünden <strong>"Yedek Dosyası Yükle"</strong> butonuna basın.</li>
              <li>Tüm veriler anında yeni bilgisayarda kullanıma hazır hale gelir!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
