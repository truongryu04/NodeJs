module.exports.createPort = async (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", `Vui lòng nhập tiêu đề sản phẩm`)
        res.redirect("/admin/product-category/create")
        return
    }
    next()
}