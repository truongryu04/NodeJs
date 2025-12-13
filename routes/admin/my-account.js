const express = require('express');
const router = express.Router()
const multer = require('multer')
// const storageMulter = require("../../helpers/storageMulter")
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware")

const controller = require("../../controllers/admin/myAccountController")

router.get('/', controller.index)
router.get('/edit', controller.edit)
router.patch('/edit', upload.single('avatar'), uploadCloud.upload, controller.editPatch)
module.exports = router;