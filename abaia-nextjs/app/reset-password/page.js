'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, EyeOff, Crown, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { useLang } from '@/context/LangContext';
import { useAuth } from '@/context/AuthContext';

function ResetPasswordForm() {
  const { t } = useLang();
  const { loginWithToken } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError(t('passwordMismatch'));
      return;
    }
    if (password.length < 8) {
      setError(t('ruleLength'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', { token, password });
      loginWithToken(res.data.token, res.data.user);
      setSuccess(true);
      const dest = res.data.user.role === 'admin' ? '/admin' : '/';
      setTimeout(() => router.push(dest), 2000);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'INVALID_OR_EXPIRED_TOKEN') {
        setTokenInvalid(true);
        setError(t('INVALID_OR_EXPIRED_TOKEN'));
      } else {
        setError(t('loginFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  // No token in URL at all
  if (!token) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-[#FAFAF8]">
        <div className="w-full max-w-sm fade-up text-center">
          <div className="bg-white rounded-2xl border border-[#E8E3DB] shadow-sm p-8 space-y-4">
            <Crown size={26} className="text-[#B8963E] mx-auto" />
            <p className="text-sm text-[#7A7A7A]">{t('INVALID_OR_EXPIRED_TOKEN')}</p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B8963E] text-white text-sm font-semibold hover:bg-[#8B6914] transition-colors"
            >
              <RefreshCw size={15} />
              {t('sendResetLink')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
              {success ? (
                <CheckCircle size={26} className="text-green-500" />
              ) : (
                <Crown size={26} className="text-[#B8963E]" />
              )}
            </div>
            <h1 className="text-xl font-bold text-[#1C1C1C]">{t('resetPasswordTitle')}</h1>
            <p className="text-sm text-[#7A7A7A] mt-1">{t('resetPasswordSub')}</p>
          </div>

          {/* Success state */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-1">
              <p className="text-sm font-semibold text-green-700">✓ {t('PASSWORD_RESET_SUCCESS')}</p>
              <p className="text-xs text-green-600">{t('loggingIn')}...</p>
            </div>
          )}

          {/* Error banner */}
          {error && !success && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 flex items-start gap-2 text-sm text-red-600">
              <span className="shrink-0 mt-0.5">⚠</span>
              <div className="space-y-2">
                <span>{error}</span>
                {tokenInvalid && (
                  <Link
                    href="/forgot-password"
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#B8963E] hover:underline mt-1"
                  >
                    <RefreshCw size={12} />
                    {t('sendResetLink')}
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Form — always visible until success */}
          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">
                  {t('newPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    required
                    minLength={8}
                    disabled={tokenInvalid}
                    className="w-full px-4 py-2.5 pe-11 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all disabled:opacity-50"
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

              <div>
                <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">
                  {t('confirmPassword')}
                </label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(null); }}
                  required
                  disabled={tokenInvalid}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading || tokenInvalid}
                className="w-full py-3 rounded-xl bg-[#B8963E] text-white font-semibold text-sm hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/20 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {loading ? t('resetting') : t('resetPasswordBtn')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
