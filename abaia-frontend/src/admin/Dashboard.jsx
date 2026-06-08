import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

const colorMap = {
  أسود: "#1a1a1a", أخضر: "#27ae60", أحمر: "#c0392b", أزرق: "#2c6fbb",
  أبيض: "#f5f5f5", بيج: "#e8d5b7", بنفسجي: "#8e44ad", وردي: "#e91e9f",
  رمادي: "#7f8c8d", بني: "#795548", كحلي: "#1a3a5c", ذهبي: "#d4a017",
  فضي: "#bdc3c7", عاجي: "#f5eedc", موف: "#ab47bc", ليلكي: "#7b1fa2",
  زيتي: "#4a6b3a", كستنائي: "#800020", "أزرق داكن": "#0a2351", زمردي: "#046307",
};

const styles = [
  { ar: "نص كلوش", en: "Half Cloche" },
  { ar: "كلوش مزدوج", en: "Double Cloche" },
  { ar: "شيفون", en: "Chiffon" },
  { ar: "بشت كامل", en: "Full Bisht" },
  { ar: "ربع بشت", en: "Quarter Bisht" },
  { ar: "نص بشت", en: "Half Bisht" },
  { ar: "قصة الألف", en: "A-Line Cut" },
];

const colorKeys = Object.keys(colorMap);

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
    title: "", description: "", price: "", quantity: "", size: "52", color: "أسود",
    fabric_type: "", style: "", title_en: "", color_en: "", fabric_type_en: "", description_en: "", style_en: "",
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
      formData.append("title", editingProduct.title);
      formData.append("description", editingProduct.description || "");
      formData.append("price", editingProduct.price);
      formData.append("quantity", editingProduct.quantity);
      formData.append("size", editingProduct.size);
      formData.append("color", editingProduct.color);
      formData.append("fabric_type", editingProduct.fabric_type || "");
      formData.append("style", editingProduct.style || "");
      formData.append("style_en", editingProduct.style_en || "");
      formData.append("title_en", editingProduct.title_en || "");
      formData.append("color_en", editingProduct.color_en || "");
      formData.append("fabric_type_en", editingProduct.fabric_type_en || "");
      formData.append("description_en", editingProduct.description_en || "");
      if (productImageFile) formData.append("image", productImageFile);

      await api.put(
        `/api/products/${editingProduct.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      await api.put(
        `/api/auth/users/${editingUser.id}`,
        { name: editingUser.name, email: editingUser.email, role: editingUser.role, profile_pic: editingUser.profile_pic },
        authHeaders
      );
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
    { key: "products", label: t("productsTab"), icon: "📦" },
    { key: "users", label: t("usersTab"), icon: "👥" },
    { key: "orders", label: t("ordersTab"), icon: "🧾" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 p-4 sm:p-6 lg:p-8" style={{ textAlign: lang === "ar" ? "right" : "left" }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t("dashboardTitle")}</h2>
        <p className="text-base-content/50 text-sm mb-6">
          {lang === "ar" ? "مرحباً بك في نظام إدارة المتجر — تحكم بالمنتجات، المستخدمين، والفواتير" : "Welcome to the store management system — manage products, users, and invoices"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat bg-white dark:bg-base-100 shadow-lg rounded-2xl border border-base-200">
            <div className="stat-figure text-success">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="stat-title text-sm font-medium">{t("totalRevenue")}</div>
            <div className="stat-value text-2xl text-success font-bold">{totalSales.toFixed(2)}</div>
            <div className="stat-desc text-xs">{t("sar")}</div>
          </div>
          <div className="stat bg-white dark:bg-base-100 shadow-lg rounded-2xl border border-base-200">
            <div className="stat-figure text-warning">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
            </div>
            <div className="stat-title text-sm font-medium">{t("totalVatLabel")}</div>
            <div className="stat-value text-2xl text-warning font-bold">{totalVat.toFixed(2)}</div>
            <div className="stat-desc text-xs">{t("sar")}</div>
          </div>
          <div className="stat bg-white dark:bg-base-100 shadow-lg rounded-2xl border border-base-200">
            <div className="stat-figure text-info">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <div className="stat-title text-sm font-medium">{t("totalInvoices")}</div>
            <div className="stat-value text-2xl text-info font-bold">{orders.length}</div>
            <div className="stat-desc text-xs">{t("invoice")}</div>
          </div>
        </div>

        <div className="tabs tabs-bordered mb-6 gap-0 bg-white dark:bg-base-100 rounded-2xl shadow-lg border border-base-200 p-1.5">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={`tab tab-lg flex-1 rounded-xl font-semibold transition-all duration-200 ${
                tab === tb.key
                  ? "tab-active bg-primary/10 text-primary border-primary"
                  : "text-base-content/50 hover:text-base-content hover:bg-base-200/50"
              }`}
            >
              <span className="me-2">{tb.icon}</span>
              {tb.label}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <div className="bg-white dark:bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-base-200">
              <h3 className="text-lg font-bold">{t("allProducts")} <span className="text-base-content/40 text-sm font-normal">({products.length})</span></h3>
              <button onClick={() => setAddingProduct(true)} className="btn btn-primary btn-sm">+ {lang === "ar" ? "إضافة منتج" : "Add Product"}</button>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-base-content/50">
                    <th className="ps-5">#</th>
                    <th>{t("image")}</th>
                    <th>{lang === "ar" ? "الاسم" : "Title"}</th>
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
                    <tr>
                      <td colSpan={9} className="text-center py-10 text-base-content/30">{t("noProductsAdmin")}</td>
                    </tr>
                  )}
                  {products.map((p, i) => (
                    <tr key={p.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="ps-5 font-mono text-xs">{i + 1}</td>
                      <td>
                        {p.image_url ? (
                          <img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded-lg shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-base-200 flex items-center justify-center text-xs text-base-content/30">{t("noImage")}</div>
                        )}
                      </td>
                      <td className="font-medium">{p.title || "—"}</td>
                      <td className="font-mono">{p.price} {t("sar")}</td>
                      <td>
                        <span className={`badge badge-sm ${p.quantity > 0 ? "badge-success" : "badge-error"} gap-1`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-base-300" style={{ backgroundColor: colorMap[p.color] || "#ccc" }} />
                          <span className="text-sm">{p.color}</span>
                        </div>
                      </td>
                      <td>{p.size}</td>
                      <td className="text-center">
                        <button onClick={() => openEditProduct(p)} className="btn btn-ghost btn-xs btn-square text-info">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                      </td>
                      <td className="text-center">
                        <button onClick={() => setDeleteTarget({ type: "product", id: p.id, name: p.title })} className="btn btn-ghost btn-xs btn-square text-error">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "users" && (
          <div className="bg-white dark:bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-base-200">
              <h3 className="text-lg font-bold">{t("allUsers")} <span className="text-base-content/40 text-sm font-normal">({users.length})</span></h3>
            </div>
            <div className="overflow-x-auto">
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
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-base-content/30">{t("noUsers")}</td>
                    </tr>
                  )}
                  {users.map((u, i) => (
                    <tr key={u.id} className="hover:bg-base-200/50 transition-colors">
                      <td className="ps-5 font-mono text-xs">{i + 1}</td>
                      <td>
                        {u.profile_pic ? (
                          <img src={u.profile_pic} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-xs text-base-content/30">{u.name?.[0] || "?"}</div>
                        )}
                      </td>
                      <td className="font-medium">{u.name}</td>
                      <td className="text-sm text-base-content/70">{u.email}</td>
                      <td>
                        <span className={`badge badge-sm ${u.role === "admin" ? "badge-primary" : "badge-ghost"}`}>
                          {u.role === "admin" ? t("admin") : t("customer")}
                        </span>
                      </td>
                      <td className="text-sm text-base-content/60">
                        {new Date(u.created_at).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                      </td>
                      <td className="text-center">
                        <button onClick={() => openEditUser(u)} className="btn btn-ghost btn-xs btn-square text-info">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                      </td>
                      <td className="text-center">
                        <button onClick={() => setDeleteTarget({ type: "user", id: u.id, name: u.name })} className="btn btn-ghost btn-xs btn-square text-error">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="bg-white dark:bg-base-100 rounded-2xl shadow-lg border border-base-200 overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-base-200">
              <h3 className="text-lg font-bold">{t("recentInvoices")} <span className="text-base-content/40 text-sm font-normal">({orders.length})</span></h3>
            </div>
            <div className="overflow-x-auto">
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
      </div>

      <dialog className={`modal ${deleteTarget ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl shadow-2xl">
          <h3 className="font-bold text-lg mb-2">
            {deleteTarget?.type === "product" ? t("deleteProduct") : t("deleteUser")}
          </h3>
          <p className="text-base-content/70">
            {deleteTarget?.type === "product" ? t("deleteConfirm") : t("deleteUserConfirm")}
          </p>
          {deleteTarget && (
            <p className="font-semibold mt-2 text-lg">
              "{deleteTarget.type === "product" ? deleteTarget.name : deleteTarget.name}"
            </p>
          )}
          <div className="modal-action gap-3">
            <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost">{t("cancel")}</button>
            <button onClick={handleDelete} className="btn btn-error">{t("del")}</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <button>close</button>
        </form>
      </dialog>

      <dialog className={`modal ${addingProduct ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl shadow-2xl max-w-lg">
          <h3 className="font-bold text-lg mb-4">{lang === "ar" ? "إضافة منتج جديد" : "Add New Product"}</h3>
          <form onSubmit={handleAddProduct} className="space-y-3">
            <input type="text" className="input input-bordered w-full" placeholder={t("titlePlaceholder")}
              value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} required />
            <textarea className="textarea textarea-bordered w-full" rows={2} placeholder={t("descPlaceholder")}
              value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="input input-bordered w-full" placeholder={t("pricePlaceholder")}
                value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
              <input type="number" className="input input-bordered w-full" placeholder={t("qtyPlaceholder")}
                value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select className="select select-bordered w-full" value={newProduct.color}
                onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}>
                {colorKeys.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="select select-bordered w-full" value={newProduct.size}
                onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}>
                {[52, 54, 56, 58, 60].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input type="file" accept="image/*" className="file-input file-input-bordered w-full"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setNewProductImageFile(file);
                    setNewProductImagePreview(file ? URL.createObjectURL(file) : null);
                  }} />
              </div>
              {newProductImagePreview && (
                <img src={newProductImagePreview} alt="" className="w-14 h-14 object-cover rounded-lg border border-base-300" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" className="input input-bordered w-full" placeholder={t("fabricPlaceholder")}
                value={newProduct.fabric_type} onChange={(e) => setNewProduct({ ...newProduct, fabric_type: e.target.value })} />
              <select className="select select-bordered w-full" value={newProduct.style}
                onChange={(e) => {
                  const selected = styles.find((s) => s.ar === e.target.value);
                  setNewProduct({ ...newProduct, style: e.target.value, style_en: selected ? selected.en : "" });
                }}>
                <option value="">{t("selectStyle")}</option>
                {styles.map((s) => <option key={s.ar} value={s.ar}>{s.ar}</option>)}
              </select>
            </div>
            <div className="divider text-xs opacity-50">{lang === "ar" ? "— الإنجليزية —" : "— English —"}</div>
            <input type="text" className="input input-bordered w-full" placeholder={t("englishTitlePlaceholder")}
              value={newProduct.title_en} onChange={(e) => setNewProduct({ ...newProduct, title_en: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" className="input input-bordered w-full" placeholder={t("englishColorPlaceholder")}
                value={newProduct.color_en} onChange={(e) => setNewProduct({ ...newProduct, color_en: e.target.value })} />
              <input type="text" className="input input-bordered w-full" placeholder={t("englishFabricPlaceholder")}
                value={newProduct.fabric_type_en} onChange={(e) => setNewProduct({ ...newProduct, fabric_type_en: e.target.value })} />
            </div>
            <div className="modal-action gap-3">
              <button type="button" onClick={() => { setAddingProduct(false); setNewProductImageFile(null); setNewProductImagePreview(null); }} className="btn btn-ghost">{t("cancel")}</button>
              <button type="submit" className="btn btn-primary">{lang === "ar" ? "إضافة" : "Add"}</button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => { setAddingProduct(false); setNewProductImageFile(null); setNewProductImagePreview(null); }}>
          <button>close</button>
        </form>
      </dialog>

      <dialog className={`modal ${editingProduct ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl shadow-2xl max-w-lg">
          <h3 className="font-bold text-lg mb-4">{t("editProduct")}</h3>
          {editingProduct && (
            <form onSubmit={handleEditProduct} className="space-y-3">
              <input type="text" className="input input-bordered w-full" placeholder={t("titlePlaceholder")}
                value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} required />
              <textarea className="textarea textarea-bordered w-full" rows={2} placeholder={t("descPlaceholder")}
                value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" className="input input-bordered w-full" placeholder={t("pricePlaceholder")}
                  value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} required />
                <input type="number" className="input input-bordered w-full" placeholder={t("qtyPlaceholder")}
                  value={editingProduct.quantity} onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select className="select select-bordered w-full" value={editingProduct.color}
                  onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}>
                  {colorKeys.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="select select-bordered w-full" value={editingProduct.size}
                  onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}>
                  {[52, 54, 56, 58, 60].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input type="file" accept="image/*" className="file-input file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setProductImageFile(file);
                      if (file) {
                        setProductImagePreview(URL.createObjectURL(file));
                      } else {
                        setProductImagePreview(null);
                      }
                    }} />
                </div>
                {(productImagePreview || editingProduct.image_url) && (
                  <img src={productImagePreview || editingProduct.image_url} alt="" className="w-14 h-14 object-cover rounded-lg border border-base-300" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" className="input input-bordered w-full" placeholder={t("fabricPlaceholder")}
                  value={editingProduct.fabric_type || ""} onChange={(e) => setEditingProduct({ ...editingProduct, fabric_type: e.target.value })} />
                <select className="select select-bordered w-full" value={editingProduct.style || ""}
                  onChange={(e) => {
                    const selected = styles.find((s) => s.ar === e.target.value);
                    setEditingProduct({ ...editingProduct, style: e.target.value, style_en: selected ? selected.en : "" });
                  }}>
                  <option value="">{t("selectStyle")}</option>
                  {styles.map((s) => <option key={s.ar} value={s.ar}>{s.ar}</option>)}
                </select>
              </div>
              <div className="divider text-xs opacity-50">{lang === "ar" ? "— الإنجليزية —" : "— English —"}</div>
              <input type="text" className="input input-bordered w-full" placeholder={t("englishTitlePlaceholder")}
                value={editingProduct.title_en || ""} onChange={(e) => setEditingProduct({ ...editingProduct, title_en: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" className="input input-bordered w-full" placeholder={t("englishColorPlaceholder")}
                  value={editingProduct.color_en || ""} onChange={(e) => setEditingProduct({ ...editingProduct, color_en: e.target.value })} />
                <input type="text" className="input input-bordered w-full" placeholder={t("englishFabricPlaceholder")}
                  value={editingProduct.fabric_type_en || ""} onChange={(e) => setEditingProduct({ ...editingProduct, fabric_type_en: e.target.value })} />
              </div>
              <div className="modal-action gap-3">
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-ghost">{t("cancel")}</button>
                <button type="submit" className="btn btn-primary">{t("save")}</button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setEditingProduct(null)}>
          <button>close</button>
        </form>
      </dialog>

      <dialog className={`modal ${editingUser ? "modal-open" : ""}`}>
        <div className="modal-box rounded-2xl shadow-2xl max-w-md">
          <h3 className="font-bold text-lg mb-4">{t("editUser")}</h3>
          {editingUser && (
            <form onSubmit={handleEditUser} className="space-y-3">
              <input type="text" className="input input-bordered w-full" placeholder={t("fullNamePlaceholder")}
                value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required />
              <input type="email" className="input input-bordered w-full" placeholder={t("emailPlaceholder")}
                value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required />
              <select className="select select-bordered w-full" value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                <option value="customer">{t("customer")}</option>
                <option value="admin">{t("admin")}</option>
              </select>
              <div className="flex items-center gap-3">
                <input type="url" className="input input-bordered w-full" placeholder={lang === "ar" ? "رابط الصورة الشخصية" : "Profile picture URL"}
                  value={editingUser.profile_pic || ""} onChange={(e) => setEditingUser({ ...editingUser, profile_pic: e.target.value })} />
                {editingUser.profile_pic && (
                  <img src={editingUser.profile_pic} alt="" className="w-10 h-10 rounded-full object-cover border border-base-300" />
                )}
              </div>
              <div className="modal-action gap-3">
                <button type="button" onClick={() => setEditingUser(null)} className="btn btn-ghost">{t("cancel")}</button>
                <button type="submit" className="btn btn-primary">{t("save")}</button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setEditingUser(null)}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Dashboard;
