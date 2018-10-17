require('./environment/environment');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("./db/mongoose");

const { router } = require("./app/modules/user/routes/user.routes");

const port = process.env.PORT

var app = express();
app.use(bodyParser.json())
app.use(cors())

app.use('/', router)

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})


