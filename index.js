// index.js
const express = require('express');
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')
const app = express();
const path = require('path');
const moment = require('moment');
// Khai báo socket.io
const { createServer } = require('node:http');
const { Server } = require("socket.io")


app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
require("dotenv").config()

const route = require("./routes/client/index")
const routeAdmin = require("./routes/admin/index")
const database = require("./config/database")
const port = process.env.PORT || 3000
const systemConfig = require("./config/system")
app.set("views", `${__dirname}/views`)
app.set('view engine', 'pug')

// TiniMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// TiniMCE

// Flash
app.use(cookieParser('GSFDGSGS'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

// SocketIO
const server = createServer(app);
const io = new Server(server)
global._io = io

// End Socket



// app local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin
app.locals.moment = moment
database.connect()

app.use(express.static(`${__dirname}/public`))
// Routes
route(app)
routeAdmin(app)
app.use((req, res) => {
    res.status(404).render("client/pages/errors/404", {
        titlePage: "404 not found",
    })
})
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}); 