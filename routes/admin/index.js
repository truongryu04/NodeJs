const express = require('express');
const dashboardRouter = require("./dashboard")
const productRouter = require("./product")
const systemConfig = require("../../config/system")
const categoryRouter = require("./product-category")
module.exports = (app) => {

    const PATH_ADMIN = systemConfig.prefixAdmin
    app.use(PATH_ADMIN + '/dashboard', dashboardRouter)
    app.use(PATH_ADMIN + '/product', productRouter)
    app.use(PATH_ADMIN + '/product-category', categoryRouter)
}
