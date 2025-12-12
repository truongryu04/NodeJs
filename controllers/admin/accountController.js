const Account = require("../../models/accountModel")
const sysConfig = require("../../config/system")
const Role = require("../../models/roleModel")
const md5 = require('md5')
// [GET] /admin/account
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const accounts = await Account.find(find).select("-password -token")

    for (const account of accounts) {
        const role = await Role.findOne({
            _id: account.role_id,
            deleted: false
        })
        account.role = role
    }
    res.render("admin/pages/account/index", {
        titlePage: "Trang quản lý tài khoản",
        accounts: accounts
    })
}

// [GET] /admin/account/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }
    const roles = await Role.find(find)
    res.render("admin/pages/account/create", {
        titlePage: "Trang tạo tài khoản",
        roles: roles
    })
}

// [POST] /admin/account/create
module.exports.createPost = async (req, res) => {
    req.body.password = md5(req.body.password)
    const emailExist = await Account.findOne({ email: req.body.email, deleted: false })
    if (!emailExist) {
        const account = new Account(req.body)
        await account.save()
        res.redirect(`${sysConfig.prefixAdmin}/account`)
    }
    else {
        req.flash("error", `Email đã tồn tại`)
        res.redirect(req.get('Referer'));
    }
}

// [GET] /admin/account/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id
    let find = {
        _id: id,
        deleted: false,
    }

    const account = await Account.findOne(find)
    const roles = await Role.find({ deleted: false })
    res.render("admin/pages/account/edit", {
        titlePage: "Trang chỉnh sửa tài khoản",
        roles: roles,
        account: account
    })
}
// [PATCH] /admin/account/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    if (req.body.password) {
        req.body.password = md5(req.body.password)
    }
    else {
        delete req.body.password
    }
    const emailExist = await Account.findOne({ email: req.body.email, deleted: false, _id: { $ne: id } })
    if (!emailExist) {
        try {
            await Account.updateOne({ _id: req.params.id }, req.body)
            req.flash("success", `Cập nhật tài khoản thành công`)
        } catch (error) {
            req.flash("error", `Cập nhật tài khoản thất bại`)
        }
    }
    else {
        req.flash("error", `Email đã tồn tại`)

    }
    res.redirect(req.get('Referer'));
}

// [DELETE] /admin/account/delete/:id
module.exports.deleteAccount = async (req, res) => {
    const id = req.params.id

    await Account.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() })
    req.flash("success", `Xoá tài khoản thành công !`)
    const backURL = req.header('Referer')
    // res.redirect('../..');
    res.redirect(backURL)
}

// [PATCH] /admin/account/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    await Account.updateOne({ _id: id }, { status: status })
    req.flash("success", "Cập nhật trạng thái thành công!")
    const backURL = req.header('Referer')
    // res.redirect('../..');
    res.redirect(backURL)
}
