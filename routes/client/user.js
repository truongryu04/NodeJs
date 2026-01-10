const express = require('express');
const router = express.Router()
const controller = require("../../controllers/client/userController")
const validate = require("../../validates/client/userValidate")
router.get('/register', controller.register)
router.post('/register', validate.registerPort, controller.registerPost)


module.exports = router;