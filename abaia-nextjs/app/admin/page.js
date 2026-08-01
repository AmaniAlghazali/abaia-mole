'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package, Users, Receipt, TrendingUp, Plus, Pencil, Trash2,
  X, Save, LayoutDashboard, AlertCircle, QrCode,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LangContext';

const colorKeys = ['أسود','أخضر','أحمر','أزرق','أبيض','بيج','بنفسجي','وردي','رمادي','بني','كحلي','ذهبي','فضي','عاجي','موف','زيتي','كستنائي'];
const styles = [
  { ar: 'نص كلوش', en: 'Half Cloche' }, { ar: 'كلوش مزدوج', en: 'Double Cloche' },
  { ar: 'شيفون', en: 'Chiffon' }, { ar: 'بشت كامل', en: 'Full Bisht' },
  { ar: 'ربع بشت', en: 'Quarter Bisht' }, { ar: 'نص بشت', en: 'Half Bisht' },
  { ar: 'قصة الألف', en: 'A-Line Cut' },
];
const sizes = ['XS','S','M','L','XL','XXL',52,54,56,58,60];

const EMPTY_PRODUCT = {
  title: '', title_en: '', description: '', description_en: '',
  price: '', quantity: '', size: 'M', color: 'أسود', color_en: '',
  fabric_type: '', fabric_type_en: '', style: '', style_en: '',
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E3DB] p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className="text-sm text-[#7A7A7A] font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#1C1C1C]">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { t, lang } = useLang();
  const router = useRouter();
  const [tab, setTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token && user?.role === 'admin') fetchData();
  }, [token, user]);

  const fetchData = async () => {
    setFetchError(null);
    try {
      const [o, p, u] = await Promise.all([
        api.get('/api/orders', authHeaders),
        api.get('/api/products/all', authHeaders),
        api.get('/api/auth/users', authHeaders),
      ]);
      setOrders(o.data);
      setProducts(p.data);
      setUsers(u.data);
    } catch (err) {
      const s = err.response?.status;
      setFetchError(s === 401 || s === 403 ? t('errorFetch') : t('errorFetch'));
    }
  };

  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
  const totalVat = orders.reduce((s, o) => s + parseFloat(o.vat_amount || 0), 0);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'product') await api.delete(`/api/products/${deleteTarget.id}`, authHeaders);
      else await api.delete(`/api/auth/users/${deleteTarget.id}`, authHeaders);
      setDeleteTarget(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(newProduct).forEach(([k, v]) => fd.append(k, v));
      if (newImageFile) fd.append('image', newImageFile);
      await api.post('/api/products/add', fd, { headers: { Authorization: `Bearer ${token}` } });
      setAddingProduct(false);
      setNewProduct(EMPTY_PRODUCT);
      setNewImageFile(null);
      setNewImagePreview(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Add failed'); }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(editingProduct).forEach(([k, v]) => {
        if (!['id','created_at','order_items'].includes(k)) fd.append(k, v ?? '');
      });
      if (editImageFile) fd.append('image', editImageFile);
      await api.put(`/api/products/${editingProduct.id}`, fd, { headers: { Authorization: `Bearer ${token}` } });
      setEditingProduct(null);
      setEditImageFile(null);
      setEditImagePreview(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Update failed'); }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/auth/users/${editingUser.id}`, { name: editingUser.name, email: editingUser.email, role: editingUser.role }, authHeaders);
      setEditingUser(null);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Update failed'); }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-[#B8963E]/30 border-t-[#B8963E] rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: 'products', label: t('products'), icon: Package, count: products.length },
    { key: 'users', label: t('users'), icon: Users, count: users.length },
    { key: 'orders', label: t('orders'), icon: Receipt, count: orders.length },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={20} className="text-[#B8963E]" />
              <h1 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">{t('dashboardTitle')}</h1>
            </div>
            <p className="text-sm text-[#7A7A7A]">
              {t('welcome')}, {user?.name}
            </p>
          </div>
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}&bgcolor=ffffff&color=1a1a1a`} alt="QR" className="w-14 h-14 rounded-lg border border-[#E8E3DB] hidden sm:block" />
        </div>

        {/* Error */}
        {fetchError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-sm text-red-600">
            <AlertCircle size={16} className="shrink-0" />
            {fetchError}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard icon={TrendingUp} label={t('totalRevenue')} value={`${Number(totalRevenue).toLocaleString()} ${t('sar')}`} color="bg-[#B8963E]" />
          <StatCard icon={Receipt} label={t('totalVat')} value={`${Number(totalVat).toLocaleString()} ${t('sar')}`} color="bg-amber-500" />
          <StatCard icon={Package} label={t('totalProducts')} value={products.length} color="bg-blue-500" />
          <StatCard icon={Users} label={t('totalUsers')} value={users.length} color="bg-purple-500" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-[#E8E3DB] overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[#E8E3DB]">
            {tabs.map((tb) => {
              const Icon = tb.icon;
              return (
                <button
                  key={tb.key}
                  onClick={() => setTab(tb.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                    tab === tb.key
                      ? 'text-[#B8963E] border-b-2 border-[#B8963E] bg-[#B8963E]/3'
                      : 'text-[#7A7A7A] hover:text-[#2D2D2D] hover:bg-[#FAFAF8]'
                  }`}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{tb.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === tb.key ? 'bg-[#B8963E]/10 text-[#B8963E]' : 'bg-[#F0EDE8] text-[#7A7A7A]'}`}>
                    {tb.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Products Tab */}
          {tab === 'products' && (
            <div>
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E3DB]">
                <h2 className="font-semibold text-[#1C1C1C]">{t('products')}</h2>
                <button
                  onClick={() => setAddingProduct(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#B8963E] text-white rounded-xl text-sm font-medium hover:bg-[#8B6914] transition-colors"
                >
                  <Plus size={15} />
                  {t('addProduct')}
                </button>
              </div>

              {/* Desktop table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAFAF8] border-b border-[#E8E3DB]">
                    <tr>
                      <th className="text-start px-5 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">#</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('image')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('name')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider hidden md:table-cell">{t('price')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider hidden md:table-cell">{t('qty')}</th>
                      <th className="px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider text-center">{t('edit')}</th>
                      <th className="px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider text-center">{t('del')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E3DB]">
                    {products.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-[#7A7A7A]">{t('noProducts2')}</td></tr>
                    ) : products.map((p, i) => (
                      <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-[#7A7A7A]">{i + 1}</td>
                        <td className="px-3 py-3">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-10 h-12 object-cover rounded-lg" />
                          ) : (
                            <div className="w-10 h-12 rounded-lg bg-[#F5EDD8] flex items-center justify-center text-lg">👗</div>
                          )}
                        </td>
                        <td className="px-3 py-3 font-medium text-[#1C1C1C]">{p.title}</td>
                        <td className="px-3 py-3 hidden md:table-cell text-[#B8963E] font-semibold">{Number(p.price).toLocaleString()} {t('sar')}</td>
                        <td className="px-3 py-3 hidden md:table-cell">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {p.quantity}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button onClick={() => { setEditingProduct({ ...p }); setEditImageFile(null); setEditImagePreview(null); }} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors">
                            <Pencil size={15} />
                          </button>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button onClick={() => setDeleteTarget({ type: 'product', id: p.id, name: p.title })} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {tab === 'users' && (
            <div>
              <div className="px-5 py-4 border-b border-[#E8E3DB]">
                <h2 className="font-semibold text-[#1C1C1C]">{t('users')}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAFAF8] border-b border-[#E8E3DB]">
                    <tr>
                      <th className="text-start px-5 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">#</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('name')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider hidden sm:table-cell">{t('email')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('role')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider hidden md:table-cell">{t('registeredAt')}</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('edit')}</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('del')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E3DB]">
                    {users.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-12 text-[#7A7A7A]">{t('noUsers')}</td></tr>
                    ) : users.map((u, i) => (
                      <tr key={u.id} className="hover:bg-[#FAFAF8] transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-[#7A7A7A]">{i + 1}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            {u.profile_pic ? (
                              <img src={u.profile_pic} alt="" className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#F5EDD8] flex items-center justify-center text-xs font-bold text-[#B8963E]">
                                {u.name?.[0] || '?'}
                              </div>
                            )}
                            <span className="font-medium text-[#1C1C1C]">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-[#7A7A7A] hidden sm:table-cell">{u.email}</td>
                        <td className="px-3 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-[#B8963E]/10 text-[#B8963E]' : 'bg-[#F0EDE8] text-[#7A7A7A]'}`}>
                            {u.role === 'admin' ? t('admin') : t('customer')}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-[#7A7A7A] text-xs hidden md:table-cell">
                          {new Date(u.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button onClick={() => setEditingUser({ ...u })} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors">
                            <Pencil size={15} />
                          </button>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button onClick={() => setDeleteTarget({ type: 'user', id: u.id, name: u.name })} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div>
              <div className="px-5 py-4 border-b border-[#E8E3DB]">
                <h2 className="font-semibold text-[#1C1C1C]">{t('orders')}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAFAF8] border-b border-[#E8E3DB]">
                    <tr>
                      <th className="text-start px-5 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('invoiceNo')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('date')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider hidden sm:table-cell">{t('payment')}</th>
                      <th className="text-start px-3 py-3 text-xs font-semibold text-[#7A7A7A] uppercase tracking-wider">{t('amount')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E3DB]">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-12 text-[#7A7A7A]">{t('noOrders')}</td></tr>
                    ) : orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAFAF8] transition-colors">
                        <td className="px-5 py-3 font-mono font-bold text-[#1C1C1C]">#{o.id}</td>
                        <td className="px-3 py-3 text-[#7A7A7A] text-xs">
                          {new Date(o.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
                        </td>
                        <td className="px-3 py-3 text-[#7A7A7A] hidden sm:table-cell">{o.payment_method}</td>
                        <td className="px-3 py-3 font-bold text-[#B8963E]">{Number(o.total_amount).toLocaleString()} {t('sar')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {addingProduct && (
        <Modal title={t('addProduct')} onClose={() => { setAddingProduct(false); setNewProduct(EMPTY_PRODUCT); setNewImageFile(null); setNewImagePreview(null); }}>
          <form onSubmit={handleAddProduct} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('titleAr')}><input className={inputCls} value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} required /></Field>
              <Field label={t('titleEn')}><input className={inputCls} value={newProduct.title_en} onChange={(e) => setNewProduct({ ...newProduct, title_en: e.target.value })} /></Field>
              <Field label={t('price')} className="col-span-1"><input type="number" className={inputCls} value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required /></Field>
              <Field label={t('qty')} className="col-span-1"><input type="number" className={inputCls} value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} required /></Field>
              <Field label={t('color')}>
                <select className={inputCls} value={newProduct.color} onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}>
                  {colorKeys.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={t('size')}>
                <select className={inputCls} value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}>
                  {sizes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t('fabricAr')}><input className={inputCls} value={newProduct.fabric_type} onChange={(e) => setNewProduct({ ...newProduct, fabric_type: e.target.value })} /></Field>
              <Field label={t('fabricEn')}><input className={inputCls} value={newProduct.fabric_type_en} onChange={(e) => setNewProduct({ ...newProduct, fabric_type_en: e.target.value })} /></Field>
              <Field label={t('style')} className="col-span-2">
                <select className={inputCls} value={newProduct.style} onChange={(e) => { const s = styles.find((x) => x.ar === e.target.value); setNewProduct({ ...newProduct, style: e.target.value, style_en: s?.en || '' }); }}>
                  <option value="">{t('selectStyle')}</option>
                  {styles.map((s) => <option key={s.ar} value={s.ar}>{s.ar}</option>)}
                </select>
              </Field>
            </div>
            <ImageUpload preview={newImagePreview} onChange={(f) => { setNewImageFile(f); setNewImagePreview(f ? URL.createObjectURL(f) : null); }} />
            <ModalActions onCancel={() => { setAddingProduct(false); setNewProduct(EMPTY_PRODUCT); setNewImageFile(null); setNewImagePreview(null); }} />
          </form>
        </Modal>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <Modal title={t('editProduct')} onClose={() => setEditingProduct(null)}>
          <form onSubmit={handleEditProduct} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('titleAr')} className="col-span-2"><input className={inputCls} value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} required /></Field>
              <Field label={t('price')}><input type="number" className={inputCls} value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} required /></Field>
              <Field label={t('qty')}><input type="number" className={inputCls} value={editingProduct.quantity} onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })} required /></Field>
              <Field label={t('color')}>
                <select className={inputCls} value={editingProduct.color} onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}>
                  {colorKeys.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label={t('size')}>
                <select className={inputCls} value={editingProduct.size} onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}>
                  {sizes.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <ImageUpload preview={editImagePreview || editingProduct.image_url} onChange={(f) => { setEditImageFile(f); setEditImagePreview(f ? URL.createObjectURL(f) : null); }} />
            <ModalActions onCancel={() => setEditingProduct(null)} />
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <Modal title={t('edit') + ' ' + t('users')} onClose={() => setEditingUser(null)}>
          <form onSubmit={handleEditUser} className="space-y-3">
            <Field label={t('name')}><input className={inputCls} value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required /></Field>
            <Field label={t('email')}><input type="email" className={inputCls} value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required /></Field>
            <Field label={t('role')}>
              <select className={inputCls} value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                <option value="customer">{t('customer')}</option>
                <option value="admin">{t('admin')}</option>
              </select>
            </Field>
            <ModalActions onCancel={() => setEditingUser(null)} />
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <Modal title={t('confirmDelete')} onClose={() => setDeleteTarget(null)} size="sm">
          <p className="text-sm text-[#7A7A7A] mb-1">{t('deleteConfirmMsg')}</p>
          <p className="font-semibold text-[#1C1C1C] mb-6">"{deleteTarget.name}"</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-[#E8E3DB] text-sm font-medium text-[#7A7A7A] hover:border-[#2D2D2D] transition-colors">{t('cancel')}</button>
            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
              <Trash2 size={15} /> {t('del')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// — Shared modal components —

const inputCls = 'w-full px-3 py-2 rounded-xl border border-[#E8E3DB] text-sm text-[#1C1C1C] bg-[#FAFAF8] focus:outline-none focus:border-[#B8963E] focus:ring-2 focus:ring-[#B8963E]/15 transition-all';

function Field({ label, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-[#7A7A7A] mb-1">{label}</label>
      {children}
    </div>
  );
}

function ImageUpload({ preview, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#7A7A7A] mb-1">Image</label>
      <input type="file" accept="image/*" className="w-full text-xs text-[#7A7A7A] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#B8963E]/10 file:text-[#B8963E] hover:file:bg-[#B8963E]/20 transition-colors" onChange={(e) => onChange(e.target.files[0] || null)} />
      {preview && <img src={preview} alt="" className="mt-2 w-16 h-20 object-cover rounded-xl border border-[#E8E3DB]" />}
    </div>
  );
}

function ModalActions({ onCancel }) {
  const { t } = useLang();
  return (
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-[#E8E3DB] text-sm font-medium text-[#7A7A7A] hover:border-[#2D2D2D] transition-colors">{t('cancel')}</button>
      <button type="submit" className="flex-1 py-2.5 rounded-xl bg-[#B8963E] text-white text-sm font-medium hover:bg-[#8B6914] transition-colors flex items-center justify-center gap-2">
        <Save size={14} /> {t('save')}
      </button>
    </div>
  );
}

function Modal({ title, children, onClose, size = 'md' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl border border-[#E8E3DB] w-full fade-up ${size === 'sm' ? 'max-w-sm' : 'max-w-lg'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E3DB]">
          <h3 className="font-bold text-[#1C1C1C]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5EDD8] transition-colors text-[#7A7A7A]">
            <X size={17} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
