const express = require('express');
const router = express.Router()

const multer = require('multer')
const upload = multer()

const controller = require("../../controllers/admin/categoryController")
const validate = require("../../validates/admin/categoryValidate")
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware")
router.get('/', controller.index)
router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)
router.delete('/delete/:id', controller.deleteItem)
router.get('/create', controller.create)
router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPort,
    controller.createPost
)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', upload.single('thumbnail'), uploadCloud.upload, validate.createPort, controller.editPatch)
router.get('/detail/:id', controller.detail)

module.exports = router;