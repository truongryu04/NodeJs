const express = require('express');
const dashboardRouter = require("./dashboard")
const systemConfig = require("../../config/system")
module.exports = (app) => {

    const PATH_ADMIN = systemConfig.prefixAdmin
    app.use(PATH_ADMIN + '/dashboard', dashboardRouter)
}
