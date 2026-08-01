const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');

// Webhook is registered in server.js BEFORE express.json() so it receives raw body
router.post('/create-checkout-session', createCheckoutSession);

module.exports = router;
