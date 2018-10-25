import './environment/environment';
import express from "express";
import crypto from "crypto";
import https from "https";


import cors from "cors";
import { json } from "body-parser";
import fs from "fs";

import mongoose from "./db/mongoose";
// import { ssl_middleware } from "./app/middleware/ssl.middleware"

import { router } from "./app/modules/user/routes/user.routes";

const port = process.env.PORT
var privateKey = fs.readFileSync('privatekey.pem').toString();
var certificate = fs.readFileSync('certificate.pem').toString();
var credentials = crypto.createCredentials({ key: privateKey, cert: certificate });

var app = express();
app.use(json())
app.use(cors())

app.use('/', router)

https.createServer(app)
    .listen(port, () => {
        console.log(`Server started at  ${port}, ${process.env.NODE_ENV}, ${process.env.MONGODB_URI}`);
    })


