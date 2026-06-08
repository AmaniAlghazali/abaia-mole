import React, { createContext, useContext, useState, useCallback } from "react";

const translations = {
  ar: {
    name: "العربية",
    dir: "rtl",
    // Navbar
    brand: "عبايتي المتميزة",
    home: "الرئيسية",
    allAbayas: "كل العبايات",
    dashboard: "لوحة المحاسبة",
    cart: "سلة التسوق",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    createAccount: "إنشاء حساب جديد",
    logout: "تسجيل الخروج",
    adminLogin: "دخول المدير",
    // Shop
    all: "الكل",
    selectStyle: "اختر الموديل",
    latestCollection: "أحدث تشكيلة من العبايات الملكية",
    loading: "جاري تحميل أحدث العبايات...",
    noProducts: "لا توجد عبايات متوفرة في المخزن حالياً.",
    fabric: "القماش",
    size: "المقاس",
    color: "اللون",
    style: "الموديل",
    otherColors: "ألوان أخرى",
    productNotFound: "المنتج غير موجود",
    notSpecified: "غير محدد",
    black: "أسود",
    addToCart: "إضافة للسلة 🛍️",
    abayaImage: "🖼️ صورة العباية",
    sar: "ر.س",
    // Cart
    shoppingCart: "سلة التسوق 🛒",
    emptyCart: "سلتك فارغة حالياً.. تصفحي أحدث العبايات وأضيفيها هنا.",
    backToShop: "العودة للمتجر",
    quantity: "الكمية",
    orderSummary: "ملخص الحسابات",
    subtotal: "المجموع الفرعي",
    vat: "ضريبة القيمة المضافة (15%)",
    total: "الإجمالي الكلي",
    checkout: "إتمام الشراء والدفع 💳",
    // Login
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "قم بتسجيل الدخول لمتابعة طلباتك",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    loggingIn: "جاري تسجيل الدخول...",
    noAccount: "ليس لديك حساب؟",
    loginFailed: "فشل تسجيل الدخول",
    backToStore: "العودة للمتجر",
    // Register
    registerTitle: "إنشاء حساب جديد",
    registerSubtitle: "سجل الآن لتتمكن من تتبع طلباتك",
    fullName: "الاسم الكامل",
    name: "الاسم",
    creatingAccount: "جاري إنشاء الحساب...",
    haveAccount: "لديك حساب بالفعل؟",
    ruleLength: "8 أحرف على الأقل",
    ruleUpper: "حرف كبير (A-Z)",
    ruleLower: "حرف صغير (a-z)",
    ruleNumber: "رقم (0-9)",
    // Dashboard
    dashboardTitle: "📊 لوحة الحسابات وإدارة مستودع العبايات",
    totalRevenue: "إجمالي الإيرادات (شامل الضريبة)",
    totalVatLabel: "ضريبة القيمة المضافة (15%)",
    totalInvoices: "عدد الفواتير الصادرة",
    invoice: "فاتورة",
    addProduct: "➕ إضافة عباية جديدة للمخزن",
    titlePlaceholder: "اسم العباية",
    descPlaceholder: "وصف العباية",
    pricePlaceholder: "السعر",
    qtyPlaceholder: "الكمية المتوفرة",
    fabricPlaceholder: "نوع القماش (مثال: كريب ملكي)",
    englishSection: "— الإنجليزية —",
    englishTitlePlaceholder: "الاسم (إنجليزي)",
    englishDescPlaceholder: "الوصف (إنجليزي)",
    englishFabricPlaceholder: "نوع القماش (إنجليزي)",
    englishColorPlaceholder: "اللون (إنجليزي)",
    addToInventory: "إدخال العباية في المخزون وحفظ الحسابات 💾",
    recentInvoices: "🧾 فواتير المبيعات الأخيرة",
    invoiceNo: "رقم الفاتورة",
    date: "التاريخ",
    paymentMethod: "طريقة الدفع",
    totalAmount: "المبلغ الإجمالي",
    addAdmin: "👤 إضافة مدير جديد للنظام",
    fullNamePlaceholder: "الاسم الكامل",
    emailPlaceholder: "البريد الإلكتروني",
    passwordPlaceholder: "كلمة المرور",
    addAdminBtn: "إضافة مدير ➕",
    // Errors
    errorFetchData: "خطأ في جلب بيانات اللوحة",
    errorAddProduct: "حدث خطأ أثناء إضافة العباية",
    errorRegister: "حدث خطأ أثناء التسجيل",
    errorOrder: "حدث خطأ أثناء إتمام الطلب",
    addSuccess: "تم إضافة المدير الجديد بنجاح! 🎉",
    errorAddAdmin: "حدث خطأ أثناء إضافة المدير",
    addedToCart: 'تمت إضافة "{title}" إلى السلة! 🛍️',
    // Dashboard products tab
    productsTab: "المنتجات",
    usersTab: "المستخدمين",
    ordersTab: "الفواتير",
    allProducts: "جميع المنتجات",
    editProduct: "تعديل المنتج",
    deleteProduct: "حذف المنتج",
    deleteConfirm: "هل أنت متأكد من حذف هذا المنتج؟",
    edit: "تعديل",
    del: "حذف",
    save: "حفظ التغييرات 💾",
    cancel: "إلغاء",
    image: "الصورة",
    noImage: "بدون صورة",
    noProductsAdmin: "لا توجد منتجات في المخزون",
    // Dashboard users tab
    allUsers: "جميع المستخدمين",
    editUser: "تعديل المستخدم",
    deleteUser: "حذف المستخدم",
    deleteUserConfirm: "هل أنت متأكد من حذف هذا المستخدم؟",
    admin: "مدير",
    customer: "عميل",
    role: "الصلاحية",
    registeredAt: "تاريخ التسجيل",
    noUsers: "لا يوجد مستخدمين",
    noInvoices: "لا توجد فواتير",
  },
  en: {
    name: "English",
    dir: "ltr",
    // Navbar
    brand: "My Premium Abaya",
    home: "Home",
    allAbayas: "All Abayas",
    dashboard: "Dashboard",
    cart: "Shopping Cart",
    login: "Login",
    register: "Register",
    createAccount: "Create Account",
    logout: "Logout",
    adminLogin: "Admin Login",
    // Shop
    all: "All",
    selectStyle: "Select Style",
    latestCollection: "Latest Collection of Royal Abayas",
    loading: "Loading latest abayas...",
    noProducts: "No abayas available in stock at the moment.",
    fabric: "Fabric",
    size: "Size",
    color: "Color",
    style: "Style",
    otherColors: "Other Colors",
    productNotFound: "Product not found",
    notSpecified: "Not specified",
    black: "Black",
    addToCart: "Add to Cart 🛍️",
    abayaImage: "🖼️ Abaya Image",
    sar: "SAR",
    // Cart
    shoppingCart: "Shopping Cart 🛒",
    emptyCart: "Your cart is empty.. Browse the latest abayas and add them here.",
    backToShop: "Back to Shop",
    quantity: "Qty",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    vat: "VAT (15%)",
    total: "Total",
    checkout: "Checkout & Pay 💳",
    // Login
    loginTitle: "Login",
    loginSubtitle: "Login to track your orders",
    email: "Email",
    password: "Password",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    loginFailed: "Login failed",
    backToStore: "Back to Store",
    // Register
    registerTitle: "Create New Account",
    registerSubtitle: "Register now to track your orders",
    fullName: "Full Name",
    name: "Name",
    creatingAccount: "Creating account...",
    haveAccount: "Already have an account?",
    ruleLength: "At least 8 characters",
    ruleUpper: "Uppercase (A-Z)",
    ruleLower: "Lowercase (a-z)",
    ruleNumber: "Number (0-9)",
    // Dashboard
    dashboardTitle: "📊 Dashboard & Inventory Management",
    totalRevenue: "Total Revenue (incl. Tax)",
    totalVatLabel: "VAT (15%)",
    totalInvoices: "Total Invoices",
    invoice: "Invoice",
    addProduct: "➕ Add New Abaya",
    titlePlaceholder: "Abaya name",
    descPlaceholder: "Description",
    pricePlaceholder: "Price",
    qtyPlaceholder: "Available quantity",
    fabricPlaceholder: "Fabric type (e.g. Royal Crepe)",
    englishSection: "— English —",
    englishTitlePlaceholder: "Name (English)",
    englishDescPlaceholder: "Description (English)",
    englishFabricPlaceholder: "Fabric type (English)",
    englishColorPlaceholder: "Color (English)",
    addToInventory: "Add to Inventory & Save 💾",
    recentInvoices: "🧾 Recent Sales Invoices",
    invoiceNo: "Invoice #",
    date: "Date",
    paymentMethod: "Payment",
    totalAmount: "Total",
    addAdmin: "👤 Add New Admin",
    fullNamePlaceholder: "Full Name",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    addAdminBtn: "Add Admin ➕",
    // Errors
    errorFetchData: "Error fetching dashboard data",
    errorAddProduct: "Error adding product",
    errorRegister: "Error during registration",
    errorOrder: "Error completing order",
    addSuccess: "New admin added successfully! 🎉",
    errorAddAdmin: "Error adding admin",
    addedToCart: '"{title}" added to cart! 🛍️',
    // Dashboard products tab
    productsTab: "Products",
    usersTab: "Users",
    ordersTab: "Orders",
    allProducts: "All Products",
    editProduct: "Edit Product",
    deleteProduct: "Delete Product",
    deleteConfirm: "Are you sure you want to delete this product?",
    edit: "Edit",
    del: "Delete",
    save: "Save Changes 💾",
    cancel: "Cancel",
    image: "Image",
    noImage: "No image",
    noProductsAdmin: "No products in inventory",
    // Dashboard users tab
    allUsers: "All Users",
    editUser: "Edit User",
    deleteUser: "Delete User",
    deleteUserConfirm: "Are you sure you want to delete this user?",
    admin: "Admin",
    customer: "Customer",
    role: "Role",
    registeredAt: "Registered At",
    noUsers: "No users found",
    noInvoices: "No invoices",
  },
};

const LangContext = createContext(null);

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }) => {
  const saved = localStorage.getItem("lang") || "ar";
  const [lang, setLang] = useState(saved);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "ar" ? "en" : "ar";
      localStorage.setItem("lang", next);
      return next;
    });
  }, []);

  const t = useCallback((key, params = {}) => {
    let val = translations[lang]?.[key] || key;
    for (const [k, v] of Object.entries(params)) {
      val = val.replace(`{${k}}`, v);
    }
    return val;
  }, [lang]);

  const dir = translations[lang].dir;

  return (
    <LangContext.Provider value={{ lang, toggleLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </LangContext.Provider>
  );
};
