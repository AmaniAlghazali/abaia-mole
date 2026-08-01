const nodemailer = require('nodemailer');
require('dotenv').config();

const sendContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ code: 'MISSING_FIELDS' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"عبايتي المتميزة - Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `رسالة جديدة من ${name} — عبايتي المتميزة`,
            html: `
                <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAFAF8; border-radius: 12px;">
                    <h2 style="color: #B8963E; margin-bottom: 4px;">عبايتي المتميزة</h2>
                    <h3 style="color: #1C1C1C; margin-top: 0;">رسالة جديدة من نموذج التواصل</h3>
                    <hr style="border: none; border-top: 1px solid #E8E3DB; margin: 16px 0;" />
                    <table style="width: 100%; font-size: 14px; color: #333;">
                        <tr>
                            <td style="padding: 8px 0; color: #777; width: 120px;">الاسم:</td>
                            <td style="padding: 8px 0; font-weight: bold;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #777;">البريد الإلكتروني:</td>
                            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #B8963E;">${email}</a></td>
                        </tr>
                    </table>
                    <hr style="border: none; border-top: 1px solid #E8E3DB; margin: 16px 0;" />
                    <p style="color: #777; font-size: 13px; margin-bottom: 8px;">الرسالة:</p>
                    <div style="background: #fff; border: 1px solid #E8E3DB; border-radius: 8px; padding: 16px; color: #1C1C1C; line-height: 1.7; white-space: pre-wrap;">${message}</div>
                    <p style="color: #999; font-size: 12px; margin-top: 24px;">للرد على هذه الرسالة، اضغط على "رد" وسيصلك الرد مباشرة لصاحبها.</p>
                </div>
            `,
        });

        res.status(200).json({ code: 'MESSAGE_SENT' });
    } catch (error) {
        console.error('contact error:', error);
        res.status(500).json({ code: 'SEND_FAILED' });
    }
};

module.exports = { sendContactMessage };
