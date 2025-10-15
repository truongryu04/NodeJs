// [GET] /admin/product
const Product = require("../../models/productModel")
const fillterStatusHelper = require("../../helpers/fillterStatus")
const searchHelper = require("../../helpers/search")
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
    const products = await Product.find(find)
    console.log(products)
    res.render("admin/pages/product/index", {
        titlePage: "Trang quản lý sản phẩm",
        products: products,
        fillterStatus: fillterStatus,
        keyword: objectSearch.keyword
    })
}