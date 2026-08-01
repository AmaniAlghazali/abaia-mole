'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Crown, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import OAuthButtons from '@/components/OAuthButtons';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorCode, setErrorCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailNudge, setEmailNudge] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorCode(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      setSuccess(true);
      const dest = data.user.role === 'admin' ? '/admin' : '/';
      setTimeout(() => router.push(dest), 1000);
    } catch (err) {
      setErrorCode(err.response?.data?.code || 'loginFailed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
      <div className="w-full max-w-sm fade-up">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#B8963E] transition-colors mb-8">
          <ArrowLeft size={15} />
          {t('backToShop')}
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E8E3DB] shadow-sm p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#F5EDD8] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown size={26} className="text-[#B8963E]" />
            </div>
            <h1 className="text-xl font-bold text-[#1C1C1C]">{t('loginTitle')}</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">{t('loginSub')}</p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-center text-sm text-green-700">
              ✓ {t('loggingIn')}
            </div>
          )}

          {errorCode && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 flex items-center gap-2 text-sm text-red-600">
              <span className="shrink-0">⚠</span>
              <span>{t(errorCode)}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#2D2D2D]">{t('password')}</label>
                <button
                  type="button"
                  onClick={() => {
                    if (!email.trim()) {
                      setEmailNudge(true);
                      setTimeout(() => setEmailNudge(false), 3000);
                    } else {
                      router.push(`/forgot-password?email=${encodeURIComponent(email.trim())}`);
                    }
                  }}
                  className="text-xs text-[#B8963E] hover:underline"
                >
                  {t('forgotPassword')}
                </button>
              </div>
              {emailNudge && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-1 flex items-center gap-2 text-xs text-amber-700">
                  <span>✉</span>
                  <span>{t('enterEmailFirst')}</span>
                </div>
              )}
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 pe-11 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 end-0 px-3.5 flex items-center text-[#7A7A7A] hover:text-[#B8963E] transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-xl bg-[#B8963E] text-white font-semibold text-sm hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/20 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {loading ? t('loggingIn') : t('login')}
            </button>
          </form>

          <OAuthButtons />

          <div className="text-center mt-6 text-sm text-[#7A7A7A]">
            {t('noAccount')}{' '}
            <Link href="/register" className="text-[#B8963E] font-medium hover:underline">
              {t('registerNow')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
