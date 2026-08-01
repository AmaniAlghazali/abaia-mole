'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { useLang } from '@/context/LangContext';
import { useCart } from '@/context/CartContext';

const styles = [
  { ar: 'نص كلوش', en: 'Half Cloche' },
  { ar: 'كلوش مزدوج', en: 'Double Cloche' },
  { ar: 'شيفون', en: 'Chiffon' },
  { ar: 'بشت كامل', en: 'Full Bisht' },
  { ar: 'ربع بشت', en: 'Quarter Bisht' },
  { ar: 'نص بشت', en: 'Half Bisht' },
  { ar: 'قصة الألف', en: 'A-Line Cut' },
];

const colorMap = {
  أسود: '#1a1a1a', أخضر: '#27ae60', أحمر: '#c0392b', أزرق: '#2c6fbb',
  أبيض: '#f0f0f0', بيج: '#e8d5b7', بنفسجي: '#8e44ad', وردي: '#e91e9f',
  رمادي: '#7f8c8d', بني: '#795548', كحلي: '#1a3a5c', ذهبي: '#d4a017',
  فضي: '#bdc3c7', عاجي: '#f5eedc', موف: '#ab47bc', زيتي: '#4a6b3a',
};

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8E3DB]">
      <div className="aspect-[3/4] shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-4 shimmer rounded w-3/4" />
        <div className="h-3 shimmer rounded w-1/2" />
        <div className="h-5 shimmer rounded w-1/3 mt-3" />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStyle, setActiveStyle] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    api.get('/api/products')
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeStyle === 'all' ? products : products.filter((p) => p.style === activeStyle);

  const handleAdd = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[#1C1C1C]">
        <div className="absolute inset-0">
          <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#B8963E]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 end-1/4 w-72 h-72 bg-[#B8963E]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-[#B8963E]/15 border border-[#B8963E]/30 rounded-full px-4 py-1.5 text-[#D4AF6A] text-xs font-medium mb-6">
            <Sparkles size={12} />
            {lang === 'ar' ? 'تشكيلة 2025' : 'Collection 2025'}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {lang === 'ar' ? (
              <><span className="gold-text">عبايتي</span> المتميزة</>
            ) : (
              <>My <span className="gold-text">Premium</span> Abaya</>
            )}
          </h1>
          <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto">{t('heroSub')}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-[#E8E3DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveStyle('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeStyle === 'all' ? 'bg-[#B8963E] text-white shadow-sm' : 'text-[#7A7A7A] hover:text-[#B8963E] hover:bg-[#B8963E]/8'}`}
            >
              {t('all')}
            </button>
            {styles.map((s) => (
              <button
                key={s.ar}
                onClick={() => setActiveStyle(s.ar)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeStyle === s.ar ? 'bg-[#B8963E] text-white shadow-sm' : 'text-[#7A7A7A] hover:text-[#B8963E] hover:bg-[#B8963E]/8'}`}
              >
                {lang === 'en' ? s.en : s.ar}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E8E3DB] text-sm text-[#2D2D2D] hover:border-[#B8963E] transition-colors"
          >
            <SlidersHorizontal size={14} />
            {activeStyle === 'all' ? t('all') : (lang === 'en' ? styles.find((s) => s.ar === activeStyle)?.en : activeStyle)}
          </button>

          <span className="text-xs text-[#7A7A7A] shrink-0">{filtered.length} {t('items')}</span>
        </div>

        {showFilters && (
          <div className="sm:hidden px-4 pb-3 flex flex-wrap gap-2">
            {[{ ar: 'all', en: 'All' }, ...styles].map((s) => (
              <button
                key={s.ar}
                onClick={() => { setActiveStyle(s.ar); setShowFilters(false); }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${activeStyle === s.ar ? 'bg-[#B8963E] text-white' : 'border border-[#E8E3DB] text-[#7A7A7A]'}`}
              >
                {s.ar === 'all' ? t('all') : (lang === 'en' ? s.en : s.ar)}
                {activeStyle === s.ar && <X size={10} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4 opacity-20">🛍️</div>
            <p className="text-[#7A7A7A] text-lg">{t('noProducts')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="product-card bg-white rounded-2xl overflow-hidden border border-[#E8E3DB] hover:border-[#B8963E]/40 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F5EDD8]">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="product-img w-full h-full object-cover transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#B8963E]/30">
                      <span className="text-5xl">👗</span>
                    </div>
                  )}
                  {product.quantity <= 3 && product.quantity > 0 && (
                    <span className="absolute top-2 start-2 bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {t('limited')}
                    </span>
                  )}
                  {product.quantity === 0 && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="text-sm font-medium text-[#7A7A7A]">{t('outOfStock')}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-[#1C1C1C] text-sm sm:text-base line-clamp-1 mb-1">
                    {lang === 'en' && product.title_en ? product.title_en : product.title}
                  </h3>
                  <p className="text-xs text-[#7A7A7A] line-clamp-1 mb-2">
                    {lang === 'en' && product.fabric_type_en ? product.fabric_type_en : product.fabric_type || t('notSpecified')}
                  </p>
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-3 h-3 rounded-full border border-[#E8E3DB]" style={{ backgroundColor: colorMap[product.color] || '#ccc' }} />
                    <span className="text-xs text-[#7A7A7A]">{lang === 'en' && product.color_en ? product.color_en : product.color}</span>
                    <span className="text-[#E8E3DB] text-xs">·</span>
                    <span className="text-xs text-[#7A7A7A]">{product.size}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base sm:text-lg font-bold text-[#B8963E]">
                      {Number(product.price).toLocaleString()}
                      <span className="text-[10px] font-normal text-[#7A7A7A] ms-1">{t('sar')}</span>
                    </span>
                    <button
                      onClick={(e) => handleAdd(e, product)}
                      disabled={product.quantity === 0}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        addedId === product.id ? 'bg-green-500 text-white' : product.quantity === 0 ? 'bg-[#F0EDE8] text-[#7A7A7A] cursor-not-allowed' : 'bg-[#B8963E] text-white hover:bg-[#8B6914]'
                      }`}
                    >
                      <ShoppingBag size={12} />
                      <span className="hidden sm:inline">{addedId === product.id ? '✓' : t('addToCart')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
