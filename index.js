// index.js
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/Production');


app.set("views","./views")
app.set('view engine', 'pug')
app.use(express.static('public'))

const route = require("./routes/client/index")



route(app)
 
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});