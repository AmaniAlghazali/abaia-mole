'use client';
import { useState } from 'react';
import { Crown, Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import api from '@/lib/api';

const contactInfo = [
  { icon: Mail,    keyLabel: 'email',        value: 'amanialghazali14@gmail.com' },
  { icon: Phone,   keyLabel: 'phone',        value: '+966 50 000 0000' },
  { icon: MapPin,  keyLabel: 'address',      keyValue: 'riyadh' },
  { icon: Clock,   keyLabel: 'workingHours', keyValue: 'workingHoursVal' },
];

export default function ContactPage() {
  const { t, lang } = useLang();

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/api/contact/send', form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      setError(lang === 'ar' ? 'حدث خطأ أثناء الإرسال. حاول مرة أخرى.' : 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1C1C1C] text-white py-24 px-4">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #B8963E 0%, transparent 60%), radial-gradient(circle at 20% 80%, #D4AF6A 0%, transparent 50%)' }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#B8963E]/20 border border-[#B8963E]/40 rounded-full px-5 py-2 mb-8">
            <Mail size={14} className="text-[#B8963E]" />
            <span className="text-[#D4AF6A] text-sm font-medium">{t('contactUs')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">
            <span className="text-white">{t('contactHero').split(' ').slice(0, -1).join(' ')} </span>
            <span className="text-[#B8963E]">{t('contactHero').split(' ').at(-1)}</span>
          </h1>
          <p className="text-[#B0B0B0] text-lg">{t('contactHeroSub')}</p>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Contact info sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#1C1C1C] rounded-3xl p-8 text-white">
              <div className="w-12 h-12 bg-[#B8963E]/20 rounded-xl flex items-center justify-center mb-6">
                <Crown size={22} className="text-[#B8963E]" />
              </div>
              <h2 className="text-xl font-bold mb-2">{t('brand')}</h2>
              <p className="text-[#999] text-sm mb-8 leading-relaxed">
                {lang === 'ar'
                  ? 'يسعدنا التواصل معك في أي وقت. نحن هنا لمساعدتك.'
                  : 'We\'re happy to hear from you anytime. We\'re here to help.'}
              </p>
              <div className="space-y-5">
                {contactInfo.map(({ icon: Icon, keyLabel, value, keyValue }) => (
                  <div key={keyLabel} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-[#B8963E]/15 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={16} className="text-[#B8963E]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#777] mb-0.5">{t(keyLabel)}</p>
                      <p className="text-sm text-white font-medium">{keyValue ? t(keyValue) : value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white border border-[#E8E3DB] rounded-2xl p-6">
              <p className="text-xs font-semibold text-[#7A7A7A] mb-4 uppercase tracking-wider">
                {lang === 'ar' ? 'تابعينا' : 'Follow Us'}
              </p>
              <div className="flex gap-3">
                {['Instagram', 'Twitter', 'Snapchat'].map((s) => (
                  <button
                    key={s}
                    className="flex-1 py-2.5 rounded-xl border border-[#E8E3DB] text-xs font-medium text-[#7A7A7A] hover:border-[#B8963E] hover:text-[#B8963E] hover:bg-[#F5EDD8] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#E8E3DB] rounded-3xl shadow-sm p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-[#1C1C1C] mb-1">
                {lang === 'ar' ? 'أرسلي رسالة' : 'Send a Message'}
              </h2>
              <p className="text-sm text-[#7A7A7A] mb-8">
                {lang === 'ar' ? 'سنرد عليك خلال 24 ساعة' : 'We\'ll reply within 24 hours'}
              </p>

              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1C1C1C]">
                    {lang === 'ar' ? 'تم الإرسال!' : 'Message Sent!'}
                  </h3>
                  <p className="text-sm text-[#7A7A7A] max-w-xs">{t('messageSent')}</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl border border-[#E8E3DB] text-sm text-[#7A7A7A] hover:border-[#B8963E] hover:text-[#B8963E] transition-colors"
                  >
                    {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name + Email row */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-[#2D2D2D] mb-1.5">{t('yourName')}</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder={lang === 'ar' ? 'أدخلي اسمك' : 'Enter your name'}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all placeholder:text-[#C0BDB8]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#2D2D2D] mb-1.5">{t('yourEmail')}</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="example@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all placeholder:text-[#C0BDB8]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#2D2D2D] mb-1.5">{t('yourMessage')}</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder={lang === 'ar' ? 'اكتبي رسالتك هنا...' : 'Write your message here...'}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all resize-none placeholder:text-[#C0BDB8]"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-[#B8963E] text-white font-bold text-sm hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/25 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={15} />
                    )}
                    {loading
                      ? (lang === 'ar' ? 'جاري الإرسال...' : 'Sending...')
                      : t('sendMessage')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1C1C1C] rounded-3xl overflow-hidden h-56 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #B8963E 0%, transparent 70%)' }}
            />
            <div className="relative text-center">
              <MapPin size={36} className="text-[#B8963E] mx-auto mb-3" />
              <p className="text-white font-semibold">{t('riyadh')}</p>
              <p className="text-[#777] text-sm mt-1">{t('workingHoursVal')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
