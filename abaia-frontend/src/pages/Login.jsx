import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { Crown, LogIn, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t("loginFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-lg w-full max-w-sm">
        <div className="card-body p-6 sm:p-8">
          <div className="text-center mb-6">
            <Crown className="text-warning mx-auto mb-2" size={36} />
            <h2 className="text-2xl font-bold">{t("loginTitle")}</h2>
            <p className="text-sm text-base-content/60 mt-1">
              {t("loginSubtitle")}
            </p>
          </div>

          {error && (
            <div className="alert alert-error text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("email")}</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("password")}</span>
              </label>
              <div className="join w-full">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full join-item"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="btn btn-outline join-item px-3"
                  tabIndex={-1}
                >
                  {showPwd ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-warning w-full gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <LogIn size={18} />
              )}
              {submitting ? t("loggingIn") : t("loginTitle")}
            </button>
          </form>

          <div className="text-center mt-4 text-sm">
            <span className="text-base-content/60">{t("noAccount")} </span>
            <Link to="/register" className="link text-primary">
              {t("createAccount")}
            </Link>
          </div>
          <div className="text-center mt-2">
            <Link to="/" className="link text-sm text-base-content/40">
              {t("backToStore")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
