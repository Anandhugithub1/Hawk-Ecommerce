const express = require('express');
const router = express.Router();
const cartController =require('../Controller/cart')

router.post('/cart', cartController.addToCart);

module.exports = router;
