const Category = require("../../models/categoryModel")
const Cart = require("../../models/cartModel")
const createTreeHelper = require("../../helpers/createTree")
module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        const cart = new Cart()
        await cart.save()
        const expiresCookie = 1000 * 60 * 60 * 24 * 365
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)
        })
    } else {

    }


    next()
}