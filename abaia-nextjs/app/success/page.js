'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, Crown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';

export default function SuccessPage() {
  const { clearCart } = useCart();
  const { lang } = useLang();

  // Clear cart once when arriving on success page
  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 bg-[#FAFAF8]">
      <div className="text-center max-w-md fade-up">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={44} className="text-green-500" />
          </div>
          <div className="absolute -bottom-1 -end-1 w-10 h-10 bg-[#F5EDD8] rounded-full flex items-center justify-center border-2 border-white">
            <Crown size={16} className="text-[#B8963E]" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-3">
          {lang === 'ar' ? 'تم الدفع بنجاح! 🎉' : 'Payment Successful! 🎉'}
        </h1>
        <p className="text-[#7A7A7A] mb-2">
          {lang === 'ar'
            ? 'شكراً لثقتك بنا. طلبك قيد المعالجة وسيصلك قريباً.'
            : 'Thank you for your order. Your purchase is being processed.'}
        </p>
        <p className="text-sm text-[#B8963E] font-medium mb-10">
          {lang === 'ar'
            ? 'ستصلك رسالة تأكيد على بريدك الإلكتروني'
            : 'A confirmation email will be sent to you shortly'}
        </p>

        {/* Details card */}
        <div className="bg-white border border-[#E8E3DB] rounded-2xl p-6 mb-8 text-start">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle size={16} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1C1C1C]">
                {lang === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
              </p>
              <p className="text-xs text-[#7A7A7A]">
                {lang === 'ar' ? 'تمت المعالجة عبر Stripe' : 'Processed via Stripe'}
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#7A7A7A]">{lang === 'ar' ? 'الحالة' : 'Status'}</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                {lang === 'ar' ? 'مكتمل' : 'Completed'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A7A7A]">{lang === 'ar' ? 'طريقة الدفع' : 'Payment'}</span>
              <span className="font-medium text-[#1C1C1C]">Stripe</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#B8963E] text-white rounded-xl font-medium hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/20"
          >
            <ShoppingBag size={18} />
            {lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    </div>
  );
}
