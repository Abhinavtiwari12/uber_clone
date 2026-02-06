// require ('dotenv').config()

import dotenv from 'dotenv'

import express from "express";


import { app } from './app.js'

dotenv.config({
    path: '.env'
})




app.listen(process.env.PORT)