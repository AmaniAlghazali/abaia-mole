'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingCart } from 'lucide-react';
import api from '@/lib/api';
import { useLang } from '@/context/LangContext';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const [placing, setPlacing] = useState(false);

  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      const res = await api.post('/api/payments/create-checkout-session', { cart });
      window.location.href = res.data.url;
    } catch (err) {
      alert(err.response?.data?.error || t('errorOrder'));
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center fade-up">
          <div className="w-24 h-24 bg-[#F5EDD8] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={36} className="text-[#B8963E]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1C1C1C] mb-2">{t('emptyCart')}</h2>
          <p className="text-[#7A7A7A] mb-8">{t('emptyCartSub')}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#B8963E] text-white rounded-xl font-medium hover:bg-[#8B6914] transition-colors">
            <ShoppingBag size={18} />
            {t('backToShop')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-[#F5EDD8] transition-colors">
            <ArrowLeft size={18} className="text-[#7A7A7A]" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">{t('shoppingCart')}</h1>
            <p className="text-sm text-[#7A7A7A]">{cart.length} {lang === 'ar' ? 'منتج' : 'items'}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-1 space-y-3">
            {cart.map((item) => (
              <div key={item.product_id} className="bg-white rounded-2xl border border-[#E8E3DB] p-4 flex items-center gap-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-16 h-20 object-cover rounded-xl bg-[#F5EDD8] shrink-0" />
                ) : (
                  <div className="w-16 h-20 rounded-xl bg-[#F5EDD8] flex items-center justify-center shrink-0">
                    <span className="text-2xl">👗</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#1C1C1C] text-sm truncate">
                    {lang === 'en' && item.title_en ? item.title_en : item.title}
                  </h4>
                  <p className="text-[#B8963E] font-bold text-sm mt-1">
                    {Number(item.price).toLocaleString()} {t('sar')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.product_id, -1)}
                    className="w-7 h-7 rounded-lg border border-[#E8E3DB] flex items-center justify-center hover:border-[#B8963E] hover:text-[#B8963E] transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-[#1C1C1C]">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, 1)}
                    className="w-7 h-7 rounded-lg border border-[#E8E3DB] flex items-center justify-center hover:border-[#B8963E] hover:text-[#B8963E] transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="text-end shrink-0 hidden sm:block">
                  <p className="text-sm font-bold text-[#1C1C1C]">
                    {(item.price * item.quantity).toLocaleString()} {t('sar')}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="p-2 rounded-lg text-[#7A7A7A] hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-2xl border border-[#E8E3DB] p-5 sticky top-24">
              <h3 className="font-bold text-[#1C1C1C] text-base mb-5">{t('subtotal')}</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#7A7A7A]">
                  <span>{t('subtotal')}</span>
                  <span className="font-medium text-[#1C1C1C]">{subtotal.toLocaleString()} {t('sar')}</span>
                </div>
                <div className="flex justify-between text-[#7A7A7A]">
                  <span>{t('vat')}</span>
                  <span className="font-medium text-[#1C1C1C]">{vat.toLocaleString()} {t('sar')}</span>
                </div>
              </div>

              <div className="border-t border-[#E8E3DB] my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-[#1C1C1C]">{t('total')}</span>
                <span className="text-xl font-bold text-[#B8963E]">{total.toLocaleString()} {t('sar')}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={placing}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#B8963E] text-white rounded-xl font-semibold hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/20 disabled:opacity-60"
              >
                {placing ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CreditCard size={18} />
                )}
                {placing ? (lang === 'ar' ? 'جاري المعالجة...' : 'Processing...') : t('checkout')}
              </button>

              <Link href="/" className="flex items-center justify-center gap-2 w-full mt-3 py-2.5 rounded-xl text-sm text-[#7A7A7A] hover:text-[#B8963E] transition-colors">
                <ArrowLeft size={14} />
                {t('backToShop')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
