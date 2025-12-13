const Category = require("../../models/categoryModel")
const createTreeHelper = require("../../helpers/createTree")
module.exports.category = async (req, res, next) => {
    let find = {
        deleted: false,
    }
    const categories = await Category.find(find)
    const newCategories = createTreeHelper.createTree(categories)
    res.locals.categories = newCategories
    next()
}