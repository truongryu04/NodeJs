// index.js
const express = require('express');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const app = express();

app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
require("dotenv").config()

const route = require("./routes/client/index")
const routeAdmin = require("./routes/admin/index")
const database = require("./config/database")
const port = process.env.PORT || 3000
const systemConfig = require("./config/system")
app.set("views", "./views")
app.set('view engine', 'pug')
app.use(express.static('public'))

// Flash

app.use(cookieParser('GSFDGSGS'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

database.connect()
route(app)
routeAdmin(app)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}); 