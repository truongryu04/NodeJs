const express = require('express');
const productRouter = require("./product")
const homeRouter = require("./home")
const searchRouter = require("./search")
const cartRouter = require("./cart")
const checkoutRouter = require("./checkout")
const userRouter = require("./user")
const chatRouter = require("./chatRoute")
const categoryMiddleware = require("../../middlewares/client/categoryMiddleware")
const carMiddleware = require("../../middlewares/client/cartMiddleware")
const userMiddleware = require("../../middlewares/client/userMiddleware")
const settingMiddleware = require("../../middlewares/client/settingMiddleware")
module.exports = (app) => {
    app.use(userMiddleware.infoUser)
    app.use(categoryMiddleware.category)
    app.use(carMiddleware.cartId)
    app.use(settingMiddleware.settingGeneral)
    app.use('/', homeRouter)

    app.use('/product', productRouter)

    app.use('/search', searchRouter)
    app.use('/cart', cartRouter)
    app.use('/checkout', checkoutRouter)
    app.use('/user', userRouter)
    app.use('/chat', chatRouter)


}


