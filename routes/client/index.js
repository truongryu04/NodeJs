const express = require('express');
const productRouter = require("./product")
const homeRouter = require("./home")
const searchRouter = require("./search")
const categoryMiddleware = require("../../middlewares/client/categoryMiddleware")
module.exports = (app) => {
    app.use(categoryMiddleware.category)

    app.use('/', homeRouter)

    app.use('/product', productRouter)

    app.use('/search', searchRouter)


}


