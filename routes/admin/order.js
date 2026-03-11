const express = require('express');
const router = express.Router()

const controller = require("../../controllers/admin/orderController")

router.get('/', controller.index)
router.get('/detail/:orderId', controller.detail)
router.patch('/change-status/:orderId', controller.changeStatus)
module.exports = router;

