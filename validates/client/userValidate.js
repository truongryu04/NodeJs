module.exports.registerPort = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", `Vui lòng nhập họ tên`)
        res.redirect("/admin/account/create")
        return
    }
    if (!req.body.password) {
        req.flash("error", `Vui lòng nhập tiêu đề mật khẩu`)
        res.redirect("/admin/account/create")
        return
    }
    next()
}

// module.exports.editPatch = async (req, res, next) => {
//     if (!req.body.fullName) {
//         req.flash("error", `Vui lòng nhập họ tên`)
//         res.redirect("/admin/account/edit")
//         return
//     }
//     if (!req.body.email) {
//         req.flash("error", `Vui lòng nhập email`)
//         res.redirect("/admin/account/edit")
//         return
//     }
//     next()
// }