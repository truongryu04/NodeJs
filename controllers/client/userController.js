const User = require("../../models/userModel")
const Cart = require("../../models/cartModel")
const ForgotPassword = require("../../models/forgot-passwordModel")
const md5 = require("md5")
const generateHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")
// [GET] user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        titlePage: "Đăng ký tài khoản",
    })
}
// [POST] user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({ email: req.body.email })
    if (existEmail) {
        req.flash("error", `Email đã tồn tại, vui lòng sử dụng email khác`)
        res.redirect("/user/register")
        return
    }
    req.body.password = md5(req.body.password)
    const user = new User(req.body)
    await user.save()
    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")


}
// [GET] user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        titlePage: "Đăng nhập tài khoản",
    })

}

// [POST] user/login
module.exports.loginPost = async (req, res) => {
    req.body.password = md5(req.body.password)
    const user = await User.findOne({
        email: req.body.email,
        deleted: false,
    })
    if (!user) {
        req.flash("error", `Email không tồn tại`)
        res.redirect("/user/login")
        return
    }
    if (user.password !== req.body.password) {
        req.flash("error", `Mật khẩu không đúng`)
        res.redirect("/user/login")
        return
    }
    if (user.status !== "active") {
        req.flash("error", `Tài khoản đã bị khoá`)
        res.redirect("/user/login")
        return
    }

    const cartId = req.cookies.cartId
    const cart = await Cart.findOne({
        user_id: user.id
    })
    if (cart) {
        res.cookie("cartId", cart.id)
    } else if (cartId) {
        await Cart.updateOne({ _id: cartId }, { user_id: user.id })
        res.cookie("cartId", cartId)
    } else {
        const newCart = new Cart({ user_id: user.id })
        await newCart.save()
        res.cookie("cartId", newCart.id)
    }
    res.cookie("tokenUser", user.tokenUser)
    await User.updateOne({
        tokenUser: user.tokenUser
    }, {
        statusOnline: "online"
    })
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: user.id,
            status: "online"
        })
    })
    res.redirect("/")
}

// [GET] user/logout
module.exports.logout = async (req, res) => {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser
    }, {
        statusOnline: "offline"
    })
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: res.locals.user.id,
            status: "offline"
        })
    })
    res.clearCookie("tokenUser")
    res.clearCookie("cartId")
    res.redirect("/")
}

// [GET] user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        titlePage: "Lấy lại mật khẩu",
    })
}
// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        res.flash("error", "Email không tồn tại")
        res.redirect("back")
    }
    const otp = generateHelper.generateRandomNumber(8)
    // Lưu thông tin vào db
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 3 * 60 * 1000)
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    forgotPassword.save()
    // Gửi OTP cho email
    const subject = "Mã OTP xác minh lấy lại mật khẩu"
    const html = `Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút`
    sendMailHelper.sendMail(email, subject, html)

    res.redirect(`/user/password/otp?email=${email}`)
}
// [GET] user/password/otpPassword
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email
    res.render("client/pages/user/otp-password", {
        titlePage: "Nhập mã otp",
        email: email
    })
}
// [POST] user/password/otpPassword
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email
    const otp = req.body.otp
    console.log(otp, email)
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp

    })
    console.log(result)
    if (!result) {
        req.flash("error", "OTP không hợp lệ")
        res.redirect(req.get("Referer"));
        return
    }
    console.log(result)
    const user = await User.findOne({
        email: email
    })
    res.cookie("tokenUser", user.tokenUser)
    res.redirect("/user/password/reset")

}

// [GET] user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
        titlePage: "Đổi mật khẩu",
    })
}
// [POST] user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password
    const tokenUser = req.cookies.tokenUser
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })
    req.flash("success", "Đổi mật khẩu thành công")
    res.redirect("/")
}

// [GET] user/infor
module.exports.infor = async (req, res) => {
    res.render("client/pages/user/infor", {
        titlePage: "Thông tin tài khoản",
    })

}
// [GET] user/edit
module.exports.edit = async (req, res) => {
    res.render("client/pages/user/edit", {
        titlePage: "Trang chỉnh sửa thông tin tài khoản",
    })

}
// [Post] user/edit
module.exports.editPost = async (req, res) => {
    const user = res.locals.user
    console.log(user)
    await User.updateOne({
        _id: user.id
    }, req.body)
    res.redirect("/user/infor")

}