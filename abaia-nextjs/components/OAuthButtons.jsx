'use client';
import { useLang } from '@/context/LangContext';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
      <path d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.2-.1-2.5-.4-3.5z" fill="#FFC107"/>
      <path d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/>
      <path d="M24 44c5.2 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.5 35.6 26.9 36.5 24 36.5c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.5 40 16.2 44 24 44z" fill="#4CAF50"/>
      <path d="M43.6 20.5H42V20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 6l6.2 5.2C41.7 36.1 44 31.8 44 27.5c0-1.2-.1-2.5-.4-3.5-.1-.2-.1-.3 0-.5z" fill="#1976D2"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.7.115 2.5.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.41-.01 2.74 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
    </svg>
  );
}

export default function OAuthButtons() {
  const { t } = useLang();

  return (
    <div className="mt-6">
      <div className="relative flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-[#E8E3DB]" />
        <span className="text-xs text-[#7A7A7A] shrink-0">{t('orContinueWith')}</span>
        <div className="flex-1 h-px bg-[#E8E3DB]" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`${BACKEND}/api/auth/google`}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E3DB] bg-white text-sm font-medium text-[#2D2D2D] hover:border-[#B8963E] hover:bg-[#FAFAF8] transition-all"
        >
          <GoogleIcon />
          Google
        </a>
        <a
          href={`${BACKEND}/api/auth/github`}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E8E3DB] bg-white text-sm font-medium text-[#2D2D2D] hover:border-[#B8963E] hover:bg-[#FAFAF8] transition-all"
        >
          <GitHubIcon />
          GitHub
        </a>
      </div>
    </div>
  );
}
