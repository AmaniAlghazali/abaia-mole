const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

// استدعاء ملف المسارات الخاص بالمنتجات
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const recolorRoutes = require('./routes/recolorRoutes');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recolor', recolorRoutes);

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('مرحباً بك في نظام عباية المحاسبي والمتجر الإلكتروني!');
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`Server is running on port ${PORT}`);
        console.log("Server is connected to database 🟢");
    });
}

module.exports = app;