const Category = require("../../models/categoryModel")
const sysConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
const Product = require("../../models/productModel")
const productHelper = require("../../helpers/product")
// [GET] /
module.exports.index = async (req, res) => {
    // Sản phẩm nổi bật
    const productFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6)
    const newProductsFeatured = productHelper.priceNewProducts(productFeatured)
    // End Sản phẩm nổi bật

    // Danh sách sản phẩm mới nhất

    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({ position: "desc" }).limit(6)
    const newProductsNew = productHelper.priceNewProducts(productsNew)
    // End danh sách sản phẩm mới nhất


    res.render('client/pages/home/index', {
        titlePage: "Trang chủ",
        productFeatured: newProductsFeatured,
        productsNew: newProductsNew
    })
}