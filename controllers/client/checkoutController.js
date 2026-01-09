
const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const categoryHelper = require("../../helpers/category")
const Cart = require("../../models/cartModel")
const Order = require("../../models/orderModel")
const productHelper = require("../../helpers/product")
// [GET] /checkout
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
    res.render("client/pages/checkout/index", {
        titlePage: "Đặt hàng",
        cartDetail: cart,
    })
}
// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        _id: cartId
    })
    const products = []
    for (const product of cart.products) {
        const obProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        }
        const productInfor = await Product.findOne({
            _id: product.product_id
        }).select("price discountPercentage")
        obProduct.price = productInfor.price
        obProduct.discountPercentage = productInfor.discountPercentage
        products.push(obProduct)
    }
    const userInfor = req.body
    console.log(cartId)
    console.log(products)
    const orderInfor = {
        // user_id:,
        cart_id: cartId,
        userInfor: userInfor,
        products: products
    }
    const order = new Order(orderInfor)
    order.save()

    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    })
    res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /success/:orderId
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId
    const order = await Order.findOne({
        _id: orderId
    })
    for (const product of order.products) {
        const productInfor = await Product.findOne({
            _id: product.product_id
        }).select("title slug thumbnail ")
        product.productInfor = productInfor
        product.newprice = productHelper.priceNewProduct(product)
        product.totalPrice = product.newprice * product.quantity
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("client/pages/checkout/success", {
        titlePage: "Đặt hàng thành công",
        order: order,
    })
}
