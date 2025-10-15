// [GET] /admin/product
const Product = require("../../models/productModel")
const fillterStatusHelper = require("../../helpers/fillterStatus")
module.exports.index = async (req, res) => {
    const fillterStatus = fillterStatusHelper(req.query)
    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status
    }
    let keyword = ""
    if (req.query.keyword) {
        keyword = req.query.keyword
        const reg = new RegExp(keyword, "i")
        find.title = reg
    }
    const products = await Product.find(find)
    console.log(products)
    res.render("admin/pages/product/index", {
        titlePage: "Trang quản lý sản phẩm",
        products: products,
        fillterStatus: fillterStatus,
        keyword: keyword
    })
}