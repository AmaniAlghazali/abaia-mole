const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productRoutes = require('../backend/routes/productRoutes');
const orderRoutes = require('../backend/routes/orderRoutes');
const authRoutes = require('../backend/routes/authRoutes');
const recolorRoutes = require('../backend/routes/recolorRoutes');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recolor', recolorRoutes);

app.use('/uploads', express.static(path.join(__dirname, '..', 'backend', 'uploads')));

app.get('/', (req, res) => {
    res.send('مرحباً بك في نظام عباية المحاسبي والمتجر الإلكتروني!');
});

module.exports = app;
