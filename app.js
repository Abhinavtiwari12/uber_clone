import express from "express";


const app = express();

app.get('/', (req, res) => {
    res.send("helo world")
})

export { app }