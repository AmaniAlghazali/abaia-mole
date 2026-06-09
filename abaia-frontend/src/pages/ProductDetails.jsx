import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useLang } from "../context/LangContext";
import { recolorWithAI } from "../utils/aiRecolor";

const colorMap = {
  أسود: "#1a1a1a", أخضر: "#27ae60", أحمر: "#c0392b", أزرق: "#2c6fbb",
  أبيض: "#f5f5f5", بيج: "#e8d5b7", بنفسجي: "#8e44ad", وردي: "#e91e9f",
  رمادي: "#7f8c8d", بني: "#795548", كحلي: "#1a3a5c", ذهبي: "#d4a017",
  فضي: "#bdc3c7", عاجي: "#f5eedc", موف: "#ab47bc", ليلكي: "#7b1fa2",
  زيتي: "#4a6b3a", كستنائي: "#800020", "أزرق داكن": "#0a2351", زمردي: "#046307",
};

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [variants, setVariants] = useState([]);
  const [active, setActive] = useState(null);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const [recolorUrl, setRecolorUrl] = useState(null);
  const [recolorWorking, setRecolorWorking] = useState(false);
  const [recolorError, setRecolorError] = useState(false);
  const currentVariantRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRes = await api.get("/api/products");
        const all = allRes.data;
        const current = all.find((p) => p.id === Number(id));
        if (!current) { setLoading(false); return; }
        let same, h;
        if (current.style) {
          same = all.filter((p) => p.style === current.style && p.quantity > 0);
          h = same.find((p) => p.image_url) || same[0];
        } else {
          same = [current];
          h = current.image_url ? current : null;
        }
        setVariants(same);
        const a = same.find((p) => p.id === current.id) || same[0];
        setActive(a);
        setHero(h);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const doRecolor = async (variant) => {
    if (!hero || hero.id === variant.id || variant.image_url) return;
    currentVariantRef.current = variant;
    setRecolorWorking(true);
    setRecolorUrl(null);
    setRecolorError(false);

    const hex = colorMap[variant.color];
    if (!hex) { setRecolorWorking(false); return; }

    try {
      const url = await recolorWithAI(hero.image_url, hex);
      if (currentVariantRef.current?.id === variant.id) {
        setRecolorUrl(url);
        setRecolorWorking(false);
      }
    } catch (err) {
      console.error("AI recolor error:", err);
      if (currentVariantRef.current?.id === variant.id) {
        setRecolorError(true);
        setRecolorWorking(false);
      }
    }
  };

  const selectColor = (variant) => {
    setActive(variant);
    setRecolorUrl(null);
    setRecolorWorking(false);
    setRecolorError(false);
    currentVariantRef.current = null;
    window.history.replaceState(null, "", `/product/${variant.id}`);
    doRecolor(variant);
  };

  const needsRecolor = active && hero && hero.id !== active.id && !active.image_url;

  useEffect(() => {
    if (needsRecolor && !recolorWorking && !recolorUrl && !recolorError) {
      doRecolor(active);
    }
  }, [active?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-lg">{t("productNotFound")}</p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          {t("backToShop")}
        </button>
      </div>
    );
  }

  const title = lang === "en" && active.title_en ? active.title_en : active.title;
  const desc = lang === "en" && active.description_en ? active.description_en : active.description;
  const fabric = lang === "en" && active.fabric_type_en ? active.fabric_type_en : active.fabric_type;
  const color = lang === "en" && active.color_en ? active.color_en : active.color;
  const style = lang === "en" && active.style_en ? active.style_en : active.style;

  let imageContent;
  if (active.image_url) {
    imageContent = <img key={active.id} src={active.image_url} alt={title} className="w-full h-full object-cover" />;
  } else if (recolorUrl) {
    imageContent = <img src={recolorUrl} alt={title} className="w-full h-full object-cover" />;
  } else if (recolorWorking) {
    imageContent = (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
        <span className="loading loading-spinner loading-lg text-primary" />
        <span className="text-sm text-base-content/60 text-center">
          {lang === "ar" ? "جاري معالجة الصورة..." : "Processing image..."}
        </span>
      </div>
    );
  } else if (recolorError) {
    imageContent = (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-6">
        <span className="text-base-content/40 text-sm text-center">
          {lang === "ar" ? "تعذرت معالجة الصورة" : "Failed to process image"}
        </span>
        <button onClick={() => doRecolor(active)} className="btn btn-ghost btn-xs">
          {lang === "ar" ? "إعادة المحاولة" : "Retry"}
        </button>
      </div>
    );
  } else if (hero) {
    imageContent = <img src={hero.image_url} alt={title} className="w-full h-full object-cover" />;
  } else {
    imageContent = (
      <div className="w-full h-full flex items-center justify-center text-base-content/40 text-lg">
        {t("abayaImage")}
      </div>
    );
  }

  let lightboxContent;
  if (active.image_url) {
    lightboxContent = <img key={active.id} src={active.image_url} alt={title} className="max-w-full max-h-full object-contain" />;
  } else if (recolorUrl) {
    lightboxContent = <img src={recolorUrl} alt={title} className="max-w-full max-h-full object-contain" />;
  } else if (hero) {
    lightboxContent = <img src={hero.image_url} alt={title} className="max-w-full max-h-full object-contain" />;
  }

  return (
    <div className="min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm mb-4">
        ← {t("backToShop")}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-base-100 shadow-sm overflow-hidden">
          <figure className="h-80 sm:h-96 cursor-pointer relative bg-base-300" onClick={() => setShowImage(true)}>
            {imageContent}
          </figure>
          {recolorUrl && needsRecolor && (
            <div className="px-3 py-1.5 text-xs text-base-content/50 bg-base-200 flex items-center gap-1.5">
              <span>✨</span>
              <span>{lang === "ar" ? "تم التلوين بالذكاء الاصطناعي" : "AI recolored"}</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
          {desc && <p className="text-base-content/70">{desc}</p>}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-base-100 p-3 rounded-box shadow-sm">
              <span className="font-semibold">{t("style")}: </span>
              {style || t("notSpecified")}
            </div>
            <div className="bg-base-100 p-3 rounded-box shadow-sm">
              <span className="font-semibold">{t("fabric")}: </span>
              {fabric || t("notSpecified")}
            </div>
            <div className="bg-base-100 p-3 rounded-box shadow-sm">
              <span className="font-semibold">{t("size")}: </span>
              {active.size}
            </div>
            <div className="bg-base-100 p-3 rounded-box shadow-sm">
              <span className="font-semibold">{t("color")}: </span>
              {color || t("black")}
            </div>
          </div>

          <p className="text-3xl font-bold text-error">{active.price} {t("sar")}</p>

          <button
            onClick={() => {
              addToCart(active);
              alert(lang === "ar" ? `تمت إضافة "${title}" إلى السلة! 🛍️` : `"${title}" added to cart! 🛍️`);
            }}
            className="btn btn-primary btn-lg w-full sm:w-auto"
          >
            {t("addToCart")}
          </button>

          {variants.length > 1 && (
            <div>
              <h3 className="font-semibold mb-2">
                {t("otherColors")}
                <span className="text-base-content/50 text-sm ms-2">- {color || t("black")}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const vColor = lang === "en" && v.color_en ? v.color_en : v.color;
                  return (
                    <button
                      key={v.id}
                      onClick={() => selectColor(v)}
                      className={`tooltip tooltip-top ${v.id === active.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      data-tip={vColor}
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-base-300 shadow-sm" style={{ backgroundColor: colorMap[v.color] || "#ccc" }} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {showImage && lightboxContent && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer" onClick={() => setShowImage(false)}>
          {lightboxContent}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
