const Product = require("../../models/productModel")
module.exports.index = async (req, res) => {
    const products = await Product.find({ status: "active", deleted: false })
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