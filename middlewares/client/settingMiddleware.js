const SettingGeneral = require("../../models/settings-generalModel")

module.exports.settingGeneral = async (req, res, next) => {
    const setting = await SettingGeneral.findOne({})
    res.locals.settingGeneral = setting
    next()
}