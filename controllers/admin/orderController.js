const Order = require("../../models/orderModel")
const orderHelper = require("../../helpers/order")
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

// [GET] /admin/order
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }

    const orders = await Order.find(find).sort({ createdAt: -1 })
    const orderList = orders.map(order => {
        const orderObject = order.toObject()
        orderObject.totalProducts = orderObject.products.reduce((sum, item) => sum + (item.quantity || 0), 0)
        orderObject.totalAmount = orderHelper.getOrderTotal(orderObject)
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

// [GET] /admin/order/detail/:orderId
module.exports.detail = async (req, res) => {
    const orderId = req.params.orderId

    const order = await Order.findOne({
        _id: orderId,
        deleted: false
    })

    if (!order) {
        req.flash("error", "Không tìm thấy đơn hàng")
        return res.redirect("back")
    }

    const orderDetail = await orderHelper.buildOrderDetail(order)

    res.render("admin/pages/order/detail", {
        titlePage: "Trang chi tiết đơn hàng",
        order: orderDetail
    })
}
// [GET] /admin/order/change-status/:status/:orderId
module.exports.changeStatus = async (req, res) => {

}