import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/router/user.router.js"
import driverRoute from "./src/router/driver.router.js"


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGON,
    credentials: true
}))



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());


// app.get('/', (req, res) => {
//     res.send("helo world")
// })


app.use('/api/v1/user', userRouter)
app.use('/api/v1/driver', driverRoute)

export { app }