const prisma = require('../config/db');
const cloudinary = require('../config/cloudinary');

const addProduct = async (req, res) => {
    try {
        const { title, description, price, size, color, fabric_type, quantity, title_en, description_en, fabric_type_en, color_en, style, style_en } = req.body;
        
        let image_url = '';
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'abaia/products' });
            image_url = uploadResult.secure_url;
        }

        if (!title || !price || !size || quantity === undefined) {
            return res.status(400).json({ message: "الرجاء إدخال الحقول الأساسية" });
        }

        const product = await prisma.products.create({
            data: {
                title,
                description: description || null,
                price: parseFloat(price),
                size,
                color: color || null,
                fabric_type: fabric_type || null,
                quantity: parseInt(quantity),
                image_url: image_url || null,
                title_en: title_en || null,
                description_en: description_en || null,
                fabric_type_en: fabric_type_en || null,
                color_en: color_en || null,
                style: style || null,
                style_en: style_en || null,
            },
        });
        res.status(201).json({ message: "تم إضافة العباية بنجاح إلى المخزون! ✅", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء إضافة المنتج" });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.products.findMany({
            where: { quantity: { gt: 0 } },
            orderBy: { created_at: 'desc' },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب المنتجات" });
    }
};

const getAllProductsAdmin = async (req, res) => {
    try {
        const products = await prisma.products.findMany({
            orderBy: { created_at: 'desc' },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المنتجات' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, size, color, fabric_type, quantity, title_en, description_en, fabric_type_en, color_en, style, style_en } = req.body;

        let image_url = undefined;
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'abaia/products' });
            image_url = uploadResult.secure_url;
        }

        const data = {};
        if (title !== undefined) data.title = title;
        if (description !== undefined) data.description = description;
        if (price !== undefined) data.price = parseFloat(price);
        if (size !== undefined) data.size = size;
        if (color !== undefined) data.color = color;
        if (fabric_type !== undefined) data.fabric_type = fabric_type;
        if (quantity !== undefined) data.quantity = parseInt(quantity);
        if (title_en !== undefined) data.title_en = title_en;
        if (description_en !== undefined) data.description_en = description_en;
        if (fabric_type_en !== undefined) data.fabric_type_en = fabric_type_en;
        if (color_en !== undefined) data.color_en = color_en;
        if (style !== undefined) data.style = style;
        if (style_en !== undefined) data.style_en = style_en;
        if (image_url !== undefined) data.image_url = image_url;

        const product = await prisma.products.update({
            where: { id: parseInt(id) },
            data,
        });
        res.status(200).json({ message: 'تم تحديث المنتج بنجاح ✅', product });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث المنتج' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.products.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'تم حذف المنتج بنجاح 🗑️', product });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء حذف المنتج' });
    }
};

const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({ message: "الرجاء إدخال كمية صحيحة" });
        }

        const product = await prisma.products.update({
            where: { id: parseInt(id) },
            data: { quantity: parseInt(quantity) },
        });
        res.status(200).json({ message: "تم تحديث المخزون بنجاح! 📦", product });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ message: "العباية غير موجودة" });
        }
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تحديث المخزون" });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.products.findUnique({
            where: { id: parseInt(id) },
        });
        if (!product) {
            return res.status(404).json({ message: "المنتج غير موجود" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب المنتج" });
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getAllProductsAdmin,
    updateProduct,
    deleteProduct,
    updateStock,
    getProductById
};
