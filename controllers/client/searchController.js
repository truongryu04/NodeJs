const productHelper = require("../../helpers/product")
const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const categoryHelper = require("../../helpers/category")

module.exports.index = async (req, res) => {
    const keyword = req.query.keyword
    let products = []
    if (keyword) {
        regex = new RegExp(keyword, "i")
        products = await Product.find({
            title: regex,
            deleted: false,
            status: "active"
        })
    }
    const newProducts = productHelper.priceNewProducts(products)
    res.render('client/pages/search/index', {
        titlePage: "Kết quả trang tìm kiếm",
        products: newProducts
    })
}