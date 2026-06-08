const express = require('express');
const router = express.Router();
const { recolorProduct } = require('../controllers/recolorController');

router.post('/', recolorProduct);

module.exports = router;
