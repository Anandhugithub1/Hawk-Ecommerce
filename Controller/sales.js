
const Cart = require('../models/cart');

const getSalesAnalytics = async (req, res) => {
    try {
        const salesData = await Cart.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalQuantitySold: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    productName: '$productDetails.name',
                    totalQuantitySold: 1,
                    totalRevenue: 1
                }
            }
        ]);

        res.json(salesData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
