module.exports.index = (req, res) => {
    res.render("client/pages/product/index", {
        titlePage: "Trang sản phẩm"
    })
}