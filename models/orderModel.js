const mongoose = require("mongoose")
const OrderSchema = new mongoose.Schema({
    user_id: String,
    cart_id: String,
    userInfor: {
        fullName: String,
        phone: String,
        address: String,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "vnpay", "momo", "bank"],
        default: "cod"
    },
    deliveredAt: Date,
    cancelledAt: Date,
    products: [
        {
            product_id: String,
            title: String,
            thumbnail: String,
            price: Number,
            quantity: Number,
            discountPercentage: Number
        }
    ],
    totalPrice: Number,
    totalDiscount: Number,
    finalPrice: Number,
    shippingFee: {
        type: Number,
        default: 0
    },
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