import express from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Driver } from "../models/driver.model.js";
import { findDriver, registerDriver } from "../service/driver.service.js";
import { apiResponse } from "../utils/apiResponse.js";



const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const newdriver = await Driver.findById(userId)
        console.log("new driver is ", newdriver);
        
        if (!newdriver) {
            throw new ApiError("driver not found while generatiing token")
        }

        console.log("post debug 1");
        
        const accessToken = newdriver.generateAccessToken()
        console.log("accessToken", accessToken);
        
        const refreshToken = newdriver.generateRefreshToken()
        console.log("refreshToken", refreshToken);

        newdriver.refreshToken = refreshToken
        await newdriver.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "somthing went wrong while generation and refreshing token!!")
    }
}


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

const logingDriver = asyncHandler (async (req, res, next) => {
    const {email, userName, password} = req.body

    if (!userName && !email) {
        throw new ApiError(400,"provide details for login")
    }

    const query = email? {email} : {userName}

    const driver = await Driver.findOne(query)

    if (!driver) {
        throw new ApiError(401, "email or password is wrong")
    }

    const checkPassword = await driver.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(401, "email or password is wrong")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(driveR._id)

    const loogedInDriver = await Driver.findById(driver._id).select("-password")

    const options  ={
        httpOnly: true,
        secure : true,
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, {driver : loogedInDriver, accessToken, refreshToken}, "driver loggedIn successfull."))
})


const driverlogout = asyncHandler(async (req, res) => {
    await Driver.findByIdAndUpdate(
        req.driver._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200,{}, "User logout success."))
})

const driverProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    driver: req.driver,
  });
}

export { registationForDriver, logingDriver, driverlogout, driverProfile }