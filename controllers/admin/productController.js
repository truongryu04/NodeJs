// [GET] /admin/product
const Product = require("../../models/productModel")
module.exports.index = async (req, res) => {
    const fillterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]

    if (req.query.status) {
        const index = fillterStatus.findIndex(item => item.status == req.query.status)
        fillterStatus[index].class = "active"
    }
    else {
        const index = fillterStatus.findIndex(item => item.status == "")
        fillterStatus[index].class = "active"
    }
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    const products = await Product.find(find)
    console.log(products)
    res.render("admin/pages/product/index", {
        titlePage: "Trang quản lý sản phẩm",
        products: products,
        fillterStatus: fillterStatus
    })
}