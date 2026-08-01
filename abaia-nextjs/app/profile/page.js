'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, User, Camera, Lock, Check, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';
import api from '@/lib/api';

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loginWithToken } = useAuth();
  const { t } = useLang();

  const [activeTab, setActiveTab] = useState('info');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [saving, setSaving] = useState(false);
  const [successCode, setSuccessCode] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [pwMismatch, setPwMismatch] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    setName(user.name || '');
    setEmail(user.email || '');
  }, [user]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result);
      setPhotoBase64(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSuccessCode(null);
    setErrorCode(null);
    setPwMismatch(false);

    if (activeTab === 'security' && newPw && newPw !== confirmPw) {
      setPwMismatch(true);
      return;
    }

    setSaving(true);
    try {
      const payload = { name, email };
      if (activeTab === 'security' && newPw) {
        payload.currentPassword = currentPw;
        payload.newPassword = newPw;
      }
      if (activeTab === 'photo' && photoBase64) {
        payload.photoBase64 = photoBase64;
      }

      const res = await api.put('/api/auth/profile', payload);
      loginWithToken(res.data.token, res.data.user);
      setSuccessCode(res.data.code);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setPhotoBase64(null);
    } catch (err) {
      setErrorCode(err.response?.data?.code || 'ERROR');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const tabs = [
    { id: 'info', label: t('personalInfo'), icon: User },
    { id: 'photo', label: t('changePhoto'), icon: Camera },
    { id: 'security', label: t('security'), icon: Shield },
  ];

  const avatar = photoPreview || user.profile_pic;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#FAFAF8] px-4 py-10">
      <div className="max-w-2xl mx-auto fade-up">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-[#7A7A7A] hover:text-[#B8963E] transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          {t('backToShop')}
        </button>

        {/* Header card */}
        <div className="bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] rounded-2xl p-6 mb-6 flex items-center gap-5 text-white">
          <div className="relative shrink-0">
            {avatar ? (
              <img src={avatar} alt="" className="w-20 h-20 rounded-full object-cover ring-4 ring-[#B8963E]/40" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#B8963E]/20 flex items-center justify-center ring-4 ring-[#B8963E]/40">
                <User size={32} className="text-[#B8963E]" />
              </div>
            )}
            <div className="absolute -bottom-1 -end-1 w-7 h-7 bg-[#B8963E] rounded-full flex items-center justify-center ring-2 ring-[#1C1C1C]">
              <Crown size={13} className="text-white" />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold truncate">{user.name}</h1>
            <p className="text-sm text-white/60 truncate">{user.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#B8963E]/20 text-[#B8963E] text-xs font-medium border border-[#B8963E]/30">
              {t(user.role)}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-[#E8E3DB] rounded-xl p-1 mb-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSuccessCode(null); setErrorCode(null); setPwMismatch(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-[#B8963E] text-white shadow-sm'
                  : 'text-[#7A7A7A] hover:text-[#B8963E] hover:bg-[#B8963E]/5'
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E3DB] rounded-2xl shadow-sm p-6">
          {/* Alerts */}
          {successCode && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-5 text-sm text-green-700">
              <Check size={15} className="shrink-0" />
              {t(successCode)}
            </div>
          )}
          {(errorCode || pwMismatch) && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-600">
              <span className="shrink-0">⚠</span>
              {pwMismatch ? t('passwordMismatch') : t(errorCode)}
            </div>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">{t('fullName')}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">{t('email')}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              </div>
            </div>
          )}

          {/* Photo Tab */}
          {activeTab === 'photo' && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-5">
                {avatar ? (
                  <img src={avatar} alt="" className="w-32 h-32 rounded-full object-cover ring-4 ring-[#B8963E]/20" />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#F5EDD8] flex items-center justify-center ring-4 ring-[#B8963E]/20">
                    <User size={48} className="text-[#B8963E]" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-sm text-[#7A7A7A] mb-3">{t('choosePhoto')}</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-dashed border-[#B8963E]/40 text-sm font-medium text-[#B8963E] hover:bg-[#B8963E]/5 hover:border-[#B8963E] transition-all"
                  >
                    <Camera size={16} />
                    {t('choosePhoto')}
                  </button>
                </div>
              </div>
              {photoPreview && (
                <p className="text-xs text-center text-green-600 bg-green-50 border border-green-200 rounded-lg py-2">
                  ✓ {t('uploadPhoto')} — {t('saveChanges')}
                </p>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <p className="text-xs text-[#7A7A7A] bg-[#FAFAF8] border border-[#E8E3DB] rounded-lg px-3 py-2">
                {t('leaveBlankPassword')}
              </p>
              <div>
                <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">{t('currentPassword')}</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className={`${inputCls} pe-11`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 end-0 px-3.5 flex items-center text-[#7A7A7A] hover:text-[#B8963E]">
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">{t('newPassword')}</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPw} onChange={(e) => setNewPw(e.target.value)} className={`${inputCls} pe-11`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 end-0 px-3.5 flex items-center text-[#7A7A7A] hover:text-[#B8963E]">
                    {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#2D2D2D] mb-1.5">{t('confirmPassword')}</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className={`${inputCls} ${pwMismatch ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={saving || (activeTab === 'photo' && !photoBase64)}
            className="w-full mt-6 py-3 rounded-xl bg-[#B8963E] text-white font-semibold text-sm hover:bg-[#8B6914] transition-colors shadow-lg shadow-[#B8963E]/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {saving ? t('saving') : t('saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}
