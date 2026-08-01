'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag, Crown, Menu, X, LogOut, User, Languages,
  LayoutDashboard, ChevronDown, Package, Mail, Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLang } from '@/context/LangContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { t, toggleLang, lang } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserDropOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href) => pathname === href;

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E8E3DB]' : 'bg-white border-b border-[#E8E3DB]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-[#B8963E]/10 flex items-center justify-center group-hover:bg-[#B8963E]/20 transition-colors">
                <Crown size={16} className="text-[#B8963E]" />
              </div>
              <span className="font-bold text-[#1C1C1C] text-sm sm:text-base tracking-wide hidden sm:block">
                {t('brand')}
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'text-[#B8963E] bg-[#B8963E]/8' : 'text-[#2D2D2D] hover:text-[#B8963E] hover:bg-[#B8963E]/5'}`}>
                {t('allAbayas')}
              </Link>
              <Link href="/about" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/about') ? 'text-[#B8963E] bg-[#B8963E]/8' : 'text-[#2D2D2D] hover:text-[#B8963E] hover:bg-[#B8963E]/5'}`}>
                {t('aboutUs')}
              </Link>
              <Link href="/contact" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/contact') ? 'text-[#B8963E] bg-[#B8963E]/8' : 'text-[#2D2D2D] hover:text-[#B8963E] hover:bg-[#B8963E]/5'}`}>
                {t('contactUs')}
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin') ? 'text-[#B8963E] bg-[#B8963E]/8' : 'text-[#2D2D2D] hover:text-[#B8963E] hover:bg-[#B8963E]/5'}`}>
                  {t('dashboard')}
                </Link>
              )}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Language toggle */}
              <button
                onClick={toggleLang}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-[#7A7A7A] hover:text-[#B8963E] hover:bg-[#B8963E]/5 transition-colors"
                title={lang === 'ar' ? 'English' : 'العربية'}
              >
                <Languages size={15} />
                <span className="text-xs font-bold">{lang === 'ar' ? 'EN' : 'AR'}</span>
              </button>

              {/* Cart */}
              <Link href="/cart" className="relative p-2.5 rounded-lg text-[#2D2D2D] hover:text-[#B8963E] hover:bg-[#B8963E]/5 transition-colors">
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute top-1 end-1 w-4 h-4 rounded-full bg-[#B8963E] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropOpen(!userDropOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#B8963E]/5 transition-colors"
                  >
                    {user.profile_pic ? (
                      <img src={user.profile_pic} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-[#B8963E]/30" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#B8963E]/15 flex items-center justify-center">
                        <User size={14} className="text-[#B8963E]" />
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-medium text-[#2D2D2D] max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown size={13} className={`text-[#7A7A7A] transition-transform ${userDropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserDropOpen(false)} />
                      <div className="absolute end-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#E8E3DB] py-2 z-50 fade-up">
                        <div className="px-4 py-2.5 border-b border-[#E8E3DB] mb-1">
                          <p className="text-xs text-[#7A7A7A]">{t('welcome')}</p>
                          <p className="text-sm font-semibold text-[#1C1C1C] truncate">{user.name}</p>
                        </div>
                        <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2D2D2D] hover:bg-[#B8963E]/5 hover:text-[#B8963E] transition-colors">
                          <Settings size={15} />
                          {t('myProfile')}
                        </Link>
                        {user.role === 'admin' && (
                          <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2D2D2D] hover:bg-[#B8963E]/5 hover:text-[#B8963E] transition-colors">
                            <LayoutDashboard size={15} />
                            {t('dashboard')}
                          </Link>
                        )}
                        <Link href="/cart" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2D2D2D] hover:bg-[#B8963E]/5 hover:text-[#B8963E] transition-colors">
                          <Package size={15} />
                          {t('cart')}
                        </Link>
                        <div className="border-t border-[#E8E3DB] mt-1 pt-1">
                          <button onClick={logout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut size={15} />
                            {t('logout')}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1">
                  <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium text-[#2D2D2D] hover:text-[#B8963E] hover:bg-[#B8963E]/5 transition-colors">
                    {t('login')}
                  </Link>
                  <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium bg-[#B8963E] text-white hover:bg-[#8B6914] transition-colors">
                    {t('register')}
                  </Link>
                </div>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2.5 rounded-lg text-[#2D2D2D] hover:bg-[#B8963E]/5 transition-colors md:hidden"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className={`absolute top-0 h-full w-72 bg-white shadow-2xl flex flex-col slide-in ${lang === 'ar' ? 'right-0' : 'left-0'}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E3DB]">
              <Link href="/" className="flex items-center gap-2">
                <Crown size={20} className="text-[#B8963E]" />
                <span className="font-bold text-[#1C1C1C]">{t('brand')}</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg hover:bg-[#F5EDD8] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* User info */}
            {user && (
              <div className="mx-4 my-3 p-3 bg-[#F5EDD8] rounded-xl flex items-center gap-3">
                {user.profile_pic ? (
                  <img src={user.profile_pic} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#B8963E]/20 flex items-center justify-center">
                    <User size={18} className="text-[#B8963E]" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1C1C1C] truncate">{user.name}</p>
                  <p className="text-xs text-[#7A7A7A] truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
              <Link href="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/') ? 'bg-[#B8963E]/10 text-[#B8963E]' : 'text-[#2D2D2D] hover:bg-[#F5EDD8]'}`}>
                <Package size={18} />
                {t('allAbayas')}
              </Link>
              <Link href="/about" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/about') ? 'bg-[#B8963E]/10 text-[#B8963E]' : 'text-[#2D2D2D] hover:bg-[#F5EDD8]'}`}>
                <Crown size={18} />
                {t('aboutUs')}
              </Link>
              <Link href="/contact" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/contact') ? 'bg-[#B8963E]/10 text-[#B8963E]' : 'text-[#2D2D2D] hover:bg-[#F5EDD8]'}`}>
                <Mail size={18} />
                {t('contactUs')}
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/admin') ? 'bg-[#B8963E]/10 text-[#B8963E]' : 'text-[#2D2D2D] hover:bg-[#F5EDD8]'}`}>
                  <LayoutDashboard size={18} />
                  {t('dashboard')}
                </Link>
              )}
              {user && (
                <Link href="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/profile') ? 'bg-[#B8963E]/10 text-[#B8963E]' : 'text-[#2D2D2D] hover:bg-[#F5EDD8]'}`}>
                  <Settings size={18} />
                  {t('myProfile')}
                </Link>
              )}
              <Link href="/cart" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive('/cart') ? 'bg-[#B8963E]/10 text-[#B8963E]' : 'text-[#2D2D2D] hover:bg-[#F5EDD8]'}`}>
                <ShoppingBag size={18} />
                {t('cart')}
                {totalItems > 0 && <span className="ms-auto bg-[#B8963E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{totalItems}</span>}
              </Link>
            </div>

            {/* Footer actions */}
            <div className="px-4 py-4 border-t border-[#E8E3DB] space-y-1">
              <button
                onClick={toggleLang}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#2D2D2D] hover:bg-[#F5EDD8] transition-colors"
              >
                <Languages size={18} />
                {lang === 'ar' ? 'English' : 'العربية'}
              </button>
              {!user ? (
                <>
                  <Link href="/login" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium border border-[#E8E3DB] text-[#2D2D2D] hover:border-[#B8963E] transition-colors">
                    {t('login')}
                  </Link>
                  <Link href="/register" className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium bg-[#B8963E] text-white hover:bg-[#8B6914] transition-colors">
                    {t('register')}
                  </Link>
                </>
              ) : (
                <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut size={18} />
                  {t('logout')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
