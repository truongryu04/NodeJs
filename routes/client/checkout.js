const express = require('express');
const router = express.Router()
const controller = require("../../controllers/client/checkoutController")
const authMiddleware = require("../../middlewares/client/authMiddleware")



router.get('/', controller.index)

router.post('/order', authMiddleware.requireAuth, controller.order)
router.get('/success/:orderId', authMiddleware.requireAuth, controller.success)
router.get('/order-history', authMiddleware.requireAuth, controller.listOrder)
router.get('/orders', authMiddleware.requireAuth, controller.listOrder)
router.patch('/cancel/:orderId', authMiddleware.requireAuth, controller.cancelOrder)
module.exports = router;
