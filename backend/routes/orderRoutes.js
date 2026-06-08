const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders } = require('../controllers/orderController');
const { verifyAdmin } = require('../middleware/auth');

router.post('/create', createOrder);
router.get('/', verifyAdmin, getAllOrders);

module.exports = router;
