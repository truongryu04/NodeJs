const Order = require("../../models/orderModel")

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

const PAYMENT_METHOD_LABELS = {
    cod: "Thanh toán khi nhận hàng",
    bank: "Chuyển khoản ngân hàng",
    momo: "Ví MoMo",
    vnpay: "VNPay"
}

const getOrderTotal = (order) => {
    if (typeof order.finalPrice === "number") {
        return order.finalPrice
    }

    if (typeof order.totalPrice === "number") {
        return order.totalPrice
    }

    return 0
}

// [GET] /admin/order
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const orders = await Order.find(find).sort({ createdAt: -1 })
    const orderList = orders.map(order => {
        const orderObject = order.toObject()
        orderObject.totalProducts = orderObject.products.reduce((sum, item) => sum + (item.quantity || 0), 0)
        orderObject.totalAmount = getOrderTotal(orderObject)
        orderObject.paymentMethodLabel = PAYMENT_METHOD_LABELS[orderObject.paymentMethod] || "Không xác định"
        orderObject.statusLabel = STATUS_LABELS[orderObject.status] || "Không xác định"
        orderObject.statusBadgeClass = STATUS_BADGE_CLASSES[orderObject.status] || "bg-secondary"
        return orderObject
    })

    res.render("admin/pages/order/index", {
        titlePage: "Trang quản lý đơn hàng",
        orders: orderList
    })
}