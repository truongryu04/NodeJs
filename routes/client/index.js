const express = require('express');
const productRouter = require("./product")
const homeRouter = require("./home")
const searchRouter = require("./search")
const cartRouter = require("./cart")
const checkoutRouter = require("./checkout")
const categoryMiddleware = require("../../middlewares/client/categoryMiddleware")
const carMiddleware = require("../../middlewares/client/cartMiddleware")
module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(carMiddleware.cartId)
    app.use('/', homeRouter)

    app.use('/product', productRouter)

    app.use('/search', searchRouter)
    app.use('/cart', cartRouter)
    app.use('/checkout', checkoutRouter)


}


