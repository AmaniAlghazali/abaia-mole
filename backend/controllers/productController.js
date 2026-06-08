const pool = require('../config/db');
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

        const queryText = `
            INSERT INTO products (title, description, price, size, color, fabric_type, quantity, image_url, title_en, description_en, fabric_type_en, color_en, style, style_en)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `;
        const values = [title, description, price, size, color, fabric_type, quantity, image_url, title_en || null, description_en || null, fabric_type_en || null, color_en || null, style || null, style_en || null];
        
        const result = await pool.query(queryText, values);
        res.status(201).json({ message: "تم إضافة العباية بنجاح إلى المخزون! ✅", product: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء إضافة المنتج" });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products WHERE quantity > 0 ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب المنتجات" });
    }
};

const getAllProductsAdmin = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب المنتجات' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, size, color, fabric_type, quantity, title_en, description_en, fabric_type_en, color_en, style, style_en } = req.body;

        let image_url = null;
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'abaia/products' });
            image_url = uploadResult.secure_url;
        }

        const queryText = `
            UPDATE products SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                price = COALESCE($3, price),
                size = COALESCE($4, size),
                color = COALESCE($5, color),
                fabric_type = COALESCE($6, fabric_type),
                quantity = COALESCE($7, quantity),
                title_en = COALESCE($8, title_en),
                description_en = COALESCE($9, description_en),
                fabric_type_en = COALESCE($10, fabric_type_en),
                color_en = COALESCE($11, color_en),
                style = COALESCE($12, style),
                style_en = COALESCE($13, style_en),
                image_url = COALESCE($14, image_url)
            WHERE id = $15 RETURNING *;
        `;
        const values = [title, description, price, size, color, fabric_type, quantity, title_en, description_en, fabric_type_en, color_en, style, style_en, image_url, id];

        const result = await pool.query(queryText, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }
        res.status(200).json({ message: 'تم تحديث المنتج بنجاح ✅', product: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء تحديث المنتج' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }
        res.status(200).json({ message: 'تم حذف المنتج بنجاح 🗑️', product: result.rows[0] });
    } catch (error) {
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

        const queryText = 'UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *;';
        const result = await pool.query(queryText, [quantity, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "العباية غير موجودة" });
        }

        res.status(200).json({ message: "تم تحديث المخزون بنجاح! 📦", product: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "حدث خطأ أثناء تحديث المخزون" });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "المنتج غير موجود" });
        }
        res.status(200).json(result.rows[0]);
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
