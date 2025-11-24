// [GET] /admin/product
const Product = require("../../models/productModel")
const fillterStatusHelper = require("../../helpers/fillterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const sysConfig = require("../../config/system")
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


    const products = await Product.find(find).sort({ position: "desc" }).limit(objectPagination.limitItem).skip(objectPagination.skip)
    console.log(products)
    res.render("admin/pages/product/index", {
        titlePage: "Trang quản lý sản phẩm",
        products: products,
        fillterStatus: fillterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
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
    res.render("admin/pages/product/create", {
        titlePage: "Trang thêm sản phẩm",
    })
}
// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
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