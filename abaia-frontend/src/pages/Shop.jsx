import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useLang } from "../context/LangContext";

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
        <span className="mr-3 text-lg">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8 py-8"
      style={{ textAlign: lang === "ar" ? "right" : "left" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-base-content">
        {t("latestCollection")}
      </h2>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveStyle("all")}
          className={`btn btn-sm ${activeStyle === "all" ? "btn-primary" : "btn-ghost"}`}
        >
          {t("all")}
        </button>
        {styles.map((s) => (
          <button
            key={s.ar}
            onClick={() => setActiveStyle(s.ar)}
            className={`btn btn-sm ${activeStyle === s.ar ? "btn-primary" : "btn-ghost"}`}
          >
            {lang === "en" ? s.en : s.ar}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-base-content/60 py-20">
          {t("noProducts")}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <figure className="h-56 sm:h-64">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-base-300 text-base-content/40 text-lg">
                    {t("abayaImage")}
                  </div>
                )}
              </figure>
              <div className="card-body p-4">
                <h3 className="card-title text-base sm:text-lg">
                  {lang === "en" && product.title_en ? product.title_en : product.title}
                </h3>
                <p className="text-sm text-base-content/60">
                  {t("fabric")}: {lang === "en" && product.fabric_type_en ? product.fabric_type_en : (product.fabric_type || t("notSpecified"))}
                </p>
                <div className="flex gap-2 text-xs text-base-content/50 bg-base-200 rounded-lg p-2">
                  <span>{t("size")}: {product.size}</span>
                  <span>•</span>
                  <span>{t("color")}: {lang === "en" && product.color_en ? product.color_en : (product.color || t("black"))}</span>
                </div>
                <div className="card-actions items-center justify-between mt-2">
                  <span className="text-lg font-bold text-error">{product.price} {t("sar")}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    {t("addToCart")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
