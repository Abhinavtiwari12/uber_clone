import express from "express";
import cors from "cors";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGON,
    credentials: true
}))



app.get('/', (req, res) => {
    res.send("helo world")
})

export { app }