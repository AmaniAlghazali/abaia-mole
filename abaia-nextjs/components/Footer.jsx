'use client';
import Link from 'next/link';
import { Crown, Globe, ExternalLink } from 'lucide-react';
import { useLang } from '@/context/LangContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-[#1C1C1C] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-start">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <div className="w-8 h-8 rounded-full bg-[#B8963E]/20 flex items-center justify-center">
                <Crown size={16} className="text-[#B8963E]" />
              </div>
              <span className="font-bold text-white">{t('brand')}</span>
            </div>
            <p className="text-sm text-white/40 max-w-xs">{t('heroSub')}</p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start gap-2 text-sm">
            <Link href="/" className="text-white/50 hover:text-[#B8963E] transition-colors">{t('allAbayas')}</Link>
            <Link href="/cart" className="text-white/50 hover:text-[#B8963E] transition-colors">{t('cart')}</Link>
            <Link href="/login" className="text-white/50 hover:text-[#B8963E] transition-colors">{t('login')}</Link>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center md:items-start gap-2 text-sm">
            <a href="#" className="text-white/50 hover:text-[#B8963E] transition-colors">{t('privacyPolicy')}</a>
            <a href="#" className="text-white/50 hover:text-[#B8963E] transition-colors">{t('termsConditions')}</a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} {t('brand')}. {t('allRightsReserved')}.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#B8963E]/20 flex items-center justify-center transition-colors">
              <ExternalLink size={14} className="text-white/50" />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#B8963E]/20 flex items-center justify-center transition-colors">
              <Globe size={14} className="text-white/50" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
