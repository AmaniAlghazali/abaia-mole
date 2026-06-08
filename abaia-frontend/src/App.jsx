import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import { LangProvider } from "./context/LangContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Dashboard from "./admin/Dashboard";

function App() {
  const [cart, setCart] = useState([]);
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ar");

  React.useEffect(() => {
    const handler = () => setLang(localStorage.getItem("lang") || "ar");
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exist = prevCart.find((item) => item.product_id === product.id);
      if (exist) {
        return prevCart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prevCart,
        {
          product_id: product.id,
          title: product.title,
          title_en: product.title_en,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <LangProvider>
      <AuthProvider>
        <div className="min-h-screen bg-base-200 flex flex-col">
          <Navbar totalItems={totalItems} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Shop addToCart={addToCart} />} />
              <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </LangProvider>
  );
}

const Footer = () => {
  const isAr = (localStorage.getItem("lang") || "ar") === "ar";
  return (
    <footer className="bg-base-100 border-t border-base-200 px-4 sm:px-6 lg:px-8 py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-base-content/50">
        <p>© {new Date().getFullYear()} {isAr ? "عبايتي المتميزة" : "My Premium Abaya"}. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</a>
          <a href="#" className="hover:text-primary transition-colors">{isAr ? "الشروط والأحكام" : "Terms & Conditions"}</a>
          <span className="text-base-content/20">|</span>
          <Crown size={14} className="text-warning" />
        </div>
      </div>
    </footer>
  );
};

export default App;
