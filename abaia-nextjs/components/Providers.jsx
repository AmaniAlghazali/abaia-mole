'use client';
import { LangProvider, useLang } from '@/context/LangContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { useEffect } from 'react';

function DirSetter({ children }) {
  const { dir, lang } = useLang();
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);
  return <>{children}</>;
}

export default function Providers({ children }) {
  return (
    <LangProvider>
      <DirSetter>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </DirSetter>
    </LangProvider>
  );
}
