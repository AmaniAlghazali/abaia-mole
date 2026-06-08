import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { Package, Users, Receipt, TrendingUp, Plus, Pencil, Trash2, X, Save } from "lucide-react";

const colorMap = {
  أسود: "#1a1a1a", أخضر: "#27ae60", أحمر: "#c0392b", أزرق: "#2c6fbb",
  أبيض: "#f5f5f5", بيج: "#e8d5b7", بنفسجي: "#8e44ad", وردي: "#e91e9f",
  رمادي: "#7f8c8d", بني: "#795548", كحلي: "#1a3a5c", ذهبي: "#d4a017",
  فضي: "#bdc3c7", عاجي: "#f5eedc", موف: "#ab47bc", ليلكي: "#7b1fa2",
  زيتي: "#4a6b3a", كستنائي: "#800020", "أزرق داكن": "#0a2351", زمردي: "#046307",
};
const colorKeys = Object.keys(colorMap);

const styles = [
  { ar: "نص كلوش", en: "Half Cloche" },
  { ar: "كلوش مزدوج", en: "Double Cloche" },
  { ar: "شيفون", en: "Chiffon" },
  { ar: "بشت كامل", en: "Full Bisht" },
  { ar: "ربع بشت", en: "Quarter Bisht" },
  { ar: "نص بشت", en: "Half Bisht" },
  { ar: "قصة الألف", en: "A-Line Cut" },
];
const sizes = ["XS", "S", "M", "L", "XL", "XXL", 52, 54, 56, 58, 60];

