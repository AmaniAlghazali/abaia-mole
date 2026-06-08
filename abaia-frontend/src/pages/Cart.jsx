import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useLang } from "../context/LangContext";

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const { t, lang } = useLang();

  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const vat = subTotal * 0.15;
  const total = subTotal;

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
    <div
      className="min-h-screen bg-base-200 px-4 sm:px-6 lg:px-8 py-8"
      style={{ textAlign: lang === "ar" ? "right" : "left" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t("shoppingCart")}</h2>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-base-content/60 mb-4">
            {t("emptyCart")}
          </p>
          <Link to="/" className="btn btn-primary">
            {t("backToShop")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-3">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="card bg-base-100 shadow-sm"
              >
                <div className="card-body p-4 sm:p-5 flex flex-row items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">
                      {lang === "en" && item.title_en ? item.title_en : item.title}
                    </h4>
                    <p className="text-sm text-base-content/60">{item.price} {t("sar")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.product_id, -1)}
                      className="btn btn-outline btn-xs"
                    >
                      -
                    </button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.product_id, 1)}
                      className="btn btn-outline btn-xs"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">
                      {(item.price * item.quantity).toFixed(2)} {t("sar")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product_id)}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-lg mb-2">{t("orderSummary")}</h3>
                <hr className="border-base-300" />
                <div className="flex justify-between text-sm mt-3">
                  <span>{t("subtotal")}:</span>
                  <span>{subTotal.toFixed(2)} {t("sar")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("vat")}:</span>
                  <span>{vat.toFixed(2)} {t("sar")}</span>
                </div>
                <hr className="border-base-300 my-3" />
                <div className="flex justify-between font-bold text-lg text-error">
                  <span>{t("total")}:</span>
                  <span>{total.toFixed(2)} {t("sar")}</span>
                </div>
                <button onClick={handleCheckout} className="btn btn-primary mt-4 w-full">
                  {t("checkout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
