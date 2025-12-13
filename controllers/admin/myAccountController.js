const Account = require("../../models/accountModel")
const sysConfig = require("../../config/system")
const Role = require("../../models/roleModel")
const md5 = require('md5')

// [GET] /my-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index", {
        titlePage: "Thông tin cá nhân",
    })
}

// [GET] /my-account/edit
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit", {
        titlePage: "Chỉnh sửa thông tin cá nhân",
    })
}

// [Patch] /my-account/edit
module.exports.editPatch = async (req, res) => {
    const user = res.locals.user
    const id = user.id
    if (req.body.password) {
        req.body.password = md5(req.body.password)
    }
    else {
        delete req.body.password
    }
    console.log(user)
    console.log(req.body)
    const emailExist = await Account.findOne({ email: req.body.email, deleted: false, _id: { $ne: id } })
    if (!emailExist) {
        try {
            await Account.updateOne({ _id: user.id }, req.body)
            req.flash("success", `Cập nhật thông tin cá nhân thành công`)
        } catch (error) {
            req.flash("error", `Cập nhật thông tin cá nhân thất bại`)
        }
    }
    else {
        req.flash("error", `Email đã tồn tại`)

    }
    res.redirect(req.get('Referer'));
}

