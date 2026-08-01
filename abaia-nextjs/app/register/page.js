'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Crown, ArrowLeft, Check } from 'lucide-react';
import api from '@/lib/api';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';
import OAuthButtons from '@/components/OAuthButtons';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLang();
  const { loginWithToken } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const rules = [
    { label: t('ruleLength'), ok: password.length >= 8 },
    { label: t('ruleUpper'), ok: /[A-Z]/.test(password) },
    { label: t('ruleLower'), ok: /[a-z]/.test(password) },
    { label: t('ruleNumber'), ok: /[0-9]/.test(password) },
  ];
  const valid = rules.every((r) => r.ok);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/api/auth/register', { name, email, password, role: 'customer' });
      loginWithToken(res.data.token, res.data.user);
      router.push(res.data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || t('errorRegister'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
      <div className="w-full max-w-sm fade-up">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#B8963E] transition-colors mb-8">
          <ArrowLeft size={15} />
          {t('backToShop')}
        </Link>

        <div className="bg-white rounded-2xl border border-[#E8E3DB] shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#F5EDD8] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown size={26} className="text-[#B8963E]" />
            </div>
            <h1 className="text-xl font-bold text-[#1C1C1C]">{t('registerTitle')}</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">{t('registerSub')}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 flex items-center gap-2 text-sm text-red-600">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">{t('fullName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">{t('password')}</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pe-11 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 end-0 px-3.5 flex items-center text-[#7A7A7A] hover:text-[#B8963E] transition-colors">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password rules */}
              {password.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {rules.map((r) => (
                    <div key={r.label} className={`flex items-center gap-1.5 text-xs ${r.ok ? 'text-green-600' : 'text-[#7A7A7A]'}`}>
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${r.ok ? 'bg-green-100' : 'bg-[#F0EDE8]'}`}>
                        {r.ok && <Check size={9} />}
                      </div>
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !valid}
              className="w-full py-3 rounded-xl bg-[#B8963E] text-white font-semibold text-sm hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? t('creatingAccount') : t('createAccount')}
            </button>
          </form>

          <OAuthButtons />

          <div className="text-center mt-6 text-sm text-[#7A7A7A]">
            {t('haveAccount')}{' '}
            <Link href="/login" className="text-[#B8963E] font-medium hover:underline">
              {t('loginNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
