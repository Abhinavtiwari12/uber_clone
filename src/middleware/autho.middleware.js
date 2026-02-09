import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";



 const verifyUserjwt = asyncHandler( async (req, res, next) => {
    // try {
        // const token = req.cookies?.accessToken  ||  req.header("Authorization")?.replace("Bearer", "")
        console.log("header><><><><>>", req.header)
        console.log("cookies><><><><",req.cookies)

        const token = req.cookies?.accessToken  ||  req.header("Authorization")?.replace("Bearer ", "").trim()

        console.log("token><><><><<><><>", token)

        if (!token) {
            throw new ApiError(401, "unathorized access")
        }

        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(401, "invilad access token.")
        }

        req.user = user;
        next()

    // } catch (error) {
    //     throw new ApiError(400, "invilad token access.")
    // }
})


export { verifyUserjwt }