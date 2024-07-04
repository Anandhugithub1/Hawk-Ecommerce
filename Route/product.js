const express = require('express');
const router = express.Router();
const productController = require('../Controller/product');

router.get('/', productController.listProducts); // GET all products
router.post('/', productController.createProduct); // POST new product
router.get('/:id', productController.getProductById); // GET product by ID
router.patch('/:id', productController.updateProductById);   // PATCH product by ID
router.post('/:id/update-quantity', productController.updateQuantityAndCalculatePrice);


router.post('/:id/apply-discount', async (req, res) => {
    const productId = req.params.id;
    const { discountPercentage } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate discounted price
        const discountedPrice = product.price * (1 - discountPercentage / 100);

        // Update product with discounted price and discount percentage
        product.discountedPrice = discountedPrice;
        product.discountPercentage = discountPercentage;
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
