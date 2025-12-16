const productHelper = require("../../helpers/product")
const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const categoryHelper = require("../../helpers/category")
const Cart = require("../../models/cartModel")
// [GET] /cart
module.exports.index = (req, res) => {

}
// [POST] /cart/add/:id
module.exports.add = async (req, res) => {
    const productId = req.params.id
    const quantity = parseInt(req.body.quantity)
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        _id: cartId
    })
    const existProduct = cart.products.find(item => item.product_id == productId)
    if (existProduct) {
        const newQuantity = existProduct.quantity + quantity
        await Cart.updateOne({
            _id: cartId,
            'products.product_id': productId
        }, {
            $set: {
                'products.$.quantity': newQuantity
            }
        })
    }
    else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }
        await Cart.updateOne({
            _id: cartId
        }, {
            $push: { products: objectCart }
        })
    }

    req.flash("success", "Thêm vào giỏ hàng thành công")
    const backURL = req.header('Referer')
    // res.redirect('../..');
    res.redirect(backURL)
}