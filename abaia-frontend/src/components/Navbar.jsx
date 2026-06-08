import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  BarChart2,
  Crown,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  UserPlus,
  Languages,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

const Navbar = ({ totalItems }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, toggleLang, lang } = useLang();

  const isActive = (path) =>
    location.pathname === path
      ? "text-base font-semibold text-primary"
      : "text-base";

  return (
    <div className="navbar bg-base-100 shadow-sm border-b border-base-200 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <button
          className="btn btn-ghost btn-sm lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Link
          to="/"
          className="btn btn-ghost text-lg sm:text-xl font-bold gap-2 px-2"
        >
          <Crown className="text-warning" size={22} />
          <span>{t("brand")}</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link to="/" className={isActive("/")}>
              {t("home")}
            </Link>
          </li>
          <li>
            <Link to="/" className={isActive("/")}>
              {t("allAbayas")}
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-1">
        <button
          onClick={toggleLang}
          className="btn btn-ghost btn-sm gap-1"
          title={lang === "ar" ? "English" : "العربية"}
        >
          <Languages size={18} />
          <span className="text-xs font-bold">{lang === "ar" ? "EN" : "ع"}</span>
        </button>

        {!user && (
          <>
            <Link
              to="/register"
              className="btn btn-ghost btn-sm gap-1 hidden sm:flex"
            >
              <UserPlus size={18} />
              {t("register")}
            </Link>
            <Link to="/login" className="btn btn-ghost btn-sm gap-1">
              <LogIn size={18} />
              <span className="hidden sm:inline">{t("login")}</span>
            </Link>
          </>
        )}

        <Link
          to="/cart"
          className="btn btn-ghost btn-circle relative"
          title={t("cart")}
        >
          <ShoppingBag size={22} />
          {totalItems > 0 && (
            <span className="badge badge-error badge-xs absolute -top-1 -right-1 text-white">
              {totalItems}
            </span>
          )}
        </Link>

        {user && (
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-sm gap-2">
              {user.profile_pic ? (
                <img src={user.profile_pic} alt="" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User size={18} />
              )}
              <span className="hidden sm:inline text-sm truncate max-w-24">
                {user.name}
              </span>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box shadow-sm border border-base-200 p-2 w-48 mt-2"
            >
              {user.role === "admin" && (
                <li>
                  <Link to="/admin" className="gap-2">
                    <BarChart2 size={16} />
                    {t("dashboard")}
                  </Link>
                </li>
              )}
              <li>
                <button onClick={logout} className="gap-2 text-error">
                  <LogOut size={16} />
                  {t("logout")}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative bg-base-100 w-64 h-full shadow-lg flex flex-col p-4 gap-2">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="btn btn-ghost justify-start text-lg"
            >
              {t("home")}
            </Link>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="btn btn-ghost justify-start text-lg"
            >
              {t("allAbayas")}
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="btn btn-ghost justify-start text-lg text-warning"
              >
                <BarChart2 size={18} />
                {t("dashboard")}
              </Link>
            )}
            <button
              onClick={() => { toggleLang(); setMenuOpen(false); }}
              className="btn btn-ghost justify-start text-lg"
            >
              <Languages size={18} />
              {lang === "ar" ? "English" : "العربية"}
            </button>
            <hr className="border-base-300 my-2" />
            {user ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="btn btn-ghost justify-start text-lg text-error"
              >
                <LogOut size={18} />
                {t("logout")} ({user.name})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost justify-start text-lg"
                >
                  <LogIn size={18} />
                  {t("login")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="btn btn-ghost justify-start text-lg"
                >
                  <UserPlus size={18} />
                  {t("register")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
