const express = require('express');
const router = express.Router()
const controller = require("../../controllers/client/productController")
// route trang sản phẩm
router.get('/', controller.index)
router.get('/detail/:slugProduct', controller.detail)
router.get('/:slugCategory', controller.category)


module.exports = router;