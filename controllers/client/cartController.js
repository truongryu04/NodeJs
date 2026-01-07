
const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const categoryHelper = require("../../helpers/category")
const Cart = require("../../models/cartModel")
const productHelper = require("../../helpers/product")
// [GET] /cart
module.exports.index = async (req, res) => {
    const cart_id = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cart_id,
    })

    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const product_id = item.product_id
            const productInfo = await Product.findOne({
                _id: product_id
            }).select("title thumbnail slug price discountPercentage")
            productInfo.newprice = productHelper.priceNewProduct(productInfo)
            item.totalprice = productInfo.newprice * item.quantity
            item.productInfo = productInfo

        }
    }
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalprice, 0)
    res.render("client/pages/cart//index", {
        titlePage: "Trang giỏ hàng",
        cartDetail: cart,
    })
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

// [GET] /cart/delete/:id
module.exports.delete = async (req, res) => {
    const productId = req.params.id
    req.flash("success", "Xoá sản phẩm thành công")
    const cartId = req.cookies.cartId
    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: { products: { product_id: productId } }
    })
    const backURL = req.header('Referer')
    res.redirect(backURL)
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = req.params.quantity
    await Cart.updateOne({
        _id: cartId,
        "products.product_id": productId
    }, {
        $set: {
            "products.$.quantity": quantity
        }
    })
    const backURL = req.header('Referer')
    res.redirect(backURL)
}