const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addProduct, getAllProducts, getAllProductsAdmin, updateProduct, deleteProduct, updateStock, getProductById } = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', getAllProducts);
router.get('/all', verifyAdmin, getAllProductsAdmin);
router.get('/:id', getProductById);
router.post('/add', verifyAdmin, upload.single('image'), addProduct);
router.put('/:id', verifyAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyAdmin, deleteProduct);
router.put('/update-stock/:id', verifyAdmin, updateStock);

module.exports = router;
