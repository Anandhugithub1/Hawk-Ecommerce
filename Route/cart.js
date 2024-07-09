const express = require('express');
const router = express.Router();
const cartController =require('../Controller/cart')
const auth = require('../middlewares/auth'); 


router.post('/cart', cartController.addToCart);
router.get('/cart/:userId', auth, cartController.getCartItems);

module.exports = router;
