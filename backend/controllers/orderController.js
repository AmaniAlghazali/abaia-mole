const prisma = require('../config/db');

const createOrder = async (req, res) => {
    try {
        const { user_id, items, payment_method } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "السلة فارغة، لا يمكن إتمام الطلب." });
        }

        const result = await prisma.$transaction(async (tx) => {
            let totalAmount = 0;
            const processedItems = [];

            for (const item of items) {
                const product = await tx.products.findUnique({
                    where: { id: item.product_id },
                });

                if (!product) {
                    throw new Error(`العباية رقم ${item.product_id} غير موجودة في النظام.`);
                }

                if (product.quantity < item.quantity) {
                    throw new Error(`المخزون غير كافٍ للعباية: ${product.title}. المتوفر حالياً: ${product.quantity} فقط.`);
                }

                const itemTotal = Number(product.price) * item.quantity;
                totalAmount += itemTotal;

                await tx.products.update({
                    where: { id: item.product_id },
                    data: { quantity: { decrement: item.quantity } },
                });

                processedItems.push({
                    product_id: product.id,
                    quantity: item.quantity,
                    price: product.price,
                });
            }

            const vatRate = 0.15;
            const vatAmount = totalAmount * vatRate;

            const newOrder = await tx.orders.create({
                data: {
                    user_id: user_id || null,
                    total_amount: totalAmount,
                    vat_amount: vatAmount,
                    payment_method: payment_method || null,
                    status: 'completed',
                    order_items: {
                        create: processedItems.map((item) => ({
                            product_id: item.product_id,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });

            return newOrder;
        });

        res.status(201).json({
            message: "تمت عملية البيع بنجاح، وتحديث المخزون وتوليد الفاتورة ماليّاً! 🧾✨",
            order_id: result.id,
            total: result.total_amount,
            vat: result.vat_amount,
            payment: payment_method,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message || "حدث خطأ أثناء معالجة عملية البيع" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            orderBy: { created_at: 'desc' },
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب الفواتير" });
    }
};

module.exports = {
    createOrder,
    getAllOrders
};