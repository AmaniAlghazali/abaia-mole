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
  Store,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

const Navbar = ({ totalItems }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, toggleLang, lang } = useLang();

  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="navbar bg-base-100/90 backdrop-blur-md shadow-sm border-b border-base-200 px-1 sm:px-6 lg:px-8 sticky top-0 z-50 min-h-12 sm:min-h-16 overflow-hidden">
      <div className="navbar-start">
        <button
          className="btn btn-ghost btn-xs sm:btn-sm lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
        <Link to="/" className="btn btn-ghost text-xl font-bold gap-2 px-2 hidden sm:flex">
          <Crown className="text-warning" size={20} />
          <span>{t("brand")}</span>
        </Link>
      </div>

      <div className="navbar-center sm:hidden">
        <Link to="/" className="flex items-center">
          <Crown className="text-warning" size={16} />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li><Link to="/" className="text-base">{t("home")}</Link></li>
          <li><Link to="/" className="text-base">{t("allAbayas")}</Link></li>
        </ul>
      </div>

      <div className="navbar-end gap-0">
        <button onClick={toggleLang} className="btn btn-ghost btn-xs sm:btn-sm btn-square" title={lang === "ar" ? "English" : "العربية"}>
          <Languages size={14} />
          <span className="hidden sm:inline text-xs font-bold">{lang === "ar" ? "EN" : "AR"}</span>
        </button>

        {!user && (
          <>
            <Link to="/register" className="btn btn-ghost btn-xs sm:btn-sm btn-square hidden sm:inline-flex">
              <UserPlus size={14} />
            </Link>
            <Link to="/login" className="btn btn-ghost btn-xs sm:btn-sm btn-square hidden sm:inline-flex">
              <LogIn size={14} />
            </Link>
          </>
        )}

        <Link to="/cart" className="btn btn-ghost btn-xs sm:btn-sm btn-square relative" title={t("cart")}>
          <ShoppingBag size={16} />
          {totalItems > 0 && (
            <span className="badge badge-error badge-xs absolute -top-0.5 -right-0.5 text-white">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Link>

        {user && (
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-xs sm:btn-sm px-1 sm:px-3 gap-1 sm:gap-2">
              {user.profile_pic ? (
                <img src={user.profile_pic} alt="" className="w-4 h-4 sm:w-6 sm:h-6 rounded-full object-cover" />
              ) : (
                <User size={14} />
              )}
              <span className="hidden sm:inline text-sm truncate max-w-24">{user.name}</span>
            </button>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-200 p-2 w-48 mt-2 z-50">
              {user.role === "admin" && (
                <li><Link to="/admin" className="gap-2"><BarChart2 size={16} />{t("dashboard")}</Link></li>
              )}
              <li><button onClick={logout} className="gap-2 text-error"><LogOut size={16} />{t("logout")}</button></li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-14 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="relative bg-base-100/95 backdrop-blur-md w-72 h-full shadow-xl flex flex-col p-5 gap-1">
            <Link to="/" className="btn btn-ghost justify-start text-lg gap-3">
              <Store size={20} /> {t("home")}
            </Link>
            <Link to="/" className="btn btn-ghost justify-start text-lg gap-3">
              <Crown size={20} /> {t("allAbayas")}
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="btn btn-ghost justify-start text-lg gap-3 text-warning">
                <BarChart2 size={20} /> {t("dashboard")}
              </Link>
            )}
            <hr className="border-base-300 my-3" />
            <button onClick={() => { toggleLang(); setMenuOpen(false); }} className="btn btn-ghost justify-start text-lg gap-3">
              <Languages size={20} /> {lang === "ar" ? "English" : "العربية"}
            </button>
            {user ? (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="btn btn-ghost justify-start text-lg gap-3 text-error mt-2">
                <LogOut size={20} /> {t("logout")}
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-ghost justify-start text-lg gap-3">
                  <LogIn size={20} /> {t("login")}
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-ghost justify-start text-lg gap-3">
                  <UserPlus size={20} /> {t("register")}
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
