'use client';
import Link from 'next/link';
import { XCircle, ShoppingCart } from 'lucide-react';
import { useLang } from '@/context/LangContext';

export default function CancelPage() {
  const { lang } = useLang();
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 bg-[#FAFAF8]">
      <div className="text-center max-w-sm fade-up">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">
          {lang === 'ar' ? 'تم إلغاء الدفع' : 'Payment Cancelled'}
        </h1>
        <p className="text-[#7A7A7A] mb-8">
          {lang === 'ar'
            ? 'لم يتم إتمام عملية الدفع. سلتك لا تزال محفوظة.'
            : 'Your payment was not completed. Your cart is still saved.'}
        </p>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8963E] text-white rounded-xl font-medium hover:bg-[#8B6914] transition-colors"
        >
          <ShoppingCart size={18} />
          {lang === 'ar' ? 'العودة للسلة' : 'Back to Cart'}
        </Link>
      </div>
    </div>
  );
}
