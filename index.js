// index.js
const express = require('express');
const app = express();

require("dotenv").config()

const route = require("./routes/client/index")
const database = require("./config/database")
const port = process.env.PORT || 3000

app.set("views", "./views")
app.set('view engine', 'pug')
app.use(express.static('public'))

database.connect()
route(app)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}); 