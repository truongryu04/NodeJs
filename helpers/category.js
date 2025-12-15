const Category = require("../models/categoryModel")


module.exports.getSubCategory = async (parent_id) => {

    const SubCategory = async (parent_id) => {
        const subs = await Category.find({
            parent_id: parent_id,
            status: "active",
            deleted: false
        })
        let allSubs = [...subs]
        for (const sub of subs) {
            const childs = await SubCategory(sub.id)
            allSubs = allSubs.concat(childs)
        }
        return allSubs
    }
    const result = SubCategory(parent_id)
    return result
}