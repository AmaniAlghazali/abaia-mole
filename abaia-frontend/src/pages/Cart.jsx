import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useLang } from "../context/LangContext";
import { ShoppingCart, ArrowLeft, Trash2, Minus, Plus, CreditCard, ShoppingBag } from "lucide-react";

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const { t, lang } = useLang();

  const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subTotal * 0.15;
  const total = subTotal + vat;

  const handleRemove = (productId) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const handleQuantityChange = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const response = await api.post("/api/orders/create", {
        user_id: null,
        payment_method: "Mada",
        items: cart,
      });
      alert(response.data.message);
      setCart([]);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || t("errorOrder"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart size={24} className="text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold">{t("shoppingCart")}</h2>
          {cart.length > 0 && (
            <span className="badge badge-primary badge-sm">{cart.length}</span>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="text-7xl mb-6 opacity-20">🛒</div>
            <p className="text-base-content/60 text-lg mb-6">{t("emptyCart")}</p>
            <Link to="/" className="btn btn-primary btn-lg gap-2">
              <ShoppingBag size={20} /> {t("backToShop")}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex-1 space-y-3">
              {cart.map((item) => (
                <div key={item.product_id} className="card bg-base-100 shadow-sm border border-base-200/50">
                  <div className="card-body p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base truncate">
                          {lang === "en" && item.title_en ? item.title_en : item.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-base-content/50">
                          {Number(item.price).toLocaleString()} {t("sar")} / {t("quantity").toLowerCase()} {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleQuantityChange(item.product_id, -1)}
                          className="btn btn-outline btn-xs btn-square">
                          <Minus size={12} />
                        </button>
                        <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.product_id, 1)}
                          className="btn btn-outline btn-xs btn-square">
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="font-bold text-sm sm:text-base min-w-[60px] text-end">
                        {(item.price * item.quantity).toLocaleString()} {t("sar")}
                      </p>
                      <button onClick={() => handleRemove(item.product_id)}
                        className="btn btn-ghost btn-xs btn-square text-error">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-80">
              <div className="card bg-base-100 shadow-sm border border-base-200/50 sticky top-24">
                <div className="card-body p-4 sm:p-5">
                  <h3 className="card-title text-base sm:text-lg mb-3">{t("orderSummary")}</h3>
                  <hr className="border-base-200" />
                  <div className="space-y-2 mt-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-base-content/60">{t("subtotal")}:</span>
                      <span className="font-medium">{subTotal.toLocaleString()} {t("sar")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/60">{t("vat")} (15%):</span>
                      <span className="font-medium">{vat.toLocaleString()} {t("sar")}</span>
                    </div>
                  </div>
                  <hr className="border-base-200 my-3" />
                  <div className="flex justify-between font-bold text-lg text-error mb-4">
                    <span>{t("total")}:</span>
                    <span>{total.toLocaleString()} {t("sar")}</span>
                  </div>
                  <button onClick={handleCheckout} className="btn btn-primary w-full gap-2">
                    <CreditCard size={18} /> {t("checkout")}
                  </button>
                  <Link to="/" className="btn btn-ghost btn-sm w-full mt-2 gap-1">
                    <ArrowLeft size={16} /> {t("backToShop")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
