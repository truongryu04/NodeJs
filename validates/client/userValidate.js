module.exports.registerPort = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", `Vui lòng nhập họ tên`)
        res.redirect("/user/register")
        return
    }
    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập mật khẩu`)
        res.redirect("/user/register")
        return
    }
    next()
}
module.exports.loginPort = async (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", `Vui lòng nhập email`)
        res.redirect("/user/login")
        return
    }
    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập mật khẩu`)
        res.redirect("/user/login")
        return
    }
    next()
}
module.exports.resetPasswordPost = async (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu")
        res.redirect(req.get("Referer"))
        return
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Vui lòng xác nhận mật khẩu")
        res.redirect(req.get("Referer"))
        return
    }
    if (req.body.confirmPassword != req.body.password) {
        req.flash("error", "Mật khẩu không khớp")
        res.redirect(req.get("Referer"))
        return
    }
    next()
}