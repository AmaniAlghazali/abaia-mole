const pool = require('../config/db');

// إنشاء طلب جديد وفاتورة مبيعات
const createOrder = async (req, res) => {
    // نفتح اتصالاً خاصاً للعملية المحاسبية المترابطة (Transaction)
    const client = await pool.connect();
    
    try {
        const { user_id, items, payment_method } = req.body; 
        // items عبارة عن مصفوفة تحتوي على: [ { product_id: 1, quantity: 2 }, ... ]

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "السلة فارغة، لا يمكن إتمام الطلب." });
        }

        // 1. بدء العملية المحاسبية الآمنة
        await client.query('BEGIN');

        let totalAmount = 0;
        const processedItems = [];

        // 2. التحقق من الأسعار والمخزون لكل عباية في الفاتورة
        for ( let item of items ) {
            const productRes = await client.query('SELECT * FROM products WHERE id = $1', [item.product_id]);
            const product = productRes.rows[0];

            if (!product) {
                throw new Error(`العباية رقم ${item.product_id} غير موجودة في النظام.`);
            }

            if (product.quantity < item.quantity) {
                throw new Error(`المخزون غير كافٍ للعباية: ${product.title}. المتوفر حالياً: ${product.quantity} فقط.`);
            }

            // حساب السعر الإجمالي لهذه العباية (السعر * الكمية المطلوبة)
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            // تحديث المخزون (خصم الكمية المباعة)
            await client.query('UPDATE products SET quantity = quantity - $1 WHERE id = $2', [item.quantity, item.product_id]);

            // حفظ بيانات المنتج لاستخدامها لاحقاً في تفاصيل الفاتورة
            processedItems.push({
                product_id: product.id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // 3. الحسابات الضريبية (ضريبة القيمة المضافة في السعودية 15%)
        // نفترض أن الأسعار في المخزن شاملة الضريبة أو غير شاملة، هنا سنحسب قيمة الـ 15% من الإجمالي
        const vatRate = 0.15;
        const vatAmount = totalAmount * vatRate;

        // 4. تسجيل الفاتورة الرئيسية في جدول orders
        const orderQuery = `
            INSERT INTO orders (user_id, total_amount, vat_amount, payment_method, status)
            VALUES ($1, $2, $3, $4, 'completed')
            RETURNING *;
        `;
        const orderRes = await client.query(orderQuery, [user_id || null, totalAmount, vatAmount, payment_method]);
        const newOrder = orderRes.rows[0];

        // 5. تسجيل تفاصيل العبايات داخل جدول order_items لربطها بالفاتورة الرئيسية
        for (let item of processedItems) {
            const itemQuery = `
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4);
            `;
            await client.query(itemQuery, [newOrder.id, item.product_id, item.quantity, item.price]);
        }

        // 6. اعتماد العملية المحاسبية بنجاح وحفظ التغييرات في قاعدة البيانات
        await client.query('COMMIT');

        res.status(201).json({
            message: "تمت عملية البيع بنجاح، وتحديث المخزون وتوليد الفاتورة ماليّاً! 🧾✨",
            order_id: newOrder.id,
            total: totalAmount,
            vat: vatAmount,
            payment: payment_method
        });

    } catch (error) {
        // في حال حدوث أي خطأ (مثل نقص المخزن)، يتم إلغاء كل الخطوات السابقة كأنها لم تكن حمايةً للحسابات
        await client.query('ROLLBACK');
        console.error(error);
        res.status(400).json({ error: error.message || "حدث خطأ أثناء معالجة عملية البيع" });
    } finally {
        // إغلاق الاتصال الخاص
        client.release();
    }
};

// جلب جميع الفواتير والمبيعات (لوحة تحكم الإدارة والمحاسبة)
const getAllOrders = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب الفواتير" });
    }
};

module.exports = {
    createOrder,
    getAllOrders
};