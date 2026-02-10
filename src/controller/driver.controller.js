import express from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { driver } from "../models/driver.model.js";
import { findDriver, registerDriver } from "../service/driver.service.js";
import { apiResponse } from "../utils/apiResponse.js";



const generateAccessAndRefereshTokens = asyncHandler (async (userId) => {
    try {
        const driver = await driver.findById(userId)

        if (!driver) {
            throw new ApiError("driver not found while generatiing token")
        }

        const accessToken = driver.generateAccessToken()
        const refreshToken = driver.genetrateRefreshToken()

        driver.refreshToken = refreshToken
        await driver.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "somthing went wrong while generation and refreshing token!!")
    }
})


const registationForDriver = asyncHandler (async (req, res) => {

    const {fullName, userName, email, password, vehicle, phoneNumber} = req.body

     if (
        [fullName, userName, password, email, phoneNumber].some((field) => !field?.trim() ) || !vehicle
    ) {
        throw new ApiError(400, "All feilds are require")
    }

    const existedDriver = {
        userName,
        email
    }
    const checkExistedDriver = await findDriver(existedDriver)

    const registerNewDriver = {
        fullName,
        userName,
        password,
        phoneNumber,
        vehicle,
        email
    }

    const registerdDriver = await registerDriver(registerNewDriver)

    return res.status(201).json(
        new apiResponse(201, registerdDriver.data, registerdDriver.message)
    )
})

export { registationForDriver }