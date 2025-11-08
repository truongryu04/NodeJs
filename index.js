// index.js
const express = require('express');
const methodOverride = require('method-override')
const app = express();

app.use(methodOverride('_method'))

require("dotenv").config()

const route = require("./routes/client/index")
const routeAdmin = require("./routes/admin/index")
const database = require("./config/database")
const port = process.env.PORT || 3000
const systemConfig = require("./config/system")
app.set("views", "./views")
app.set('view engine', 'pug')
app.use(express.static('public'))
// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

database.connect()
route(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}); 