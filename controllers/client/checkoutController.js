
const Product = require("../../models/productModel")
const Cart = require("../../models/cartModel")
const Order = require("../../models/orderModel")
const productHelper = require("../../helpers/product")
const orderHelper = require("../../helpers/order")
const PAYMENT_METHODS = ["cod", "bank", "momo", "vnpay"]
const PAYMENT_METHOD_LABELS = {
    cod: "Thanh toán khi nhận hàng",
    bank: "Chuyển khoản ngân hàng",
    momo: "Ví MoMo",
    vnpay: "VNPay"
}
const STATUS_LABELS = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    shipping: "Đang giao hàng",
    delivered: "Đã giao hàng",
    cancelled: "Đã hủy"
}
const STATUS_BADGE_CLASSES = {
    pending: "text-bg-warning",
    confirmed: "text-bg-primary",
    shipping: "text-bg-info",
    delivered: "text-bg-success",
    cancelled: "text-bg-danger"
}

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

    if (!cart || cart.products.length === 0) {
        req.flash("error", "Giỏ hàng đang trống")
        return res.redirect("/cart")
    }

    const products = []
    let totalPrice = 0
    let totalDiscount = 0
    for (const product of cart.products) {
        const productInfor = await Product.findOne({
            _id: product.product_id,
            deleted: false,
            status: "active"
        }).select("title thumbnail price discountPercentage stock")
        if (!productInfor) {
            req.flash("error", "Có sản phẩm không còn khả dụng trong giỏ hàng")
            return res.redirect("/cart")
        }

        if (product.quantity > productInfor.stock) {
            req.flash("error", "Số lượng sản phẩm trong giỏ hàng vượt quá tồn kho")
            return res.redirect("/cart")
        }

        const obProduct = {
            product_id: product.product_id,
            title: productInfor.title,
            thumbnail: productInfor.thumbnail,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        }
        obProduct.price = productInfor.price
        obProduct.discountPercentage = productInfor.discountPercentage
        totalPrice += productInfor.price * product.quantity
        totalDiscount += (productInfor.price - productHelper.priceNewProduct(productInfor)) * product.quantity
        products.push(obProduct)
    }

    const userInfor = req.body.userInfor || {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address
    }
    const paymentMethod = PAYMENT_METHODS.includes(req.body.paymentMethod) ? req.body.paymentMethod : "cod"

    if (!userInfor.fullName || !userInfor.phone || !userInfor.address) {
        req.flash("error", "Vui lòng điền đầy đủ thông tin đặt hàng")
        return res.redirect("/checkout")
    }

    const orderInfor = {
        user_id: res.locals.user.id,
        cart_id: cartId,
        userInfor: userInfor,
        products: products,
        paymentMethod: paymentMethod,
        totalPrice: totalPrice,
        totalDiscount: totalDiscount,
        finalPrice: totalPrice - totalDiscount
    }
    const order = await new Order(orderInfor).save()

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

    if (!order || order.user_id !== res.locals.user.id) {
        req.flash("error", "Không tìm thấy đơn hàng")
        return res.redirect("/cart")
    }

    const orderDetail = await orderHelper.buildOrderDetail(order)

    res.render("client/pages/checkout/success", {
        titlePage: "Đặt hàng thành công",
        order: orderDetail,
    })
}


// [GET] /orders
module.exports.listOrder = async (req, res) => {
    const userId = res.locals.user.id
    const orders = await Order.find({
        user_id: userId,
        deleted: false,
    }).sort({ createdAt: -1 })

    const orderList = []
    for (const order of orders) {
        const orderDetail = await orderHelper.buildOrderDetail(order)
        orderList.push(orderDetail)
    }

    res.render("client/pages/checkout/order-history", {
        titlePage: "Lịch sử mua hàng",
        orders: orderList,
    })
}

// [PATCH] checkout/cancel/:orderId'
module.exports.cancelOrder = async (req, res) => {
    const orderId = req.params.orderId
    const userId = res.locals.user.id
    const order = await Order.findOne({
        _id: orderId,
        user_id: userId,
        deleted: false
    })
    if (order) {
        if (order.status !== "pending") {
            req.flash("error", "Đơn hàng không thể huỷ")
            return res.redirect("/checkout/order-history")
        }

        await Order.updateOne({
            _id: orderId,
            user_id: userId
        }, {
            status: "cancelled",
            cancelledAt: new Date()
        })
        req.flash("success", "Huỷ thành công !")
        return res.redirect("/checkout/order-history")


    }
    else {
        req.flash("error", "Đơn hàng không huỷ được")
        return res.redirect("/checkout/order-history")
    }
}