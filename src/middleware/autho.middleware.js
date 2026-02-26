import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Driver } from "../models/driver.model.js";
import { findDriver } from "../service/driver.service.js";



 const verifyUserjwt = asyncHandler( async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken  ||  req.header("Authorization")?.replace("Bearer ", "")

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

    } catch (error) {
        throw new ApiError(400, "invilad token access.")
    }
})


 const verifyDriverjwt = asyncHandler( async (req, res, next) => {
    try {

        const token = req.cookies?.accessToken  ||  req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unathorized access")
        }

        const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const driveR = await Driver.findById(decodedToken?._id).select("-password -refreshToken")

        if (!driveR) {
            throw new ApiError(401, "invilad access token.")
        }

        req.driveR = driveR;
        next()

    } catch (error) {
        throw new ApiError(400, "invilad token access.")
    }
})


export { verifyUserjwt, verifyDriverjwt }