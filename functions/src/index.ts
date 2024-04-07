import {onRequest} from "firebase-functions/v2/https";
import express from "express";

const app = express()

app.get("/", (request: express.Request, response: express.Response) => {
    response.send("Hello World from express.")
})

const firebaseMainFunction = onRequest(app)

export {firebaseMainFunction}
