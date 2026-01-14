const sysConfig = require("../../config/system")
const SettingGeneral = require("../../models/settings-generalModel")

// [GET] /admin/settings/general
module.exports.general = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({})
    res.render("admin/pages/settings/general", {
        titlePage: "Cài đặt chung",
        settingGeneral: settingGeneral
    })
}

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    const settingGeneral = await SettingGeneral.findOne({})
    if (settingGeneral) {
        await settingGeneral.updateOne({
            _id: settingGeneral.id
        }, req.body)
    }
    else {
        const setting = new SettingGeneral(req.body)
        await setting.save()
    }


    res.redirect(req.get("Referer"));

}