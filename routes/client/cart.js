const express = require('express');
const router = express.Router()
const controller = require("../../controllers/client/cartController")

router.get('/', controller.index)
router.post('/add/:id', controller.add)


module.exports = router;