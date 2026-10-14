import { useState, useMemo } from 'react';
import {
  Desk,
  Zone,
  DeskFeature,
} from '../types/library';
import {
  CheckCircle2,
  Zap,
  Sun,
  Monitor,
  Lightbulb,
  VolumeX,
  Maximize2,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
} from 'lucide-react';
import { getBreakRemaining } from '../utils/formatters';

interface KioskViewProps {
  desks: Desk[];
  zones: Zone[];
  onSelectDeskForVisitor: (desk: Desk, visitorName: string, visitorPhone?: string) => void;
  onExitKiosk: () => void;
}

export function KioskView({
  desks,
  zones,
  onSelectDeskForVisitor,
  onExitKiosk,
}: KioskViewProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [featureFilter, setFeatureFilter] = useState<DeskFeature | 'all'>('all');
  const [search, setSearch] = useState<string>('');

  // Selected desk for booking modal
  const [activeDesk, setActiveDesk] = useState<Desk | null>(null);
  const [visitorName, setVisitorName] = useState<string>('');
  const [visitorPhone, setVisitorPhone] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const filteredDesks = useMemo(() => {
    return desks.filter((desk) => {
      if (selectedZoneId !== 'all' && desk.zoneId !== selectedZoneId) return false;
      if (onlyAvailable && desk.status !== 'available') return false;
      if (featureFilter !== 'all' && !desk.features.includes(featureFilter)) return false;
      if (search && !desk.number.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [desks, selectedZoneId, onlyAvailable, featureFilter, search]);

  const availableCount = desks.filter((d) => d.status === 'available').length;
  const occupiedCount = desks.filter((d) => d.status === 'occupied').length;
  const breakCount = desks.filter((d) => d.status === 'on_break').length;

  const handleStartBooking = (desk: Desk) => {
    if (desk.status !== 'available') return;
    setActiveDesk(desk);
    setVisitorName('');
    setVisitorPhone('');
    setBookingSuccess(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDesk || !visitorName.trim()) return;

    onSelectDeskForVisitor(activeDesk, visitorName.trim(), visitorPhone.trim());
    setBookingSuccess(
      `Masa ${activeDesk.number} sizin için seçildi! Lütfen danışmadaki görevliye gidip adınızı (${visitorName}) belirtiniz.`
    );
    setTimeout(() => {
      setActiveDesk(null);
      setBookingSuccess(null);
    }, 4500);
  };

  const renderFeaturePills = (features: DeskFeature[]) => {
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {features.map((f) => {
          let text = '';
          let icon = null;
          switch (f) {
            case 'power':
              text = 'Priz';
              icon = <Zap className="w-3 h-3 text-amber-500" />;
              break;
            case 'window':
              text = 'Pencere';
              icon = <Sun className="w-3 h-3 text-orange-400" />;
              break;
            case 'pc':
              text = 'PC';
              icon = <Monitor className="w-3 h-3 text-sky-500" />;
              break;
            case 'lamp':
              text = 'Lamba';
              icon = <Lightbulb className="w-3 h-3 text-yellow-500" />;
              break;
            case 'quiet':
              text = 'Sessiz';
              icon = <VolumeX className="w-3 h-3 text-emerald-600" />;
              break;
            case 'double':
              text = 'Geniş';
              icon = <Maximize2 className="w-3 h-3 text-indigo-500" />;
              break;
          }
          return (
            <span
              key={f}
              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white/80 border border-slate-200/80 px-2 py-0.5 rounded-md text-slate-700"
            >
              {icon}
              {text}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-12">
      {/* Top Banner for Kiosk Screen */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/40 text-indigo-200 border border-indigo-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Ziyaretçi Canlı Doluluk Ekranı
                </span>
                <span className="text-xs text-indigo-200">
                  Lütfen boş yeşil masalardan birini seçiniz
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Kütüphane Masa Seçim & Doluluk Paneli
              </h1>
            </div>

            {/* Live Count Badges */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-4 py-2 text-center">
                <span className="text-2xl font-black text-emerald-300 block">{availableCount}</span>
                <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider">
                  Boş Masa
                </span>
              </div>

              <div className="bg-blue-500/20 border border-blue-400/40 rounded-xl px-4 py-2 text-center">
                <span className="text-2xl font-black text-blue-300 block">{occupiedCount}</span>
                <span className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider">
                  Kullanımda
                </span>
              </div>

              <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl px-4 py-2 text-center">
                <span className="text-2xl font-black text-amber-300 block">{breakCount}</span>
                <span className="text-[11px] font-semibold text-amber-100 uppercase tracking-wider">
                  Molada
                </span>
              </div>

              <button
                onClick={onExitKiosk}
                className="ml-2 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-xl transition-all font-semibold"
                title="Görevli Yönetim Paneline Geri Dön"
              >
                Görevli Paneli
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex-1 w-full space-y-5">
        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Zone filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedZoneId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedZoneId === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Tüm Salonlar ({desks.length})
            </button>
            {zones.map((zone) => {
              const count = desks.filter((d) => d.zoneId === zone.id).length;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedZoneId === zone.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {zone.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                onlyAvailable
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sadece Boş Masalar</span>
            </button>

            {/* Feature Filter Dropdown */}
            <select
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value as DeskFeature | 'all')}
              className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tüm Masa Özellikleri</option>
              <option value="power">⚡ Prizli Masalar</option>
              <option value="window">☀️ Pencere Kenarı</option>
              <option value="pc">🖥️ PC Donanımlı</option>
              <option value="quiet">🤫 Sessiz Alan</option>
              <option value="double">📐 Geniş Masa</option>
            </select>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Masa No (Örn: A-01)..."
                className="pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-36 sm:w-44"
              />
            </div>
          </div>
        </div>

        {/* Informative Step Bar for Visitors */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              1
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Aşağıdaki yeşil (BOŞ) masalardan dilediğinizi seçin
              </p>
              <p className="text-[11px] text-slate-600">
                Masa numarasına tıklayıp adınızı girerek yerinizi belirleyin.
              </p>
            </div>
          </div>

          <div className="hidden md:block text-slate-300 font-bold">→</div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              2
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Danışma bankosundaki kütüphane görevlisine gidin
              </p>
              <p className="text-[11px] text-slate-600">
                Seçtiğiniz masa numarasını ve ad soyadınızı görevliye iletiniz.
              </p>
            </div>
          </div>

          <div className="hidden md:block text-slate-300 font-bold">→</div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
              3
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Masanıza geçip çalışmaya başlayın
              </p>
              <p className="text-[11px] text-slate-600">
                Molaya çıkarken görevliye sürenizi belirtmeyi unutmayınız!
              </p>
            </div>
          </div>
        </div>

        {/* Desks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredDesks.map((desk) => {
            const isAvail = desk.status === 'available';
            const isOcc = desk.status === 'occupied';
            const isBrk = desk.status === 'on_break';
            const isPending = desk.status === 'reserved_pending';

            const zone = zones.find((z) => z.id === desk.zoneId);
            const breakInfo =
              isBrk && desk.currentUser?.breakEndTime
                ? getBreakRemaining(desk.currentUser.breakEndTime)
                : null;

            return (
              <div
                key={desk.id}
                onClick={() => isAvail && handleStartBooking(desk)}
                className={`relative p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between select-none ${
                  isAvail
                    ? 'bg-white border-emerald-400 hover:border-emerald-600 hover:shadow-lg cursor-pointer transform hover:-translate-y-1'
                    : isOcc
                    ? 'bg-blue-50/70 border-blue-200 opacity-90 cursor-not-allowed'
                    : isBrk
                    ? 'bg-amber-50/80 border-amber-300 cursor-not-allowed'
                    : 'bg-purple-50 border-purple-300 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                      {desk.number}
                    </span>
                    {isAvail && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        BOŞ
                      </span>
                    )}
                    {isOcc && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                        DOLU
                      </span>
                    )}
                    {isBrk && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900">
                        MOLADA
                      </span>
                    )}
                    {isPending && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-200 text-purple-900">
                        SEÇİLDİ
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-medium text-slate-500 mt-1 truncate">
                    {zone?.name}
                  </p>

                  {renderFeaturePills(desk.features)}
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100">
                  {isAvail && (
                    <div className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1">
                      <span>Bu Masayı Seç</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}

                  {isOcc && (
                    <div className="text-center py-1 text-[11px] text-blue-800 font-medium">
                      Kullanımda
                    </div>
                  )}

                  {isBrk && (
                    <div className="text-center py-1 text-[11px] font-mono font-bold text-amber-900 bg-amber-100 rounded-lg">
                      Mola: {breakInfo?.formatted}
                    </div>
                  )}

                  {isPending && (
                    <div className="text-center py-1 text-[11px] text-purple-800 font-medium">
                      Onay Bekliyor
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal on Kiosk */}
      {activeDesk && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Masa {activeDesk.number} Ayrıldı!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {bookingSuccess}
                </p>
                <p className="text-[11px] text-slate-400">
                  Bu pencere birkaç saniye içinde otomatik olarak kapanacaktır...
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Masa Seçimi
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Masa {activeDesk.number}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveDesk(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-slate-600">
                  Masayı rezerve etmek ve kütüphane görevlisine bildirmek için lütfen adınızı giriniz:
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adınız ve Soyadınız <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={visitorName}
                    onChange={(e) => setVisitorName(e.target.value)}
                    placeholder="Örn: Ahmet Yılmaz"
                    autoFocus
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefon Numarası <span className="text-slate-400 text-[10px] font-normal">(İsteğe Bağlı)</span>
                  </label>
                  <input
                    type="tel"
                    value={visitorPhone}
                    onChange={(e) => setVisitorPhone(e.target.value)}
                    placeholder="Örn: 0555 123 4567"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveDesk(null)}
                    className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="flex-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Masayı Seç ve Görevliye İlet</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
