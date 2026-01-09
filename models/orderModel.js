const mongoose = require("mongoose")
const OrderSchema = new mongoose.Schema({
    user_id: String,
    cart_id: String,
    userInfor: {
        fullName: String,
        phone: String,
        address: String,
    },
    products: [
        {
            product_id: String,
            price: Number,
            quantity: Number,
            discountPercentage: Number
        }
    ],

    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Order = mongoose.model('Order', OrderSchema, "orders")
module.exports = Order