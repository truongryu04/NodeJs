
// [GET] /product
const Product = require("../../models/productModel")
module.exports.index = async (req, res) => {
    const products = await Product.find({ status: "active", deleted: false }).sort({ position: "desc" })
    console.log(products)
    const newProducts = products.map(item => {
        item.newPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed()
        return item
    })
    res.render("client/pages/product/index", {
        titlePage: "Trang sản phẩm",
        products: newProducts
    })
}
// [GET] product/:slug
module.exports.detail = async (req, res) => {
    try {
        const slug = req.params.slug
        const find = {
            deleted: false,
            status: "active",
            slug: slug,
        }
        const product = await Product.findOne(find);
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