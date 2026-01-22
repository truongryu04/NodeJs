const express = require('express');
const router = express.Router()
const controller = require("../../controllers/client/usersController")

router.get('/not-friend', controller.notFriend)
router.get('/request', controller.request)
router.get('/accept', controller.accept)


module.exports = router;