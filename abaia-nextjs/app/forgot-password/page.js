'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Crown, Mail, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useLang } from '@/context/LangContext';

function ForgotPasswordForm() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [resultCode, setResultCode] = useState(null);
  const [isError, setIsError] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setResultCode('MISSING_FIELDS');
      setIsError(true);
      return;
    }
    setLoading(true);
    setResultCode(null);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setResultCode(res.data.code);
      setIsError(false);
      if (res.data.resetUrl) setDevResetUrl(res.data.resetUrl);
    } catch (err) {
      setResultCode(err.response?.data?.code || 'loginFailed');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const sent = resultCode === 'RESET_EMAIL_SENT';

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
      <div className="w-full max-w-sm fade-up">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#B8963E] transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          {t('backToLogin')}
        </Link>

        <div className="bg-white rounded-2xl border border-[#E8E3DB] shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#F5EDD8] rounded-2xl flex items-center justify-center mx-auto mb-4">
              {sent ? (
                <CheckCircle size={26} className="text-green-500" />
              ) : (
                <Crown size={26} className="text-[#B8963E]" />
              )}
            </div>
            <h1 className="text-xl font-bold text-[#1C1C1C]">{t('forgotPasswordTitle')}</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">{t('forgotPasswordSub')}</p>
          </div>

          {resultCode && (
            <div
              className={`rounded-xl p-3 mb-5 flex items-center gap-2 text-sm ${
                isError
                  ? 'bg-red-50 border border-red-200 text-red-600'
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}
            >
              <span className="shrink-0">{isError ? '⚠' : '✓'}</span>
              <span>{t(resultCode)}</span>
            </div>
          )}

          {!sent && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">
                  {t('email')}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (resultCode === 'MISSING_FIELDS') setResultCode(null); }}
                    className={`w-full px-4 py-2.5 pe-11 rounded-xl border text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:ring-2 transition-all ${
                      resultCode === 'MISSING_FIELDS'
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                        : 'border-[#E8E3DB] focus:border-[#B8963E] focus:ring-[#B8963E]/15'
                    }`}
                    placeholder="example@email.com"
                  />
                  <Mail size={15} className="absolute inset-y-0 end-3.5 my-auto text-[#B8B8B8]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#B8963E] text-white font-semibold text-sm hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/20 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {loading ? t('sending') : t('sendResetLink')}
              </button>
            </form>
          )}

          {sent && (
            <div className="text-center space-y-4">
              {devResetUrl && (
                <div className="bg-[#F5EDD8] border border-[#E2C97E] rounded-xl p-4 text-start">
                  <p className="text-xs font-semibold text-[#8B6914] mb-2">
                    {lang === 'ar' ? 'اضغط هنا لتغيير كلمة المرور:' : 'Click here to reset your password:'}
                  </p>
                  <Link
                    href={devResetUrl}
                    className="block text-xs text-[#B8963E] underline break-all hover:text-[#8B6914] transition-colors"
                  >
                    {devResetUrl}
                  </Link>
                </div>
              )}
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#B8963E] transition-colors"
              >
                <ArrowLeft size={14} />
                {t('backToLogin')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
