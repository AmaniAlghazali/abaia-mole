'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, ArrowLeft, Check, Ruler, Palette } from 'lucide-react';
import api from '@/lib/api';
import { useLang } from '@/context/LangContext';
import { useCart } from '@/context/CartContext';

const colorMap = {
  أسود: '#1a1a1a', أخضر: '#27ae60', أحمر: '#c0392b', أزرق: '#2c6fbb',
  أبيض: '#f0f0f0', بيج: '#e8d5b7', بنفسجي: '#8e44ad', وردي: '#e91e9f',
  رمادي: '#7f8c8d', بني: '#795548', كحلي: '#1a3a5c', ذهبي: '#d4a017',
  فضي: '#bdc3c7', عاجي: '#f5eedc', موف: '#ab47bc', زيتي: '#4a6b3a',
};

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, lang } = useLang();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((r) => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product || product.quantity === 0) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] shimmer rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="h-7 shimmer rounded w-3/4" />
            <div className="h-5 shimmer rounded w-1/2" />
            <div className="h-10 shimmer rounded w-1/3 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-[#7A7A7A] text-lg mb-4">{t('productNotFound') || 'Product not found'}</p>
        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-[#B8963E] text-white rounded-lg hover:bg-[#8B6914] transition-colors">
          {t('backToShop')}
        </button>
      </div>
    );
  }

  const title = lang === 'en' && product.title_en ? product.title_en : product.title;
  const fabric = lang === 'en' && product.fabric_type_en ? product.fabric_type_en : product.fabric_type;
  const color = lang === 'en' && product.color_en ? product.color_en : product.color;
  const desc = lang === 'en' && product.description_en ? product.description_en : product.description;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#B8963E] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {t('backToShop')}
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-[#F5EDD8] rounded-2xl overflow-hidden shadow-lg">
              {product.image_url ? (
                <img src={product.image_url} alt={title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#B8963E]/30">
                  <span className="text-6xl">👗</span>
                </div>
              )}
            </div>
            {product.quantity <= 3 && product.quantity > 0 && (
              <span className="absolute top-4 start-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {t('limited')}
              </span>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center py-4">
            <div className="mb-2">
              {product.style && (
                <span className="text-xs font-medium text-[#B8963E] uppercase tracking-widest">{product.style}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-3 leading-tight">{title}</h1>

            {desc && (
              <p className="text-[#7A7A7A] text-sm leading-relaxed mb-6">{desc}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-3xl font-bold text-[#B8963E]">{Number(product.price).toLocaleString()}</span>
              <span className="text-[#7A7A7A] text-sm">{t('sar')}</span>
            </div>

            {/* Specs */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#E8E3DB]">
                <Palette size={16} className="text-[#B8963E] shrink-0" />
                <div>
                  <p className="text-xs text-[#7A7A7A]">{t('color')}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-4 h-4 rounded-full border border-[#E8E3DB]" style={{ backgroundColor: colorMap[product.color] || '#ccc' }} />
                    <p className="text-sm font-medium text-[#1C1C1C]">{color}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#E8E3DB]">
                <Ruler size={16} className="text-[#B8963E] shrink-0" />
                <div>
                  <p className="text-xs text-[#7A7A7A]">{t('size')}</p>
                  <p className="text-sm font-medium text-[#1C1C1C] mt-0.5">{product.size || t('notSpecified')}</p>
                </div>
              </div>
              {fabric && (
                <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#E8E3DB]">
                  <span className="text-[#B8963E] shrink-0 text-base">✨</span>
                  <div>
                    <p className="text-xs text-[#7A7A7A]">{t('fabric')}</p>
                    <p className="text-sm font-medium text-[#1C1C1C] mt-0.5">{fabric}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.quantity > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.quantity > 0 ? t('inStock') : t('outOfStock')}
              </span>
              {product.quantity > 0 && product.quantity <= 5 && (
                <span className="text-xs text-amber-500">({product.quantity} {lang === 'ar' ? 'متبقي' : 'left'})</span>
              )}
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={product.quantity === 0}
              className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl text-base font-semibold transition-all ${
                added
                  ? 'bg-green-500 text-white'
                  : product.quantity === 0
                  ? 'bg-[#F0EDE8] text-[#7A7A7A] cursor-not-allowed'
                  : 'bg-[#B8963E] text-white hover:bg-[#8B6914] shadow-lg shadow-[#B8963E]/20 hover:shadow-[#B8963E]/30'
              }`}
            >
              {added ? <Check size={20} /> : <ShoppingBag size={20} />}
              {added ? (lang === 'ar' ? 'تمت الإضافة ✓' : 'Added to Cart ✓') : t('addToCart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
