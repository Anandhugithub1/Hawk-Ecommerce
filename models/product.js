// models/product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeOptions = ['S', 'M', 'L','XL'];
const categoryOptions = ['tshirt', 'hoodie', 'sweatshirt', 'pants', 'jacket'];

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    
    images: {
        type: [String],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    size: {
        type: String,
        enum: sizeOptions,
        default:sizeOptions
    },
    stock: [{
        size: {
            type: String,
            enum: sizeOptions
        },
        quantity: {
            type: Number,
            default: 0
        }
    }],
    availableSizes: {
        type: [String],
        enum: sizeOptions,
        default:sizeOptions
    },
    discountedPrice: {
        type: Number,
        default: null
    },
    discountPercentage: {
        type: Number,
        default: null
    },
    category: {
        type: String,
        enum: categoryOptions,
        required: true
    },
    stockAvailability: {
        type: Boolean,
        default: true
    }
});
ProductSchema.virtual('totalPrice').get(function () {
    if (this.discountedPrice) {
        return this.discountedPrice * this.quantity;
    } else {
        return this.price * this.quantity;
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
