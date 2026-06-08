const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

// 1. تسجيل مستخدم جديد (عميل أو مدير)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "الرجاء إدخال جميع الحقول الأساسية" });
        }

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "هذا البريد الإلكتروني مسجل بالفعل!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // تحديد الصلاحية: إذا كان الطالب هو أدمن (يحمل توكن أدمن)، نحترم role المطلوب
        // وإلا فالقيمة الافتراضية هي customer
        let finalRole = 'customer';
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
                if (decoded.role === 'admin' && role === 'admin') {
                    finalRole = 'admin';
                }
            } catch (e) {}
        }

        const emailHash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
        const profile_pic = `https://www.gravatar.com/avatar/${emailHash}?s=200&d=identicon`;

        const newUserQuery = `
            INSERT INTO users (name, email, password, role, profile_pic)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, role, profile_pic, created_at;
        `;
        const result = await pool.query(newUserQuery, [name, email, hashedPassword, finalRole, profile_pic]);

        const token = jwt.sign(
            { id: result.rows[0].id, role: result.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({ message: "تم تسجيل الحساب بنجاح! 🎉", token, user: result.rows[0] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تسجيل الحساب" });
    }
};

// 2. تسجيل الدخول وتوليد الـ Token
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" });
        }

        // البحث عن المستخدم
        const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userRes.rows[0];

        if (!user) {
            return res.status(400).json({ message: "بيانات الاعتماد غير صحيحة (الإيميل أو كلمة المرور خاطئة)" });
        }

        // مقارنة كلمة المرور المدخلة بالكلمة المشفرة في قاعدة البيانات
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "بيانات الاعتماد غير صحيحة (الإيميل أو كلمة المرور خاطئة)" });
        }

        // توليد الـ JWT Token وتضمين معرف المستخدم وصلاحياته بداخلها
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' } // صلاحية المفتاح 30 يوماً
        );

        res.status(200).json({
            message: "تم تسجيل الدخول بنجاح! 🔑",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile_pic: user.profile_pic
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تسجيل الدخول" });
    }
};

// 3. التحقق من صلاحية التوكن وجلب بيانات المستخدم
const getMe = async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, name, email, role, profile_pic, created_at FROM users WHERE id = $1',
            [req.user.id]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.status(200).json({ user: user.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ" });
    }
};

// 4. جلب جميع المستخدمين (للمدير فقط)
const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, profile_pic, created_at FROM users ORDER BY created_at DESC'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المستخدمين' });
    }
};

// 5. تحديث مستخدم (للمدير فقط)
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, profile_pic } = req.body;

        const result = await pool.query(
            `UPDATE users SET
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                role = COALESCE($3, role),
                profile_pic = COALESCE($4, profile_pic)
             WHERE id = $5 RETURNING id, name, email, role, profile_pic, created_at`,
            [name, email, role, profile_pic, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        res.status(200).json({ message: 'تم تحديث المستخدم بنجاح ✅', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث المستخدم' });
    }
};

// 6. حذف مستخدم (للمدير فقط)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING id, name, email',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        res.status(200).json({ message: 'تم حذف المستخدم بنجاح 🗑️', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف المستخدم' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    updateUser,
    deleteUser
};