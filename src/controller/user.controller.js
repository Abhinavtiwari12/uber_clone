import express from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { findUser, registerUser } from "../service/user.service.js";
import { Ride } from "../models/ride.model.js";





const generateAccessAndRefereshTokens = async(userId) => {
   try {
     const user = await User.findById(userId)
       if (!user) {
    throw new Error("User not found while generating tokens");
  }
     const accessToken = user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()
 
     user.refreshToken = refreshToken
     await user.save({ validateBeforeSave: false })
 
     return {accessToken, refreshToken}
   } catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating access and refresh token!!")
   }
}


const createUser = asyncHandler(async (req, res) => {
    const  { fullName, password, email, userName } =req.body

    if (
        [fullName, userName, password, email].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are require")
    }

    const checkExistedUser = {
        userName,
        email
    }
    const existedUser = await findUser(checkExistedUser)

    const createUser = {
        fullName,
        email,
        password,
        userName: userName.toLowerCase()
        // userNmae,
    }

    const registeredUser = await registerUser(createUser)

    return res.status(201).json(
        new apiResponse(201, registeredUser.data, registeredUser.message)
    )
})


const userlogin = asyncHandler(async (req, res) => {

    const {email, userName, password} = req.body

    if (!userName && !email) {
        throw new ApiError(401, "Username or email is require.")
    }

    const query = email ? { email } : { userName };

    const user = await User.findOne(query)

    if (!user) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, { user: loggedInUser, accessToken, refreshToken}, "user loggedIn successfull."))
})


const userlogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
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


const userProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};


const createRide = asyncHandler(async (req, res) => {

    const { pickup, destination, fare } = req.body

    // console.log("req.body><><><>", req.body)
    if (!pickup?.coordinates || !destination?.coordinates || !fare) {
        throw new ApiError(400, "All fields are required")
    }

    const ride = await Ride.create({
        user: req.user._id,   
        pickup,
        destination,
        fare,
        status: "requested"
    })

    return res.status(201).json({
        success: true,
        message: "Ride created successfully",
        ride
    })
})

const cancelRide = asyncHandler(async (req, res) => {

    const { rideId } = req.params

    const ride = await Ride.findOne({
        _id: rideId,
        user: req.user._id
    })

    if (!ride) {
        throw new ApiError(404, "Ride not found")
    }

    if (["completed", "cancelled"].includes(ride.status)) {
        throw new ApiError(400, "Ride cannot be cancelled")
    }

    ride.status = "cancelled"
    ride.cancelledAt = new Date()
    ride.cancelReason = "Cancelled by user"

    await ride.save()

    return res.status(200).json({
        success: true,
        message: "Ride cancelled successfully",
        ride
    })
})

const getUserRides = asyncHandler(async (req, res) => {

    const rides = await Ride.find({
        user: req.user._id
    })
    .populate("driver", "fullName phoneNumber vehicle")
    .sort({ createdAt: -1 })

    return res.status(200).json({
        success: true,
        count: rides.length,
        rides
    })
})


export { 
    createUser,
    userlogin,
    userlogout,
    userProfile,
    createRide,
    cancelRide,
    getUserRides
 }