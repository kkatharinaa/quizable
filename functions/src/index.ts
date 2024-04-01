
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express from "express";

const app = express()

app.get("/", (request: express.Request, response: express.Response) => {
    response.send("Hello World from express.")
})

const firebaseMainFunction = onRequest(app)

export {firebaseMainFunction}
