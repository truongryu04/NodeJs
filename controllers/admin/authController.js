
const Account = require("../../models/accountModel")
const sysConfig = require("../../config/system")
const Role = require("../../models/roleModel")
const md5 = require('md5')

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    const token = req.cookies.token
    if (token) {
        req.flash("success", `Đăng nhập thành công`)
        res.redirect(`${sysConfig.prefixAdmin}/dashboard`)
    }
    else {
        res.render("admin/pages/auth/login", {
            titlePage: "Trang đăng nhập",
        })
    }

}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await Account.findOne({ email: email, deleted: false })
    console.log(user)
    if (!user) {
        req.flash("error", `Email không tồn tại`)
        res.redirect(req.get('Referer'));
        return
    }
    if (md5(password) != user.password) {
        req.flash("error", `Sai mật khẩu vui lòng nhập lại`)
        res.redirect(req.get('Referer'));
        return
    }

    if (user.status == "inactive") {
        req.flash("error", `Tài khoản đã bị khoá`)
        res.redirect(req.get('Referer'));
        return
    }
    req.flash("success", `Đăng nhập thành công`)
    res.cookie("token", user.token)
    res.redirect(`${sysConfig.prefixAdmin}/dashboard`)
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("token")
    res.redirect(`${sysConfig.prefixAdmin}/auth/login`)
}

