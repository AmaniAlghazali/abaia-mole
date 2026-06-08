const { Pool } = require('pg');
require('dotenv').config();

// إعداد الاتصال باستخدام المتغيرات من ملف .env
const pool = new Pool({
    user: process.env.DB_USER?.trim(),
    host: process.env.DB_HOST?.trim(),
    database: process.env.DB_DATABASE?.trim(),
    password: process.env.DB_PASSWORD?.trim(),
    port: process.env.DB_PORT?.trim(),
    ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
    console.log('connect success🚀');
});

module.exports = pool;