const Dashboard = () => {
  const { token } = useAuth();
  const { t, lang } = useLang();
  const [tab, setTab] = useState("products");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "", description: "", price: "", quantity: "", size: "M", color: "أسود",
    fabric_type: "", style: "", title_en: "", color_en: "", fabric_type_en: "", description_en: "", style_en: "", barcode: "",
  });
  const [newProductImageFile, setNewProductImageFile] = useState(null);
  const [newProductImagePreview, setNewProductImagePreview] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get("/api/orders", authHeaders),
        api.get("/api/products/all", authHeaders),
        api.get("/api/auth/users", authHeaders),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(t("errorFetchData"), error);
    }
  };

  const totalSales = orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
  const totalVat = orders.reduce((s, o) => s + parseFloat(o.vat_amount || 0), 0);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "product") {
        await api.delete(`/api/products/${deleteTarget.id}`, authHeaders);
      } else {
        await api.delete(`/api/auth/users/${deleteTarget.id}`, authHeaders);
      }
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const formData = new FormData();
      Object.entries(editingProduct).forEach(([k, v]) => {
        if (k !== "id" && k !== "created_at" && k !== "order_items" && v !== undefined) {
          formData.append(k, v === null ? "" : v);
        }
      });
      if (productImageFile) formData.append("image", productImageFile);
      await api.put(`/api/products/${editingProduct.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProduct(null);
      setProductImageFile(null);
      setProductImagePreview(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await api.put(`/api/auth/users/${editingUser.id}`, {
        name: editingUser.name, email: editingUser.email, role: editingUser.role, profile_pic: editingUser.profile_pic,
      }, authHeaders);
      setEditingUser(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([k, v]) => formData.append(k, v));
      if (newProductImageFile) formData.append("image", newProductImageFile);
      await api.post("/api/products/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddingProduct(false);
      setNewProductImageFile(null);
      setNewProductImagePreview(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Add failed");
    }
  };

  const openEditProduct = (product) => {
    setEditingProduct({ ...product });
    setProductImageFile(null);
    setProductImagePreview(null);
  };

  const openEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const tabs = [
    { key: "products", label: t("productsTab"), icon: Package },
    { key: "users", label: t("usersTab"), icon: Users },
    { key: "orders", label: t("ordersTab"), icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8" style={{ textAlign: lang === "ar" ? "right" : "left" }}>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-3xl font-bold">{t("dashboardTitle")}</h2>
          <p className="text-base-content/50 text-xs sm:text-sm mt-1">
            {lang === "ar" ? "مرحباً بك في نظام إدارة المتجر" : "Welcome to the store management system"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="stat bg-white dark:bg-base-100 shadow-sm rounded-xl border border-base-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-success/10 rounded-lg"><TrendingUp className="text-success" size={20} /></div>
              <div className="stat-title text-xs sm:text-sm font-medium">{t("totalRevenue")}</div>
            </div>
            <div className="stat-value text-xl sm:text-2xl text-success font-bold">{Number(totalSales).toLocaleString()} {t("sar")}</div>
          </div>
          <div className="stat bg-white dark:bg-base-100 shadow-sm rounded-xl border border-base-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-warning/10 rounded-lg"><Receipt className="text-warning" size={20} /></div>
              <div className="stat-title text-xs sm:text-sm font-medium">{t("totalVatLabel")}</div>
            </div>
            <div className="stat-value text-xl sm:text-2xl text-warning font-bold">{Number(totalVat).toLocaleString()} {t("sar")}</div>
          </div>
          <div className="stat bg-white dark:bg-base-100 shadow-sm rounded-xl border border-base-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-info/10 rounded-lg"><Receipt className="text-info" size={20} /></div>
              <div className="stat-title text-xs sm:text-sm font-medium">{t("totalInvoices")}</div>
            </div>
            <div className="stat-value text-xl sm:text-2xl text-info font-bold">{orders.length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-bordered mb-6 bg-white dark:bg-base-100 rounded-xl shadow-sm border border-base-200 p-1 overflow-x-auto">
          {tabs.map((tb) => {
            const Icon = tb.icon;
            return (
              <button key={tb.key} onClick={() => setTab(tb.key)}
                className={`tab tab-lg flex-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  tab === tb.key ? "tab-active bg-primary/10 text-primary" : "text-base-content/50 hover:text-base-content"
                }`}
              >
                <Icon size={16} className="me-1.5 inline" />
                {tb.label}
              </button>
            );
          })}
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div className="bg-white dark:bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-base-200">
              <h3 className="text-base sm:text-lg font-bold">{t("allProducts")} <span className="text-base-content/40 text-sm font-normal">({products.length})</span></h3>
              <button onClick={() => setAddingProduct(!addingProduct)} className="btn btn-primary btn-sm gap-1">
                <Plus size={16} /> {lang === "ar" ? "إضافة" : "Add"}
              </button>
            </div>

            {addingProduct && (
              <div className="p-4 sm:p-5 border-b border-base-200 bg-base-100">
                <h4 className="font-bold mb-3">{lang === "ar" ? "منتج جديد" : "New Product"}</h4>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" className="input input-bordered w-full input-sm sm:input-md" placeholder={t("titlePlaceholder")}
                    value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} required />
                  <input type="text" className="input input-bordered w-full input-sm sm:input-md" placeholder={t("englishTitlePlaceholder")}
                    value={newProduct.title_en} onChange={(e) => setNewProduct({ ...newProduct, title_en: e.target.value })} />
                  <div className="sm:col-span-2">
                    <textarea className="textarea textarea-bordered w-full text-sm" rows={2} placeholder={t("descPlaceholder")}
                      value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                  </div>
                  <input type="number" className="input input-bordered w-full input-sm sm:input-md" placeholder={t("pricePlaceholder")}
                    value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
                  <input type="number" className="input input-bordered w-full input-sm sm:input-md" placeholder={t("qtyPlaceholder")}
                    value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} required />
                  <select className="select select-bordered w-full select-sm sm:select-md" value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}>
                    {colorKeys.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="select select-bordered w-full select-sm sm:select-md" value={newProduct.size}
                    onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}>
                    {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="text" className="input input-bordered w-full input-sm sm:input-md" placeholder={t("fabricPlaceholder")}
                    value={newProduct.fabric_type} onChange={(e) => setNewProduct({ ...newProduct, fabric_type: e.target.value })} />
                  <select className="select select-bordered w-full select-sm sm:select-md" value={newProduct.style}
                    onChange={(e) => {
                      const selected = styles.find((s) => s.ar === e.target.value);
                      setNewProduct({ ...newProduct, style: e.target.value, style_en: selected ? selected.en : "" });
                    }}>
                    <option value="">{t("selectStyle")}</option>
                    {styles.map((s) => <option key={s.ar} value={s.ar}>{s.ar}</option>)}
                  </select>
                  <input type="text" className="input input-bordered w-full input-sm sm:input-md" placeholder={t("barcode")}
                    value={newProduct.barcode} onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })} />
                  <div className="sm:col-span-2">
                    <input type="file" accept="image/*" className="file-input file-input-bordered w-full file-input-sm sm:file-input-md"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setNewProductImageFile(file);
                        setNewProductImagePreview(file ? URL.createObjectURL(file) : null);
                      }} />
                    {newProductImagePreview && (
                      <img src={newProductImagePreview} alt="" className="mt-2 w-16 h-16 object-cover rounded-lg border" />
                    )}
                  </div>
                  <div className="sm:col-span-2 flex gap-3 pt-2">
                    <button type="submit" className="btn btn-primary btn-sm">{lang === "ar" ? "إضافة" : "Add"}</button>
                    <button type="button" onClick={() => { setAddingProduct(false); setNewProductImageFile(null); setNewProductImagePreview(null); }} className="btn btn-ghost btn-sm">{t("cancel")}</button>
                  </div>
                </form>
              </div>
            )}

            {/* Mobile: Card layout */}
            <div className="block sm:hidden divide-y divide-base-200">
              {products.length === 0 && (
                <div className="text-center py-10 text-base-content/30">{t("noProductsAdmin")}</div>
              )}
              {products.map((p) => (
                <div key={p.id} className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="w-14 h-14 rounded-lg object-cover shadow-sm" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-base-200 flex items-center justify-center text-xs text-base-content/30">{t("noImage")}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.title || "—"}</p>
                      <p className="text-xs text-base-content/50">{p.price} {t("sar")} • {t("qtyPlaceholder")}: {p.quantity}</p>
                      <p className="text-xs text-base-content/40">{t("size")}: {p.size} • {p.color}{p.barcode ? " • " + t("barcode") + ": " + p.barcode : ""}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEditProduct(p)} className="btn btn-ghost btn-xs btn-square text-info"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteTarget({ type: "product", id: p.id, name: p.title })} className="btn btn-ghost btn-xs btn-square text-error"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-base-content/50">
                    <th className="ps-5">#</th>
                    <th>{t("image")}</th>
                    <th>{lang === "ar" ? "الاسم" : "Title"}</th>
                    <th>{t("barcode")}</th>
                    <th>{t("pricePlaceholder")}</th>
                    <th>{t("qtyPlaceholder")}</th>
                    <th>{t("color")}</th>
                    <th>{t("size")}</th>
                    <th className="text-center">{t("edit")}</th>
                    <th className="text-center">{t("del")}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 && (
                    <tr><td colSpan={10} className="text-center py-10 text-base-content/30">{t("noProductsAdmin")}</td></tr>
                  )}
                  {products.map((p, i) => (
                    <tr key={p.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="ps-5 font-mono text-xs">{i + 1}</td>
                      <td>{p.image_url ? <img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" /> : <div className="w-12 h-12 rounded-lg bg-base-200 flex items-center justify-center text-xs text-base-content/30">{t("noImage")}</div>}</td>
                      <td className="font-medium">{p.title || "—"}</td>
                      <td className="font-mono text-xs">{p.barcode || "—"}</td>
                      <td className="font-mono">{p.price} {t("sar")}</td>
                      <td><span className={`badge badge-sm ${p.quantity > 0 ? "badge-success" : "badge-error"} gap-1`}>{p.quantity}</span></td>
                      <td><div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full border border-base-300" style={{ backgroundColor: colorMap[p.color] || "#ccc" }} /><span className="text-sm">{p.color}</span></div></td>
                      <td>{p.size}</td>
                      <td className="text-center"><button onClick={() => openEditProduct(p)} className="btn btn-ghost btn-xs btn-square text-info"><Pencil size={14} /></button></td>
                      <td className="text-center"><button onClick={() => setDeleteTarget({ type: "product", id: p.id, name: p.title })} className="btn btn-ghost btn-xs btn-square text-error"><Trash2 size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="bg-white dark:bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-base-200">
              <h3 className="text-base sm:text-lg font-bold">{t("allUsers")} <span className="text-base-content/40 text-sm font-normal">({users.length})</span></h3>
            </div>

            {/* Mobile: Card layout */}
            <div className="block sm:hidden divide-y divide-base-200">
              {users.length === 0 && <div className="text-center py-10 text-base-content/30">{t("noUsers")}</div>}
              {users.map((u) => (
                <div key={u.id} className="p-4 flex items-center gap-3">
                  {u.profile_pic ? <img src={u.profile_pic} alt="" className="w-10 h-10 rounded-full object-cover" />
                    : <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center text-sm text-base-content/30">{u.name?.[0] || "?"}</div>}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{u.name}</p>
                    <p className="text-xs text-base-content/50 truncate">{u.email}</p>
                    <span className={`badge badge-xs mt-1 ${u.role === "admin" ? "badge-primary" : "badge-ghost"}`}>{u.role === "admin" ? t("admin") : t("customer")}</span>
                  </div>
                  <button onClick={() => openEditUser(u)} className="btn btn-ghost btn-xs btn-square text-info"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTarget({ type: "user", id: u.id, name: u.name })} className="btn btn-ghost btn-xs btn-square text-error"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-base-content/50">
                    <th className="ps-5">#</th>
                    <th>{t("profile")}</th>
                    <th>{t("name")}</th>
                    <th>{t("email")}</th>
                    <th>{t("role")}</th>
                    <th>{t("registeredAt")}</th>
                    <th className="text-center">{t("edit")}</th>
                    <th className="text-center">{t("del")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && <tr><td colSpan={8} className="text-center py-10 text-base-content/30">{t("noUsers")}</td></tr>}
                  {users.map((u, i) => (
                    <tr key={u.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="ps-5 font-mono text-xs">{i + 1}</td>
                      <td>{u.profile_pic ? <img src={u.profile_pic} alt="" className="w-8 h-8 rounded-full object-cover" />
                        : <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-xs text-base-content/30">{u.name?.[0] || "?"}</div>}</td>
                      <td className="font-medium">{u.name}</td>
                      <td className="text-sm text-base-content/70">{u.email}</td>
                      <td><span className={`badge badge-sm ${u.role === "admin" ? "badge-primary" : "badge-ghost"}`}>{u.role === "admin" ? t("admin") : t("customer")}</span></td>
                      <td className="text-sm text-base-content/60">{new Date(u.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</td>
                      <td className="text-center"><button onClick={() => openEditUser(u)} className="btn btn-ghost btn-xs btn-square text-info"><Pencil size={14} /></button></td>
                      <td className="text-center"><button onClick={() => setDeleteTarget({ type: "user", id: u.id, name: u.name })} className="btn btn-ghost btn-xs btn-square text-error"><Trash2 size={14} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="bg-white dark:bg-base-100 rounded-xl shadow-sm border border-base-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-base-200">
              <h3 className="text-base sm:text-lg font-bold">{t("recentInvoices")} <span className="text-base-content/40 text-sm font-normal">({orders.length})</span></h3>
            </div>

            {/* Mobile: Card layout */}
            <div className="block sm:hidden divide-y divide-base-200">
              {orders.length === 0 && <div className="text-center py-10 text-base-content/30">{t("noInvoices")}</div>}
              {orders.map((order) => (
                <div key={order.id} className="p-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-bold">#{order.id}</span>
                    <span className="text-xs text-base-content/50">{new Date(order.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-base-content/50">{order.payment_method}</span>
                    <span className="font-bold text-success text-sm">{order.total_amount} {t("sar")}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-base-content/50">
                    <th className="ps-5">{t("invoiceNo")}</th>
                    <th>{t("date")}</th>
                    <th>{t("paymentMethod")}</th>
                    <th>{t("totalAmount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="ps-5 font-mono">#{order.id}</td>
                      <td>{new Date(order.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}</td>
                      <td>{order.payment_method}</td>
                      <td className="font-bold text-success">{order.total_amount} {t("sar")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        <dialog className={`modal ${deleteTarget ? "modal-open" : ""}`}>
          <div className="modal-box rounded-xl shadow-2xl">
            <h3 className="font-bold text-lg mb-2">{deleteTarget?.type === "product" ? t("deleteProduct") : t("deleteUser")}</h3>
            <p className="text-base-content/70">{deleteTarget?.type === "product" ? t("deleteConfirm") : t("deleteUserConfirm")}</p>
            {deleteTarget && <p className="font-semibold mt-2 text-lg">"{deleteTarget.name}"</p>}
            <div className="modal-action gap-3">
              <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost">{t("cancel")}</button>
              <button onClick={handleDelete} className="btn btn-error gap-1"><Trash2 size={16} /> {t("del")}</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setDeleteTarget(null)}><button>close</button></form>
        </dialog>

        {/* Edit Product Modal */}
        <dialog className={`modal ${editingProduct ? "modal-open" : ""}`}>
          <div className="modal-box rounded-xl shadow-2xl max-w-lg">
            <h3 className="font-bold text-lg mb-4">{t("editProduct")}</h3>
            {editingProduct && (
              <form onSubmit={handleEditProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <input type="text" className="input input-bordered w-full input-sm" placeholder={t("titlePlaceholder")}
                    value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} required />
                </div>
                <div className="sm:col-span-2">
                  <textarea className="textarea textarea-bordered w-full text-sm" rows={2} placeholder={t("descPlaceholder")}
                    value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                </div>
                <input type="number" className="input input-bordered w-full input-sm" placeholder={t("pricePlaceholder")}
                  value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} required />
                <input type="number" className="input input-bordered w-full input-sm" placeholder={t("qtyPlaceholder")}
                  value={editingProduct.quantity} onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })} required />
                <select className="select select-bordered w-full select-sm" value={editingProduct.color}
                  onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}>
                  {colorKeys.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="select select-bordered w-full select-sm" value={editingProduct.size}
                  onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}>
                  {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                  <input type="text" className="input input-bordered w-full input-sm" placeholder={t("barcode")}
                    value={editingProduct.barcode || ""} onChange={(e) => setEditingProduct({ ...editingProduct, barcode: e.target.value })} />
                  <input type="file" accept="image/*" className="file-input file-input-bordered w-full file-input-sm sm:col-span-2"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setProductImageFile(file);
                      setProductImagePreview(file ? URL.createObjectURL(file) : null);
                    }} />
                {(productImagePreview || editingProduct.image_url) && (
                  <div className="sm:col-span-2">
                    <img src={productImagePreview || editingProduct.image_url} alt="" className="w-14 h-14 object-cover rounded-lg border" />
                  </div>
                )}
                <div className="sm:col-span-2 flex gap-3 pt-2">
                  <button type="submit" className="btn btn-primary btn-sm gap-1"><Save size={16} /> {t("save")}</button>
                  <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-ghost btn-sm gap-1"><X size={16} /> {t("cancel")}</button>
                </div>
              </form>
            )}
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setEditingProduct(null)}><button>close</button></form>
        </dialog>

        {/* Edit User Modal */}
        <dialog className={`modal ${editingUser ? "modal-open" : ""}`}>
          <div className="modal-box rounded-xl shadow-2xl max-w-md">
            <h3 className="font-bold text-lg mb-4">{t("editUser")}</h3>
            {editingUser && (
              <form onSubmit={handleEditUser} className="space-y-3">
                <input type="text" className="input input-bordered w-full input-sm" placeholder={t("fullNamePlaceholder")}
                  value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required />
                <input type="email" className="input input-bordered w-full input-sm" placeholder={t("emailPlaceholder")}
                  value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required />
                <select className="select select-bordered w-full select-sm" value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                  <option value="customer">{t("customer")}</option>
                  <option value="admin">{t("admin")}</option>
                </select>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn btn-primary btn-sm gap-1"><Save size={16} /> {t("save")}</button>
                  <button type="button" onClick={() => setEditingUser(null)} className="btn btn-ghost btn-sm gap-1"><X size={16} /> {t("cancel")}</button>
                </div>
              </form>
            )}
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setEditingUser(null)}><button>close</button></form>
        </dialog>
      </div>
    </div>
  );
};

export default Dashboard;
