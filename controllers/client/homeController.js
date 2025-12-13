const Category = require("../../models/categoryModel")
const sysConfig = require("../../config/system")
const createTreeHelper = require("../../helpers/createTree")
// [GET] /
module.exports.index = async (req, res) => {

    res.render('client/pages/home/index', {
        titlePage: "Trang chủ",
    })
}