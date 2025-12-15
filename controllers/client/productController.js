const productHelper = require("../../helpers/product")
const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const categoryHelper = require("../../helpers/category")
// [GET] /product

module.exports.index = async (req, res) => {
    const products = await Product.find({ status: "active", deleted: false }).sort({ position: "desc" })
    const newProducts = productHelper.priceNewProducts(products)
    res.render("client/pages/product/index", {
        titlePage: "Trang sản phẩm",
        products: newProducts
    })
}
// [GET] product/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slugProduct
        const find = {
            deleted: false,
            status: "active",
            slug: slug,
        }
        const product = await Product.findOne(find);
        if (product.product_category_id) {
            const category = await Category.findOne({ _id: product.product_category_id, status: "active", deleted: false })
            product.category = category
        }
        product.priceNew = productHelper.priceNewProduct(product)


        if (product) {
            res.render("client/pages/product/detail", {
                titlePage: product.title,
                product: product,
            })
        }
    } catch (error) {
        req.flash("error", `Không tồn tại sản phẩm`)
        res.redirect(`/product`)
    }
}

// [GET] product/:slugCategory
module.exports.category = async (req, res) => {


    const slugCategory = req.params.slugCategory
    const category = await Category.findOne({ slug: slugCategory, deleted: false })

    const listSubCategory = await categoryHelper.getSubCategory(category.id)
    const listSubCategoryId = listSubCategory.map(item => item.id)

    const products = await Product.find({ product_category_id: { $in: [category.id, ...listSubCategoryId] }, deleted: false }).sort({ position: "desc" })
    const newProducts = productHelper.priceNewProducts(products)
    res.render("client/pages/product/index", {
        titlePage: category.title,
        products: newProducts
    })
}