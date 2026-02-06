// require ('dotenv').config()

import dotenv from 'dotenv'

import express from "express";
import connectDB from "./database/db.js";

import { app } from './app.js'

dotenv.config({
    path: '.env'
})



connectDB()
.then(() => {
    app.listen(process.env.PORT || 3001, () => {
        console.log(`server is running on port: ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("mongoose connectioon failed", err)
})