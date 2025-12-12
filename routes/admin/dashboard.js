const express = require('express');
const router = express.Router()
const controller = require("../../controllers/admin/dashboardController")


router.get('/', controller.index)

module.exports = router;
