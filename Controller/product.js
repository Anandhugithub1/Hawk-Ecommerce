// controllers/productController.js
const Product = require('../models/product');


// Function to calculate discounted price based on percentage
const calculateDiscountedPrice = (price, discountPercentage) => {
    return price * (1 - discountPercentage / 100);
};


// Controller function to list all products
const listProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        // Fetch recent products with pagination
        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Fetch total count for recent products
        const totalRecentProducts = await Product.countDocuments();

        // Fetch random products with pagination
        const randomProducts = await Product.aggregate([
            { $sample: { size: limit } }
        ]);

        res.json({
            recentProducts,
            randomProducts,
            totalRecentProducts,
            totalPages: Math.ceil(totalRecentProducts / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to create a new product
const createProduct = async (req, res) => {
    const { name, description, images, price, size, stockAvailability } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            images,
            price,
            size,
            stockAvailability
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller function to get product details by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller function to update product details by ID
const updateProductById = async (req, res) => {
    try {
        const { name, description, images, price, size, stockAvailability } = req.body;
        const productId = req.params.id;

        const updatedProduct = await Product.findByIdAndUpdate(productId, {
            name,
            description,
            images,
            price,
            size,
            stockAvailability
        }, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateQuantityAndCalculatePrice = async (req, res) => {
    const productId = req.params.id;
    const { quantity } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update quantity
        product.quantity = quantity;

        // Calculate total price based on quantity and discounts (if applicable)
        if (product.discountedPrice) {
            product.totalPrice = product.discountedPrice * quantity;
        } else {
            product.totalPrice = product.price * quantity;
        }

        // Save updated product
        await product.save();

        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
module.exports = {
    listProducts,
    createProduct,
    getProductById,
    updateProductById,
    calculateDiscountedPrice // Optional: Export the calculateDiscountedPrice function if needed,
   , updateQuantityAndCalculatePrice

};
