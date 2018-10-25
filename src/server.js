import './environment/environment';
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { json } from "body-parser";
import mongoose from "./db/mongoose";
import { ssl_middleware } from "./app/middleware/ssl.middleware"

import { router } from "./app/modules/user/routes/user.routes";

const port = process.env.PORT

var app = express();
app.use(json())
app.use(cors())


app.use('/', router)

app.listen(port, () => {
    console.log(`Server started at  ${port}, ${process.env.NODE_ENV}, ${process.env.MONGODB_URI}`);
})


