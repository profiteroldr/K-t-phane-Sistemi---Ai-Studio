import { DeskFeature, DeskStatus } from '../types/library';

export function formatDuration(minutes: number): string {
  if (minutes < 0) minutes = 0;
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  if (h === 0) return `${m} dk`;
  if (m === 0) return `${h} saat`;
  return `${h} sa ${m} dk`;
}

export function formatClock(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getBreakRemaining(breakEndTime: number): {
  isExpired: boolean;
  minutesLeft: number;
  secondsLeft: number;
  formatted: string;
  overdueMinutes: number;
} {
  const diff = breakEndTime - Date.now();
  if (diff <= 0) {
    const overdueMs = Math.abs(diff);
    const overdueMinutes = Math.floor(overdueMs / (1000 * 60));
    const overdueSecs = Math.floor((overdueMs % (1000 * 60)) / 1000);
    return {
      isExpired: true,
      minutesLeft: 0,
      secondsLeft: 0,
      formatted: `+${String(overdueMinutes).padStart(2, '0')}:${String(overdueSecs).padStart(2, '0')}`,
      overdueMinutes,
    };
  }

  const minutesLeft = Math.floor(diff / (1000 * 60));
  const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
  return {
    isExpired: false,
    minutesLeft,
    secondsLeft,
    formatted: `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`,
    overdueMinutes: 0,
  };
}

export const FEATURE_INFO: Record<DeskFeature, { label: string; icon: string; desc: string }> = {
  power: { label: 'Priz Var', icon: 'Zap', desc: 'Dizüstü bilgisayar ve telefon şarj prizi' },
  window: { label: 'Pencere Kenarı', icon: 'Sun', desc: 'Doğal ışık alan pencere yanı' },
  pc: { label: 'PC / Monitör', icon: 'Monitor', desc: 'Kütüphane bilgisayarı donanımlı' },
  lamp: { label: 'Masa Lambası', icon: 'Lightbulb', desc: 'Kişisel ayarlanabilir aydınlatma' },
  quiet: { label: 'Ultra Sessiz', icon: 'VolumeX', desc: 'Tam sessiz çalışma alanı' },
  double: { label: 'Geniş Masa', icon: 'Maximize2', desc: 'Büyük çalışma yüzeyi' },
};

export const STATUS_INFO: Record<DeskStatus, { label: string; badgeClass: string; bgClass: string; borderClass: string; textClass: string }> = {
  available: {
    label: 'BOŞ (Müsait)',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bgClass: 'bg-emerald-50/50',
    borderClass: 'border-emerald-300 hover:border-emerald-500',
    textClass: 'text-emerald-700',
  },
  occupied: {
    label: 'DOLU (Kullanımda)',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    bgClass: 'bg-blue-50/40',
    borderClass: 'border-blue-300 hover:border-blue-500',
    textClass: 'text-blue-700',
  },
  on_break: {
    label: 'MOLADA',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse',
    bgClass: 'bg-amber-50/60',
    borderClass: 'border-amber-400 hover:border-amber-500',
    textClass: 'text-amber-700',
  },
  reserved_pending: {
    label: 'GÖREVLİ ONAYI BEKLİYOR',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
    bgClass: 'bg-purple-50/50',
    borderClass: 'border-purple-300 hover:border-purple-500',
    textClass: 'text-purple-700',
  },
  out_of_service: {
    label: 'KULLANIM DIŞI',
    badgeClass: 'bg-slate-200 text-slate-700 border-slate-300',
    bgClass: 'bg-slate-100/60',
    borderClass: 'border-slate-300 hover:border-slate-400',
    textClass: 'text-slate-600',
  },
};
