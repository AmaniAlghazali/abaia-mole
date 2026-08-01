const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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
            return res.status(400).json({ code: "MISSING_FIELDS" });
        }

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ code: "EMAIL_NOT_FOUND" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ code: "WRONG_PASSWORD" });
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ code: 'MISSING_FIELDS' });

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ code: 'EMAIL_NOT_FOUND' });

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.users.update({
            where: { email },
            data: { reset_token: token, reset_token_expiry: expiry },
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        const emailConfigured = process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your_gmail_app_password_here';

        if (emailConfigured) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: `"عبايتي المتميزة" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'إعادة تعيين كلمة المرور - عبايتي المتميزة',
                html: `
                    <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border-radius: 12px;">
                        <h2 style="color: #B8963E; margin-bottom: 8px;">عبايتي المتميزة</h2>
                        <h3 style="color: #1C1C1C;">إعادة تعيين كلمة المرور</h3>
                        <p style="color: #555;">مرحباً ${user.name}،</p>
                        <p style="color: #555;">تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه (صالح لمدة ساعة واحدة):</p>
                        <a href="${resetUrl}" style="display: inline-block; background: #B8963E; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: bold;">إعادة تعيين كلمة المرور</a>
                        <p style="color: #777; font-size: 13px; margin-top: 16px;">إذا لم يعمل الزر، انسخ هذا الرابط وألصقه في المتصفح:</p>
                        <p style="word-break: break-all; font-size: 12px; color: #B8963E; background: #fff8ee; padding: 10px; border-radius: 6px; border: 1px solid #e8d5a3;">${resetUrl}</p>
                        <p style="color: #999; font-size: 12px; margin-top: 16px;">إذا لم تطلب هذا، يمكنك تجاهل هذا البريد بأمان.</p>
                    </div>
                `,
            });
        } else {
            // Development mode: print link to terminal so you can test without email setup
            console.log('\n🔑 PASSWORD RESET LINK (dev mode):');
            console.log(resetUrl);
            console.log('');
        }

        const isLocalhost = (process.env.FRONTEND_URL || '').includes('localhost');
        res.status(200).json({
            code: 'RESET_EMAIL_SENT',
            ...(isLocalhost && { resetUrl }),
        });
    } catch (error) {
        console.error('forgotPassword error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إرسال البريد' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ code: 'MISSING_FIELDS' });

        const user = await prisma.users.findFirst({
            where: {
                reset_token: token,
                reset_token_expiry: { gt: new Date() },
            },
        });

        if (!user) return res.status(400).json({ code: 'INVALID_OR_EXPIRED_TOKEN' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.users.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                reset_token: null,
                reset_token_expiry: null,
            },
        });

        const authToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            code: 'PASSWORD_RESET_SUCCESS',
            token: authToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, profile_pic: user.profile_pic },
        });
    } catch (error) {
        console.error('resetPassword error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء إعادة التعيين' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword, photoBase64 } = req.body;
        const userId = req.user.id;

        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ code: 'USER_NOT_FOUND' });

        const data = {};

        if (name && name.trim()) data.name = name.trim();

        if (email && email.trim() && email !== user.email) {
            const exists = await prisma.users.findUnique({ where: { email: email.trim() } });
            if (exists) return res.status(400).json({ code: 'EMAIL_TAKEN' });
            data.email = email.trim();
        }

        if (newPassword) {
            if (!currentPassword) return res.status(400).json({ code: 'CURRENT_PASSWORD_REQUIRED' });
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ code: 'WRONG_CURRENT_PASSWORD' });
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(newPassword, salt);
        }

        if (photoBase64) {
            const cloudinary = require('../config/cloudinary');
            const result = await cloudinary.uploader.upload(photoBase64, {
                folder: 'abaia/avatars',
                transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
            });
            data.profile_pic = result.secure_url;
        }

        const updated = await prisma.users.update({
            where: { id: userId },
            data,
            select: { id: true, name: true, email: true, role: true, profile_pic: true },
        });

        const token = jwt.sign(
            { id: updated.id, role: updated.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({ code: 'PROFILE_UPDATED', user: updated, token });
    } catch (error) {
        console.error('updateProfile error:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث الملف الشخصي' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword,
    updateProfile,
};