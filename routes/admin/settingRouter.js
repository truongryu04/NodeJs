const express = require('express');
const router = express.Router()
const multer = require('multer')
// const storageMulter = require("../../helpers/storageMulter")
const upload = multer()
const controller = require("../../controllers/admin/settingController")
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware")
router.get('/general', controller.general)
router.patch('/general', upload.single('logo'), uploadCloud.upload, controller.generalPatch)
module.exports = router;