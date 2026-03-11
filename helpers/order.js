const Product = require("../models/productModel")

const productHelper = require("../helpers/product")

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
    pending: "bg-warning text-dark",
    confirmed: "bg-primary",
    shipping: "bg-info text-dark",
    delivered: "bg-success",
    cancelled: "bg-danger"
}

module.exports.getOrderTotal = (order) => {
    const subtotal = typeof order.totalPrice === "number" ? order.totalPrice : 0
    const discount = typeof order.totalDiscount === "number" ? order.totalDiscount : 0
    const shippingFee = typeof order.shippingFee === "number" ? order.shippingFee : 0

    if (typeof order.finalPrice === "number") {
        return order.finalPrice + shippingFee
    }

    if (subtotal > 0 || discount > 0 || shippingFee > 0) {
        return subtotal - discount + shippingFee
    }

    return order.products.reduce((sum, item) => {
        const newPrice = Number(productHelper.priceNewProduct(item))
        return sum + newPrice * (item.quantity || 0)
    }, 0)
}

module.exports.buildOrderDetail = async (order) => {
    const orderDetail = order.toObject()
    let computedTotalPrice = 0
    let totalDiscount = 0
    for (const product of orderDetail.products) {
        const productInfor = await Product.findOne({
            _id: product.product_id
        }).select("title slug thumbnail")

        product.productInfor = productInfor || {
            title: "Sản phẩm không còn tồn tại",
            slug: "",
            thumbnail: ""
        }
        product.newprice = productHelper.priceNewProduct(product)
        product.totalPrice = product.newprice * product.quantity
        totalDiscount += productHelper.priceDiscount(product) * product.quantity
        computedTotalPrice += product.totalPrice
    }

    orderDetail.totalPrice = typeof orderDetail.totalPrice === "number" ? orderDetail.totalPrice : computedTotalPrice
    orderDetail.finalPrice = typeof orderDetail.finalPrice === "number" ? orderDetail.finalPrice : (orderDetail.totalPrice - (orderDetail.totalDiscount || 0))
    orderDetail.totalAmount = module.exports.getOrderTotal(orderDetail)
    orderDetail.totalDiscount = totalDiscount
    orderDetail.createdAtFormatted = orderDetail.createdAt ? new Date(orderDetail.createdAt).toLocaleString("vi-VN") : ""
    orderDetail.paymentMethodLabel = PAYMENT_METHOD_LABELS[orderDetail.paymentMethod] || orderDetail.paymentMethod || "Không xác định"
    orderDetail.statusLabel = STATUS_LABELS[orderDetail.status] || orderDetail.status || "Không xác định"
    orderDetail.statusBadgeClass = STATUS_BADGE_CLASSES[orderDetail.status] || "bg-secondary"

    return orderDetail
}