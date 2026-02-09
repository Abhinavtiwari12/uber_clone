import express from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { findUser, registerUser } from "../service/user.service.js";





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

    const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    if (!user) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -accessToken")

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





export { 
    createUser,
    userlogin,
    userlogout
 }