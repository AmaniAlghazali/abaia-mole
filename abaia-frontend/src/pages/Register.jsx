import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useLang } from "../context/LangContext";
import { Crown, UserPlus, Eye, EyeOff, Check, X } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLang();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/api/auth/register", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || t("errorRegister"));
    } finally {
      setSubmitting(false);
    }
  };

  const rules = [
    { label: t("ruleLength"), test: (p) => p.length >= 8 },
    { label: t("ruleUpper"), test: (p) => /[A-Z]/.test(p) },
    { label: t("ruleLower"), test: (p) => /[a-z]/.test(p) },
    { label: t("ruleNumber"), test: (p) => /\d/.test(p) },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 shadow-lg w-full max-w-sm">
        <div className="card-body p-6 sm:p-8">
          <div className="text-center mb-6">
            <Crown className="text-warning mx-auto mb-2" size={36} />
            <h2 className="text-2xl font-bold">{t("registerTitle")}</h2>
            <p className="text-sm text-base-content/60 mt-1">
              {t("registerSubtitle")}
            </p>
          </div>

          {error && (
            <div className="alert alert-error text-sm mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("fullName")}</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t("name")}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">{t("email")}</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input input-bordered w-full join-item"
                  required
                  minLength={8}
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
              {form.password && (
                <ul className="mt-2 space-y-1">
                  {rules.map((r, i) => {
                    const ok = r.test(form.password);
                    return (
                      <li
                        key={i}
                        className={`flex items-center gap-2 text-xs ${ok ? "text-success" : "text-base-content/40"}`}
                      >
                        {ok ? (
                          <Check size={14} className="text-success" />
                        ) : (
                          <X size={14} />
                        )}
                        {r.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full gap-2"
              disabled={submitting || form.password.length < 8}
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <UserPlus size={18} />
              )}
              {submitting ? t("creatingAccount") : t("registerTitle")}
            </button>
          </form>

          <div className="text-center mt-4 text-sm">
            <span className="text-base-content/60">{t("haveAccount")} </span>
            <Link to="/login" className="link text-primary">
              {t("loginTitle")}
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

export default Register;
