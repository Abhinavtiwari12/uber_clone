import express from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { User } from "../models/user.model";
import { findUser, registerUser } from "../service/user.service";





const generateAccesaAndRefreshToken = async(userId) => {
   try {
     const user = await User.findById(userId)
     const accesToken = user.generateAccesToken()
     const refreshToken = user.generateRefreshToken()
 
     user.refreshToken = refreshToken
     await user.save({ validateBeforSave: false })
 
     return accesToken, refreshToken
   } catch (error) {
        throw new ApiError(500, "Somthing went wrong while generating access and refresh token!!")
   }
}


const registerUser = asyncHandler(async (req, res) => {
    const  { fullName, password, email, userNmae } =req.body

    if (
        [fullName, userNmae, password, email].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are require")
    }

    const checkExistedUser = {
        userNmae,
        email
    }
    const existedUser = await findUser(checkExistedUser)

    const createUser = {
        fullName,
        email,
        password,
        userNmae: userNmae.toLowerCase()
    }

    const registeredUser = await registerUser(createUser)

    return res.status(201).json(
        new apiResponse(201, registeredUser.data, registeredUser.message)
    )
})


const loginUser = asyncHandler(async (req, res) => {

    const {email, userNmae, password} = req.body

    if (!userNmae && !email) {
        throw new ApiError(401, "Username or email is require.")
    }

    const user = await User.findOne({
        $or: [{userNmae}, {email}]
    })

    if (!user) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const checkPassword = await user.isPasswordCorrect(password)

    if (!checkPassword) {
        throw new ApiError(400, "username, email or password is wrong.")
    }

    const {accesToken, refreshToken} = await generateAccesaAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -accessToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, { user: loggedInUser, accessToken, refreshToken}, "user loggedIn successfull."))
})





export { 
    registerUser,
    loginUser
 }