'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function OAuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error || !token || !userParam) {
      router.replace('/login?error=oauth');
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));
      loginWithToken(token, user);
      router.replace(user.role === 'admin' ? '/admin' : '/');
    } catch {
      router.replace('/login?error=oauth');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-[#F5EDD8] rounded-full flex items-center justify-center mx-auto">
          <Crown size={28} className="text-[#B8963E] animate-pulse" />
        </div>
        <p className="text-sm text-[#7A7A7A]">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense>
      <OAuthHandler />
    </Suspense>
  );
}
