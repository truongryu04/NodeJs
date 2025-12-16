const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug)

const CartSchema = new mongoose.Schema({
    user_id: String,
    products: [
        {
            product_id: String,
            quantity: Number
        }
    ]

}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Cart = mongoose.model('Cart', CartSchema, "carts")
module.exports = Cart