import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useLang } from "../context/LangContext";
import { ShoppingBag, Filter, X } from "lucide-react";

const styles = [
  { ar: "نص كلوش", en: "Half Cloche" },
  { ar: "كلوش مزدوج", en: "Double Cloche" },
  { ar: "شيفون", en: "Chiffon" },
  { ar: "بشت كامل", en: "Full Bisht" },
  { ar: "ربع بشت", en: "Quarter Bisht" },
  { ar: "نص بشت", en: "Half Bisht" },
  { ar: "قصة الألف", en: "A-Line Cut" },
];

const Shop = ({ addToCart }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStyle, setActiveStyle] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { t, lang } = useLang();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    activeStyle === "all"
      ? products
      : products.filter((p) => p.style === activeStyle);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-content overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center" style={{ textAlign: lang === "ar" ? "center" : "center" }}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-sm">
              {lang === "ar" ? "عبايتي المتميزة" : "My Premium Abaya"}
            </h1>
            <p className="text-lg sm:text-xl text-primary-content/80 max-w-2xl mx-auto">
              {lang === "ar"
                ? "تشكيلة راقية من العبايات الملكية بأفخم الأقمشة"
                : "An elegant collection of royal abayas in the finest fabrics"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="sticky top-16 z-30 bg-base-200/90 backdrop-blur-md border-b border-base-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="hidden sm:flex flex-wrap gap-2">
              <button
                onClick={() => setActiveStyle("all")}
                className={`btn btn-sm rounded-full ${activeStyle === "all" ? "btn-primary" : "btn-ghost"}`}
              >
                {t("all")}
              </button>
              {styles.map((s) => (
                <button
                  key={s.ar}
                  onClick={() => setActiveStyle(s.ar)}
                  className={`btn btn-sm rounded-full ${activeStyle === s.ar ? "btn-primary" : "btn-ghost"}`}
                >
                  {lang === "en" ? s.en : s.ar}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-sm btn-ghost sm:hidden gap-1"
            >
              <Filter size={16} />
              {activeStyle === "all" ? t("all") : lang === "en"
                ? styles.find((s) => s.ar === activeStyle)?.en
                : activeStyle}
            </button>
            <p className="text-sm text-base-content/50">
              {filteredProducts.length} {lang === "ar" ? "منتج" : "items"}
            </p>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 mt-3 sm:hidden">
              {styles.map((s) => (
                <button
                  key={s.ar}
                  onClick={() => { setActiveStyle(s.ar); setShowFilters(false); }}
                  className={`btn btn-xs rounded-full ${activeStyle === s.ar ? "btn-primary" : "btn-ghost"}`}
                >
                  {lang === "en" ? s.en : s.ar}
                  {activeStyle === s.ar && <X size={12} className="ms-1" />}
                </button>
              ))}
              {activeStyle !== "all" && (
                <button onClick={() => setActiveStyle("all")} className="btn btn-xs btn-ghost text-primary">
                  {t("all")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-30">🛍️</div>
            <p className="text-base-content/60 text-lg">{t("noProducts")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="card bg-base-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer card-hover rounded-xl overflow-hidden border border-base-200/50"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <figure className="relative aspect-[3/4] sm:aspect-[4/5] bg-base-200 overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-base-200 to-base-300 text-base-content/30">
                      <span className="text-4xl mb-2">🖼️</span>
                      <span className="text-sm">{t("abayaImage")}</span>
                    </div>
                  )}
                  {product.quantity <= 3 && product.quantity > 0 && (
                    <span className="absolute top-2 start-2 badge badge-warning badge-sm text-white border-0">
                      {lang === "ar" ? "محدود" : "Limited"}
                    </span>
                  )}
                </figure>
                <div className="card-body p-3 sm:p-4 gap-1 sm:gap-2">
                  <h3 className="card-title text-sm sm:text-base leading-tight line-clamp-1">
                    {lang === "en" && product.title_en ? product.title_en : product.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-base-content/50 line-clamp-1">
                    {lang === "en" && product.fabric_type_en
                      ? product.fabric_type_en
                      : product.fabric_type || t("notSpecified")}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-base-content/40">
                    <span>{t("size")}: {product.size}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full inline-block border border-base-300" style={{ backgroundColor: product.color ? "#" + (product.color_en === "Black" ? "1a1a1a" : "ccc") : "#ccc" }} />
                      {lang === "en" && product.color_en ? product.color_en : product.color || t("black")}
                    </span>
                  </div>
                  <div className="card-actions items-center justify-between mt-1 sm:mt-2">
                    <span className="text-base sm:text-lg font-bold text-error">
                      {Number(product.price).toLocaleString()} {t("sar")}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="btn btn-primary btn-xs sm:btn-sm gap-1"
                    >
                      <ShoppingBag size={14} />
                      <span className="hidden sm:inline">{t("addToCart")}</span>
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
};

export default Shop;
