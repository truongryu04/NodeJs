const sysConfig = require("../../config/system")
const Role = require("../../models/roleModel")
// [GET] /admin/role
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    }
    const roles = await Role.find(find)
    res.render("admin/pages/role/index", {
        titlePage: "Trang quản lý nhóm quyền",
        roles: roles
    })
}
// [GET] /admin/role/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/role/create", {
        titlePage: "Trang thêm nhóm quyền",

    })
}

// [POST] /admin/role/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    const role = new Role(req.body)
    await role.save()
    res.redirect(`${sysConfig.prefixAdmin}/role`)
}

// [GET] /admin/role/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const find = {
            deleted: false,
            _id: id,
        }
        const role = await Role.findOne(find)
        console.log(role)
        if (role) {
            res.render("admin/pages/role/edit", {
                titlePage: "Chỉnh sửa nhóm quyền",
                role: role,
            })
        }
    } catch (error) {
        req.flash("error", `Không tồn tại nhóm quyền`)
        res.redirect(`${sysConfig.prefixAdmin}/role`)
    }
}

// [PATCH] /admin/role/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        await Role.updateOne({ _id: req.params.id }, req.body)
        req.flash("success", `Cập nhật nhóm quyền thành công`)
    } catch (error) {
        req.flash("error", `Cập nhật nhóm quyền thất bại`)
    }

    res.redirect(`${sysConfig.prefixAdmin}/role`)
}