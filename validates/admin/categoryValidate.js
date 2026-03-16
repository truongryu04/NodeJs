module.exports.createPort = async (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", `Vui lòng nhập tiêu đề danh mục sản phẩm`)
        res.redirect("/admin/product-category/create")
        return
    }
    next()
}