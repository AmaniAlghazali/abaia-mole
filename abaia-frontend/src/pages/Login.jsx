import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ArrowLeft, Crown, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useLang();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      setShowSuccess(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || t("loginFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8 bg-gradient-to-b from-base-200 to-base-300" style={{ textAlign: lang === "ar" ? "right" : "left" }}>
      <div className="card bg-base-100 shadow-lg border border-base-200/50 w-full max-w-sm">
        <div className="card-body p-5 sm:p-7">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="text-warning" size={24} />
            </div>
            <h2 className="card-title text-lg sm:text-xl justify-center">{t("loginTitle")}</h2>
            <p className="text-xs sm:text-sm text-base-content/50 mt-1">{t("loginSubtitle")}</p>
          </div>

          {showSuccess && (
            <div className="alert alert-success text-sm py-2 mb-3">✓ {t("loggingIn").replace("...", "")}...</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
              <label className="label py-1"><span className="label-text text-xs">{t("email")}</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered input-sm sm:input-md" required />
            </div>
            <div className="form-control">
              <label className="label py-1"><span className="label-text text-xs">{t("password")}</span></label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered input-sm sm:input-md w-full pr-10" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 end-0 px-3 flex items-center text-base-content/40 hover:text-base-content/70">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-error text-xs">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary btn-sm sm:btn-md w-full gap-2 mt-2">
              {loading ? <span className="loading loading-spinner loading-xs" /> : <LogIn size={16} />}
              {loading ? t("loggingIn") : t("login")}
            </button>
          </form>

          <div className="text-center mt-3 text-xs sm:text-sm">
            <span className="text-base-content/50">{t("noAccount")}</span>{" "}
            <Link to="/register" className="link link-primary">{t("register")}</Link>
          </div>

          <Link to="/" className="btn btn-ghost btn-xs sm:btn-sm gap-1 mt-2 text-base-content/50">
            <ArrowLeft size={14} /> {t("backToStore")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
