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








export { registerUser }