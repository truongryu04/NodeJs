const express = require('express');
const router = express.Router()
const controller = require("../../controllers/client/userController")
const validate = require("../../validates/client/userValidate")
const authMiddleware = require("../../middlewares/client/authMiddleware")
// Tải ảnh
const multer = require('multer')
// const storageMulter = require("../../helpers/storageMulter")
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloudMiddleware")

router.get('/register', controller.register)
router.post('/register', validate.registerPort, controller.registerPost)
router.get('/login', controller.login)
router.post('/login', controller.loginPost)
router.get('/logout', controller.logout)
router.get('/password/forgot', controller.forgotPassword)
router.post('/password/forgot', controller.forgotPasswordPost)
router.get('/password/otp', controller.otpPassword)

router.post('/password/otp', controller.otpPasswordPost)
router.get('/password/reset', controller.resetPassword)
router.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost)
router.get('/infor', authMiddleware.requireAuth, controller.infor)
router.get('/edit', authMiddleware.requireAuth, controller.edit)
router.post('/edit', authMiddleware.requireAuth, upload.single('avatar'), uploadCloud.upload, controller.editPost)
module.exports = router;