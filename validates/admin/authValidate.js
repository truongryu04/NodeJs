module.exports.login = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", `Vui lòng nhập email`)
        res.redirect("/admin/product/create")
        return
    }
    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập password`)
        res.redirect("/admin/product/create")
        return
    }
    next()
}