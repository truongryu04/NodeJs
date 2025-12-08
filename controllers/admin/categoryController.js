const Category = require("../../models/categoryModel")
const sysConfig = require("../../config/system")
const fillterStatusHelper = require("../../helpers/fillterStatus")
const paginationHelper = require("../../helpers/pagination")
const searchHelper = require("../../helpers/search")
const createTreeHelper = require("../../helpers/createTree")
// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    const fillterStatus = fillterStatusHelper(req.query)
    let find = {
        deleted: false,
    }
    // if (req.query.status) {
    //     find.status = req.query.status
    // }
    // const countCategory = await Category.countDocuments(find)
    // const objectPagination = paginationHelper(
    //     {
    //         currentPage: 1,
    //         limitItem: 4,
    //     },
    //     req.query,
    //     countCategory
    // )
    const objectSearch = searchHelper(req.query)
    if (objectSearch.keyword) {
        find.title = objectSearch.regex
    }
    // let sort = {}
    // if (req.query.sortKey && req.query.sortValue) {
    //     sort[req.query.sortKey] = req.query.sortValue
    // }
    // else {
    //     sort.position = "asc"
    // }
    // const categories = await Category.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip)

    const categories = await Category.find(find)
    const newCategories = createTreeHelper.createTree(categories)
    res.render("admin/pages/product-category/index", {
        titlePage: "Trang quản lý danh mục sản phẩm",
        categories: newCategories,
        fillterStatus: fillterStatus,
        keyword: objectSearch.keyword,
        // pagination: objectPagination
    })
}

// [PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id
    await Category.updateOne({ _id: id }, { status: status })
    req.flash("success", "Cập nhật trạng thái thành công!")
    const backURL = req.header('Referer')
    // res.redirect('../..');
    res.redirect(backURL)
}

// [PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    switch (type) {
        case "active":
            await Category.updateMany({ _id: { $in: ids } }, { status: "active" })
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
            break;
        case "inactive":
            await Category.updateMany({ _id: { $in: ids } }, { status: "inactive" })
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm !`)
            break;
        case "delete-all":
            await Category.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() })
            req.flash("success", `Đã xoá thành công ${ids.length} sản phẩm !`)
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-")
                position = parseInt(position)
                await Category.updateOne({ _id: id }, { position: position })
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
    await Category.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() })
    req.flash("success", `Xoá thành công sản phẩm !`)
    const backURL = req.header('Referer')
    // res.redirect('../..');
    res.redirect(backURL)
}

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    }

    const categories = await Category.find(find)
    const newCategories = createTreeHelper.createTree(categories)
    // console.log(newCategories)
    res.render("admin/pages/product-category/create", {
        titlePage: "Trang thêm danh mục sản phẩm",
        categories: newCategories,
    })
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") {
        const countProduct = await Category.countDocuments();
        req.body.position = countProduct + 1
    }
    else {
        req.body.position = parseInt(req.body.position)
    }

    const category = new Category(req.body)
    await category.save()
    res.redirect(`${sysConfig.prefixAdmin}/product-category`)
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id
        const find = {
            deleted: false,
            _id: id,
        }
        const category = await Category.findOne(find);
        const categories = await Category.find({ deleted: false })
        const newCategories = createTreeHelper.createTree(categories)
        if (category) {
            res.render("admin/pages/product-category/edit", {
                titlePage: "Chỉnh sửa sản phẩm",
                category: category,
                categories: newCategories,

            })
        }
    } catch (error) {
        req.flash("error", `Không tồn tại danh mục sản phẩm`)
        res.redirect(`${sysConfig.prefixAdmin}/product-category`)
    }
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        await Category.updateOne({ _id: req.params.id }, req.body)
        req.flash("success", `Cập nhật danh mục sản phẩm thành công`)
    } catch (error) {
        req.flash("error", `Cập nhật danh mục sản phẩm thất bại`)
    }

    res.redirect(`${sysConfig.prefixAdmin}/product-category`)
}

