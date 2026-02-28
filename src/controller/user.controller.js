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
    const  { fullName, password, email, userName,phoneNumber } =req.body

    if (
        [fullName, userName, password, email, phoneNumber].some((feild) => feild?.trim() === "")
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
        phoneNumber,
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

    const { pickup, destination, distance } = req.body

    // console.log("req.body><><><>", req.body)
    if (!pickup?.coordinates || !destination?.coordinates || !distance) {
        throw new ApiError(400, "All fields are required")
    }

    if (distance <= 0) {
        throw new ApiError(400, "Distance must be greater than 0")
    }

    // Pricing Logic
    const baseFare = 40
    const perKmRate = 15

    let totalFare = baseFare + (perKmRate * distance)

    if (totalFare < 60) totalFare = 60

    const ride = await Ride.create({
        user: req.user._id,   
        pickup,
        destination,
        distance,
        fare: totalFare,
        status: "requested"
    })

    await User.findByIdAndUpdate(
        req.user._id,
        { $push: { rides: ride._id } }
    )

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

const getRideCurrentStatus = asyncHandler( async (req, res) => {

    const { rideId } = req.params

    const ride = await Ride.findOne({
        _id: rideId,
        user: req.user._id
    }).select(" status acceptedAt startedAt completedAt cancelledAt driver ")

    if (!ride) {
        throw new ApiError(400, "ride not found ")
    }

    return res.status(200).json({
        success: true,
        rideId: ride._id,
        status: ride.status,
        timeline: {
            acceptedAt: ride.acceptedAt,
            startedAt: ride.startedAt,
            completedAt: ride.completedAt,
            cancelledAt: ride.cancelledAt
        }
    })

})

const addTipToRide = asyncHandler(async (req, res) => {

    const { rideId } = req.params
    const { tipAmount } = req.body

    if (!tipAmount || tipAmount <= 0) {
        throw new ApiError(400, "Valid tip amount required")
    }

    const ride = await Ride.findById(rideId)

    if (!ride) {
        throw new ApiError(404, "Ride not found")
    }

    if (ride.status !== "completed") {
        throw new ApiError(400, "Tip can only be added after ride completion")
    }

    if (ride.tip > 0) {
        throw new ApiError(400, "Tip already added for this ride")
    }

    ride.tip = tipAmount
    await ride.save()

    return res.status(200).json({
        success: true,
        message: "Tip added successfully",
        tip: ride.tip
    })
})

export { 
    createUser,
    userlogin,
    userlogout,
    userProfile,
    createRide,
    cancelRide,
    getUserRides,
    getRideCurrentStatus,
    addTipToRide
 }