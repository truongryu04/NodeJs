const express = require('express');
const router = express.Router()
const multer = require('multer')
// const storageMulter = require("../../helpers/storageMulter")
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware")

const validate = require("../../validates/admin/accountValidate")
const controller = require("../../controllers/admin/accountController")

router.get('/', controller.index)
router.get('/create', controller.create)
router.post('/create', upload.single('avatar'), uploadCloud.upload, validate.createPort, controller.createPost)
router.get('/edit/:id', controller.edit)
router.patch('/edit/:id', upload.single('avatar'), uploadCloud.upload, validate.editPatch, controller.editPatch)
router.delete('/delete/:id', controller.deleteAccount)
router.patch('/change-status/:status/:id', controller.changeStatus)
module.exports = router;