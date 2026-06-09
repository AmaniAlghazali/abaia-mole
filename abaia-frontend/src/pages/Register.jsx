import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft, Crown, Eye, EyeOff } from "lucide-react";
import api from "../utils/api";
import { useLang } from "../context/LangContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { t, lang } = useLang();
  const navigate = useNavigate();

  const pwRules = [
    { label: t("ruleLength"), test: (v) => v.length >= 8 },
    { label: t("ruleUpper"), test: (v) => /[A-Z]/.test(v) },
    { label: t("ruleLower"), test: (v) => /[a-z]/.test(v) },
    { label: t("ruleNumber"), test: (v) => /[0-9]/.test(v) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/api/auth/register", { name, email, password, role: "customer" });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || t("errorRegister"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-8 bg-gradient-to-b from-base-200 to-base-300">
      <div className="card bg-base-100 shadow-lg border border-base-200/50 w-full max-w-sm">
        <div className="card-body p-5 sm:p-7">
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="text-warning" size={24} />
            </div>
            <h2 className="card-title text-lg sm:text-xl justify-center">{t("registerTitle")}</h2>
            <p className="text-xs sm:text-sm text-base-content/50 mt-1">{t("registerSubtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
              <label className="label py-1"><span className="label-text text-xs">{t("fullName")}</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="input input-bordered input-sm sm:input-md" required />
            </div>
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
              <ul className="mt-2 space-y-1">
                {pwRules.map((rule, i) => (
                  <li key={i} className={`text-xs flex items-center gap-1.5 ${rule.test(password) ? "text-success" : "text-base-content/40"}`}>
                    <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[8px] ${rule.test(password) ? "bg-success/20" : "bg-base-200"}`}>
                      {rule.test(password) ? "✓" : ""}
                    </span>
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
            {error && <p className="text-error text-xs">{error}</p>}
            <button type="submit" disabled={loading || !pwRules.every((r) => r.test(password))}
              className="btn btn-primary btn-sm sm:btn-md w-full gap-2 mt-2">
              {loading ? <span className="loading loading-spinner loading-xs" /> : <UserPlus size={16} />}
              {loading ? t("creatingAccount") : t("createAccount")}
            </button>
          </form>

          <div className="text-center mt-3 text-xs sm:text-sm">
            <span className="text-base-content/50">{t("haveAccount")}</span>{" "}
            <Link to="/login" className="link link-primary">{t("login")}</Link>
          </div>

          <Link to="/" className="btn btn-ghost btn-xs sm:btn-sm gap-1 mt-2 text-base-content/50">
            <ArrowLeft size={14} /> {t("backToStore")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
