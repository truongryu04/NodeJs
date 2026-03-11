module.exports = (query) => {
    const fillterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Chờ xác nhận",
            status: "pending",
            class: ""
        },
        {
            name: "Đã xác nhận",
            status: "confirmed",
            class: ""
        },
        {
            name: "Đang giao hàng",
            status: "shipping",
            class: ""
        },
        {
            name: "Đã giao hàng",
            status: "delivered",
            class: ""
        },
        {
            name: "Đã hủy",
            status: "cancelled",
            class: ""
        },
    ]

    if (query.status) {
        const index = fillterStatus.findIndex(item => item.status == query.status)
        if (index >= 0) {
            fillterStatus[index].class = "active"
        } else {
            const defaultIndex = fillterStatus.findIndex(item => item.status == "")
            fillterStatus[defaultIndex].class = "active"
        }
    }
    else {
        const index = fillterStatus.findIndex(item => item.status == "")
        fillterStatus[index].class = "active"
    }
    return fillterStatus
}