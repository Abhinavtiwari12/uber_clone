import express from "express";
import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator"


const userSchema = new Schema ({
    fullName:{
        type: String,
        require: true,
        index: true
    },
    userName:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true      
    },
    password:{
        type: String,
        require: true,
        // select: false
    },
    email:{
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate:{
            validator: validator.isEmail,
            message: "Invilade email"
        }
    },
    refreshToken:{
        type: String
    },
},{timestamps: true}
)


userSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        userName: this.userName,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign( {
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {

        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const  User = new mongoose.model("User", userSchema)