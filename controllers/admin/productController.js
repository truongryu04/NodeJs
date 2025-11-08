// [GET] /admin/product
const Product = require("../../models/productModel")
const fillterStatusHelper = require("../../helpers/fillterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
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


    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip)
    console.log(products)
    res.render("admin/pages/product/index", {
        titlePage: "Trang quản lý sản phẩm",
        products: products,
        fillterStatus: fillterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status
    const id = req.params.id

    await Product.updateOne({ _id: id }, { status: status })

    const backURL = req.header('Referer')
    console.log(backURL)
    // res.redirect('../..');
    res.redirect(backURL)


}

