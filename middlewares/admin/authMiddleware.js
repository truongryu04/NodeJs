const Account = require("../../models/accountModel")
const sysConfig = require("../../config/system")
const Role = require("../../models/roleModel")
module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        res.redirect(`${sysConfig.prefixAdmin}/auth/login`)
    }
    else {
        const user = await Account.findOne({ token: token }).select("-password")
        if (!user) {
            res.redirect(`${sysConfig.prefixAdmin}/auth/login`)
        }
        else {
            res.locals.user = user
            const role = await Role.findOne({ _id: user.role_id }).select("title permissions")
            res.locals.role = role
            next()
        }
    }

} 