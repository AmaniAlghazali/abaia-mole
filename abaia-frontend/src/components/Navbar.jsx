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

const NAV_LINKS = [
  { labelKey: "home", to: "/" },
  { labelKey: "allAbayas", to: "/" },
];

const Navbar = ({ totalItems }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t, toggleLang, lang } = useLang();

  const closeMenu = React.useCallback(() => setMenuOpen(false), []);

  React.useEffect(() => {
    closeMenu();
  }, [location.pathname, closeMenu]);

  React.useEffect(() => {
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
  }, [lang]);

  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md shadow-sm border-b border-base-200"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* Top row: brand + icons */}
        <div className="flex items-center justify-between px-2 sm:px-6 lg:px-8 h-14 sm:h-16">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              className="btn btn-ghost btn-sm sm:btn-md min-w-11 min-h-11 xl:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <Link
              to="/"
              className="btn btn-ghost text-lg sm:text-xl font-bold gap-1 sm:gap-2 px-1 sm:px-2"
            >
              <Crown className="text-warning" size={20} />
              <span className="hidden sm:inline">{t("brand")}</span>
            </Link>
            {/* Desktop nav inline */}
            <ul className="hidden xl:flex items-center gap-1 ms-4">
              {NAV_LINKS.map((l) => (
                <li key={l.labelKey}>
                  <Link
                    to={l.to}
                    className={`btn btn-ghost btn-sm h-9 text-sm font-medium ${
                      location.pathname === l.to ? "text-warning" : ""
                    }`}
                  >
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
              {user?.role === "admin" && (
                <li>
                  <Link
                    to="/admin"
                    className={`btn btn-ghost btn-sm h-9 text-sm font-medium ${
                      location.pathname.startsWith("/admin")
                        ? "text-warning"
                        : ""
                    }`}
                  >
                    {t("dashboard")}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="flex items-center gap-0">
            <button
              onClick={toggleLang}
              className="btn btn-ghost btn-sm sm:btn-md min-w-11 min-h-11"
              title={lang === "ar" ? "English" : "العربية"}
            >
              <Languages size={16} />
              <span className="hidden sm:inline text-xs font-bold ms-1">
                {lang === "ar" ? "EN" : "AR"}
              </span>
            </button>

            {!user && (
              <>
                <Link
                  to="/register"
                  className="btn btn-ghost btn-sm btn-square min-w-11 min-h-11 hidden sm:inline-flex"
                >
                  <UserPlus size={16} />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm btn-square min-w-11 min-h-11 hidden sm:inline-flex"
                >
                  <LogIn size={16} />
                </Link>
              </>
            )}

            <Link
              to="/cart"
              className="btn btn-ghost btn-sm sm:btn-md btn-square min-w-11 min-h-11 relative"
              title={t("cart")}
            >
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="badge badge-error badge-xs absolute -top-0.5 inset-0.5 text-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {user && (
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="btn btn-ghost btn-sm sm:btn-md min-h-11 px-1 sm:px-3 gap-1 sm:gap-2"
                >
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt=""
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="hidden sm:inline text-sm truncate max-w-24">
                    {user.name}
                  </span>
                </button>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box shadow-lg border border-base-200 p-2 w-48 mt-2 z-50"
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
        </div>

        {/* Bottom row: nav links — always visible below xl */}
        <div className="xl:hidden overflow-x-auto border-t border-base-200/50">
          <div className="flex items-center gap-1 px-2 sm:px-6 lg:px-8 py-1.5 min-h-10">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.labelKey}
                to={l.to}
                className={`btn btn-ghost btn-xs sm:btn-sm h-8 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full px-3 ${
                  location.pathname === l.to
                    ? "bg-warning/10 text-warning"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                {t(l.labelKey)}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`btn btn-ghost btn-xs sm:btn-sm h-8 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full px-3 ${
                  location.pathname.startsWith("/admin")
                    ? "bg-warning/10 text-warning"
                    : "text-base-content/70 hover:text-base-content"
                }`}
              >
                {t("dashboard")}
              </Link>
            )}
            <button
              onClick={toggleLang}
              className="btn btn-ghost btn-xs h-8 text-xs sm:text-sm font-medium whitespace-nowrap rounded-full px-3 sm:hidden text-base-content/70"
            >
              <Languages size={12} className="me-1" />
              {lang === "ar" ? "EN" : "AR"}
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar overlay — rendered OUTSIDE <nav> to avoid sticky clipping on iOS */}
      {menuOpen && (
        <div className="fixed inset-0 z-60 xl:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={closeMenu}
          />
          <div
            className={`fixed top-0 h-full w-72 sm:w-80 bg-base-100 shadow-2xl flex flex-col animate-slide-in ${
              lang === "ar" ? "right-0" : "left-0"
            }`}
            style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
          >
            <div className="flex items-center justify-between px-5 pb-3 border-b border-base-200">
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-bold"
                onClick={closeMenu}
              >
                <Crown className="text-warning" size={22} />
                <span>{t("brand")}</span>
              </Link>
              <button
                className="btn btn-ghost btn-sm btn-square min-w-11 min-h-11"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-base-200 transition-colors"
              >
                <Crown size={20} className="text-base-content/60" />
                {t("home")}
              </Link>
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-base-200 transition-colors"
              >
                <Crown size={20} className="text-base-content/60" />
                {t("allAbayas")}
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-base-200 transition-colors text-warning"
                >
                  <BarChart2 size={20} />
                  {t("dashboard")}
                </Link>
              )}
            </div>

            <div className="border-t border-base-200 p-4 space-y-1">
              {user ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-base-200/50 mb-2">
                  {user.profile_pic ? (
                    <img
                      src={user.profile_pic}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-base-content/50 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-base-200 transition-colors"
                  >
                    <LogIn size={20} className="text-base-content/60" />
                    {t("login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-base-200 transition-colors"
                  >
                    <UserPlus size={20} className="text-base-content/60" />
                    {t("register")}
                  </Link>
                </>
              )}

              <hr className="border-base-200 my-2" />

              <button
                onClick={() => {
                  toggleLang();
                  closeMenu();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-base-200 transition-colors w-full text-start"
              >
                <Languages size={20} className="text-base-content/60" />
                {lang === "ar" ? "English" : "العربية"}
              </button>

              {user && (
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium hover:bg-base-200 transition-colors w-full text-start text-error mt-1"
                >
                  <LogOut size={20} />
                  {t("logout")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
