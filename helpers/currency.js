const vndFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
})

module.exports.formatVND = (value) => {
    const amount = Number(value)
    return vndFormatter.format(Number.isFinite(amount) ? amount : 0)
}
