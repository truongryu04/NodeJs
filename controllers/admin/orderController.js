const Order = require("../../models/orderModel")
const orderHelper = require("../../helpers/order")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const fillterOrderStatus = require("../../helpers/filterOrderStatus")
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

const ORDER_STATUS_OPTIONS = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "shipping", label: "Đang giao hàng" },
    { value: "delivered", label: "Đã giao hàng" },
    { value: "cancelled", label: "Đã hủy" }
]

// [GET] /admin/order
module.exports.index = async (req, res) => {
    const filterStatus = fillterOrderStatus(req.query)
    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status
    }
    const objectSearch = searchHelper(req.query)
    if (objectSearch.keyword) {
        find.$or = [
            { "userInfor.fullName": objectSearch.regex },
            { "userInfor.phone": objectSearch.regex }
        ]
    }
    const countOrder = await Order.countDocuments(find)
    const objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 10,
        },
        req.query,
        countOrder
    )
    const orders = await Order.find(find).sort({ createdAt: -1 }).limit(objectPagination.limitItem).skip(objectPagination.skip)

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
        orders: orderList,
        fillterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
        orderStatusOptions: ORDER_STATUS_OPTIONS,
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
        order: orderDetail,
        orderStatusOptions: ORDER_STATUS_OPTIONS
    })
}
// [PATCH] /admin/order/change-status/:orderId
module.exports.changeStatus = async (req, res) => {
    const orderId = req.params.orderId
    const status = req.body.status

    if (!orderId || !status) {
        req.flash("error", "Thay đổi trạng thái không hợp lệ")
        return res.redirect("back")
    }

    if (!Object.keys(STATUS_LABELS).includes(status)) {
        req.flash("error", "Trạng thái không hợp lệ")
        return res.redirect("back")
    }

    const order = await Order.findOne({
        _id: orderId,
        deleted: false
    })

    if (!order) {
        req.flash("error", "Không tìm thấy đơn hàng")
        return res.redirect("back")
    }

    const updateData = {
        status: status
    }

    if (status === "cancelled") {
        updateData.cancelledAt = new Date()
    } else {
        updateData.cancelledAt = null
    }

    if (status === "delivered") {
        updateData.deliveredAt = new Date()
    } else {
        updateData.deliveredAt = null
    }

    await Order.updateOne({
        _id: orderId,
        deleted: false
    }, updateData)

    req.flash("success", "Thay đổi trạng thái thành công")
    const backURL = req.header('Referer')
    res.redirect(backURL)
}