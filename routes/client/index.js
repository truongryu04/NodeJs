const express = require('express');
const productRouter = require("./product")
const homeRouter = require("./home")
module.exports = (app) => {
    app.use('/product',productRouter)

    app.use('/',homeRouter)
}


