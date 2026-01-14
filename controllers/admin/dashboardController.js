const Account = require("../../models/accountModel")
const Product = require("../../models/productModel")
const Category = require("../../models/categoryModel")
const User = require("../../models/userModel")
// [GET] /admin/dashboard
module.exports.index = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0
        }
    }
    // Danh mục sản phẩm
    statistic.categoryProduct.total = await Category.countDocuments({
        deleted: false
    })
    statistic.categoryProduct.active = await Category.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.categoryProduct.inactive = await Category.countDocuments({
        deleted: false,
        status: "inactive"
    })
    // Sản phẩm
    statistic.product.total = await Product.countDocuments({
        deleted: false
    })
    statistic.product.active = await Product.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.product.inactive = await Product.countDocuments({
        deleted: false,
        status: "inactive"
    })
    // Tài khoản admin
    statistic.account.total = await Account.countDocuments({
        deleted: false
    })
    statistic.account.active = await Account.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.account.inactive = await Account.countDocuments({
        deleted: false,
        status: "inactive"
    })
    // Tài khoản khách hàng
    statistic.user.total = await User.countDocuments({
        deleted: false
    })
    statistic.user.active = await User.countDocuments({
        deleted: false,
        status: "active"
    })
    statistic.user.inactive = await User.countDocuments({
        deleted: false,
        status: "inactive"
    })
    res.render("admin/pages/dashboard/index", {
        titlePage: "Trang tổng quan",
        statistic: statistic
    })
}