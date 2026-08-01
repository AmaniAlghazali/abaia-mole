'use client';
import Link from 'next/link';
import { Crown, Heart, Star, Shield, ArrowLeft, Sparkles } from 'lucide-react';
import { useLang } from '@/context/LangContext';

const stats = [
  { value: '+500', labelAr: 'تصميم فريد', labelEn: 'Unique Designs' },
  { value: '+2K', labelAr: 'عميلة سعيدة', labelEn: 'Happy Customers' },
  { value: '5★', labelAr: 'تقييم العملاء', labelEn: 'Customer Rating' },
  { value: '3', labelAr: 'سنوات خبرة', labelEn: 'Years of Experience' },
];

const values = [
  {
    icon: Star,
    keyTitle: 'quality',
    keyText: 'qualityText',
  },
  {
    icon: Sparkles,
    keyTitle: 'elegance',
    keyText: 'eleganceText',
  },
  {
    icon: Shield,
    keyTitle: 'trust',
    keyText: 'trustText',
  },
];

export default function AboutPage() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1C1C1C] text-white py-24 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #B8963E 0%, transparent 60%), radial-gradient(circle at 80% 20%, #D4AF6A 0%, transparent 50%)' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#B8963E]/20 border border-[#B8963E]/40 rounded-full px-5 py-2 mb-8">
            <Crown size={14} className="text-[#B8963E]" />
            <span className="text-[#D4AF6A] text-sm font-medium">{t('brand')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white">{t('aboutHero').split(' ').slice(0, -1).join(' ')} </span>
            <span className="text-[#B8963E]">{t('aboutHero').split(' ').at(-1)}</span>
          </h1>
          <p className="text-[#B8B8B8] text-lg max-w-2xl mx-auto leading-relaxed">
            {t('aboutHeroSub')}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#E8E3DB]">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p className="text-3xl font-bold text-[#B8963E] mb-1">{s.value}</p>
              <p className="text-sm text-[#7A7A7A]">{lang === 'ar' ? s.labelAr : s.labelEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story + Mission */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Story card */}
        <div className="relative">
          <div className="bg-[#1C1C1C] rounded-3xl p-8 text-white shadow-2xl">
            <div className="w-12 h-12 bg-[#B8963E]/20 rounded-2xl flex items-center justify-center mb-6">
              <Heart size={22} className="text-[#B8963E]" />
            </div>
            <h2 className="text-2xl font-bold mb-4">{t('ourStory')}</h2>
            <p className="text-[#B0B0B0] leading-relaxed text-sm">{t('ourStoryText')}</p>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B8963E] flex items-center justify-center">
                <Crown size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">{t('brand')}</p>
                <p className="text-xs text-[#7A7A7A]">2021</p>
              </div>
            </div>
          </div>
          {/* Decorative dot */}
          <div className="absolute -bottom-4 -end-4 w-24 h-24 rounded-full bg-[#F5EDD8] -z-10" />
        </div>

        {/* Mission */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#F5EDD8] rounded-full px-4 py-1.5">
            <Crown size={13} className="text-[#B8963E]" />
            <span className="text-[#8B6914] text-sm font-semibold">{t('ourMission')}</span>
          </div>
          <h2 className="text-3xl font-bold text-[#1C1C1C] leading-snug">{t('ourMission')}</h2>
          <p className="text-[#555] leading-relaxed">{t('ourMissionText')}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8963E] text-white rounded-xl font-semibold text-sm hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/25"
          >
            {lang === 'ar' ? 'تصفح التشكيلة' : 'Browse Collection'}
            <ArrowLeft size={15} className={lang === 'ar' ? '' : 'rotate-180'} />
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#1C1C1C] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#B8963E]/15 border border-[#B8963E]/30 rounded-full px-5 py-2 mb-4">
              <span className="text-[#D4AF6A] text-sm font-medium">{t('ourValues')}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">{t('ourValues')}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, keyTitle, keyText }) => (
              <div key={keyTitle} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#B8963E]/50 hover:bg-[#B8963E]/5 transition-all duration-300 group">
                <div className="w-12 h-12 bg-[#B8963E]/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#B8963E]/25 transition-colors">
                  <Icon size={22} className="text-[#B8963E]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{t(keyTitle)}</h3>
                <p className="text-[#999] text-sm leading-relaxed">{t(keyText)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-[#FAFAF8]">
        <div className="max-w-xl mx-auto">
          <div className="w-16 h-16 bg-[#F5EDD8] rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown size={28} className="text-[#B8963E]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1C1C1C] mb-3">
            {lang === 'ar' ? 'هل لديك سؤال؟' : 'Have a Question?'}
          </h2>
          <p className="text-[#7A7A7A] mb-8 text-sm">
            {lang === 'ar' ? 'تواصلي معنا وسنرد عليك في أقرب وقت' : 'Reach out and we\'ll get back to you shortly'}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1C1C1C] text-white rounded-xl font-semibold text-sm hover:bg-[#B8963E] transition-colors duration-300"
          >
            {t('contactUs')}
          </Link>
        </div>
      </section>

    </div>
  );
}
