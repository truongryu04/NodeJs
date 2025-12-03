const express = require('express');
const router = express.Router()
const controller = require("../../controllers/client/productController")
// route trang sản phẩm
router.get('/', controller.index)
router.get('/:slug', controller.detail)


module.exports = router;