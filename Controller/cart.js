// Controller function to add product to cart
const Cart = require('../models/cart');

const addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const price = product.discountedPrice || product.price;
        const cart = await Cart.findOne({ userId });

        if (cart) {
            // Update existing cart
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
                cart.items[itemIndex].price = price;
            } else {
                cart.items.push({ productId, quantity, price });
            }
            cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        } else {
            // Create new cart
            const newCart = new Cart({
                userId,
                items: [{ productId, quantity, price }],
                totalPrice: price * quantity
            });
            await newCart.save();
        }

        res.status(201).json(cart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports={
    addToCart
}