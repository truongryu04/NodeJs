const Product = require("../../models/productModel")
const fillterStatusHelper = require("../../helpers/fillterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const sysConfig = require("../../config/system")
const Category = require("../../models/categoryModel")
const createTreeHelper = require("../../helpers/createTree")
const Account = require("../../models/accountModel")
// [GET] /admin/product
module.exports.index = async (req, res) => {
    const fillterStatus = fillterStatusHelper(req.query)
    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status
    }

    const objectSearch = searchHelper(req.query)
    if (objectSearch.keyword) {
        find.title = objectSearch.regex
    }

    const countProduct = await Product.countDocuments(find)
    const objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        },
        req.query,
        countProduct

    )
    let sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    }
    else {
        sort.position = "desc"
    }

    const products = await Product.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip)
    for (const product of products) {
        const user = await Account.findOne({
            deleted: false,
            _id: product.createdBy.account_id
        })
        if (user) {
            product.account_fullName = user.fullName
        }
    }

    res.render("admin/pages/product/index", {
        titlePage: "Trang quản lý sản phẩm",
        products: products,
        fillterStatus: fillterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,

    })
}

// [PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({ _id: id }, { status: status })
    req.flash("success", "Cập nhật trạng thái thành công!")
    const backURL = req.header('Referer')
    // res.redirect('../..');
    res.redirect(backURL)
}

// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" })
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() })
            req.flash("success", `Đã xoá thành công ${ids.length} sản phẩm !`)
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Product.updateOne({ _id: id }, { position: position })
                req.flash("success", `Thay đổi vị trí thành công`)
            }
            break;
        default:
            break;
    }
    const backURL = req.header('Referer')
    // res.redirect('../..');
    res.redirect(backURL)
}

// [DELETE] /admin/product/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id

    // await Product.deleteOne({ _id: id })
    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() })
    req.flash("success", `Xoá thành công sản phẩm !`)
    const backURL = req.header('Referer')
    // res.redirect('../..');
    res.redirect(backURL)
}
// [GET] /admin/product/create
module.exports.create = async (req, res) => {
    const categories = await Category.find({ deleted: false })
    const newCategories = createTreeHelper.createTree(categories)
    res.render("admin/pages/product/create", {
        titlePage: "Trang thêm sản phẩm",
        categories: newCategories
    })
}
// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    if (req.body.position == "") {
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1
    }
    else {
        req.body.position = parseInt(req.body.position)
    }

    const product = new Product(req.body)
    await product.save()
    res.redirect(`${sysConfig.prefixAdmin}/product`)
}

// [GET] /admin/product/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const find = {
            deleted: false,
            _id: id,
        }
        const categories = await Category.find({ deleted: false })
        const newCategories = createTreeHelper.createTree(categories)
        const product = await Product.findOne(find);
        if (product) {
            res.render("admin/pages/product/edit", {
                titlePage: "Chỉnh sửa sản phẩm",
                product: product,
                categories: newCategories
            })
        }
    } catch (error) {
        req.flash("error", `Không tồn tại sản phẩm`)
        res.redirect(`${sysConfig.prefixAdmin}/product`)
    }
}

// [PATCH] /admin/product/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        await Product.updateOne({ _id: req.params.id }, req.body)
        req.flash("success", `Cập nhật sản phẩm thành công`)
    } catch (error) {
        req.flash("error", `Cập nhật sản phẩm thất bại`)
    }

    res.redirect(`${sysConfig.prefixAdmin}/product`)
}

// [GET] /admin/product/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const find = {
            deleted: false,
            _id: id,
        }
        const product = await Product.findOne(find);
        if (product) {
            res.render("admin/pages/product/detail", {
                titlePage: product.title,
                product: product,
            })
        }
    } catch (error) {
        req.flash("error", `Không tồn tại sản phẩm`)
        res.redirect(`${sysConfig.prefixAdmin}/product`)
    }
}