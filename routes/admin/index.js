const express = require('express');
const dashboardRouter = require("./dashboard")
const productRouter = require("./product")
const systemConfig = require("../../config/system")
const categoryRouter = require("./product-category")
const roleRouter = require("./role")
const accountRouter = require("./account")
const authRouter = require("./auth")
const myAccountRouter = require("./my-account")

const requireAuth = require("../../middlewares/admin/authMiddleware")
module.exports = (app) => {

    const PATH_ADMIN = systemConfig.prefixAdmin
    app.use(PATH_ADMIN + '/dashboard', requireAuth.requireAuth, dashboardRouter)
    app.use(PATH_ADMIN + '/product', requireAuth.requireAuth, productRouter)
    app.use(PATH_ADMIN + '/product-category', requireAuth.requireAuth, categoryRouter)
    app.use(PATH_ADMIN + '/role', requireAuth.requireAuth, roleRouter)
    app.use(PATH_ADMIN + '/account', requireAuth.requireAuth, accountRouter)
    app.use(PATH_ADMIN + '/auth', authRouter)
    app.use(PATH_ADMIN + '/my-account', requireAuth.requireAuth, myAccountRouter)
}
