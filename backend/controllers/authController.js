const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "الرجاء إدخال جميع الحقول الأساسية" });
        }

        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "هذا البريد الإلكتروني مسجل بالفعل!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

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

        const user = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: finalRole,
                profile_pic,
            },
            select: { id: true, name: true, email: true, role: true, profile_pic: true, created_at: true },
        });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({ message: "تم تسجيل الحساب بنجاح! 🎉", token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تسجيل الحساب" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "الرجاء إدخال البريد الإلكتروني وكلمة المرور" });
        }

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "بيانات الاعتماد غير صحيحة (الإيميل أو كلمة المرور خاطئة)" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "بيانات الاعتماد غير صحيحة (الإيميل أو كلمة المرور خاطئة)" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
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

const getMe = async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true, profile_pic: true, created_at: true },
        });
        if (!user) {
            return res.status(404).json({ message: "المستخدم غير موجود" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: { id: true, name: true, email: true, role: true, profile_pic: true, created_at: true },
            orderBy: { created_at: 'desc' },
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المستخدمين' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, profile_pic } = req.body;

        const data = {};
        if (name !== undefined) data.name = name;
        if (email !== undefined) data.email = email;
        if (role !== undefined) data.role = role;
        if (profile_pic !== undefined) data.profile_pic = profile_pic;

        const user = await prisma.users.update({
            where: { id: parseInt(id) },
            data,
            select: { id: true, name: true, email: true, role: true, profile_pic: true, created_at: true },
        });
        res.status(200).json({ message: 'تم تحديث المستخدم بنجاح ✅', user });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث المستخدم' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.users.delete({
            where: { id: parseInt(id) },
            select: { id: true, name: true, email: true },
        });
        res.status(200).json({ message: 'تم حذف المستخدم بنجاح 🗑️', user });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }
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