import express from "express";
// import { sign } from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
// import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const driverSchema = new Schema ({
    fullName: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        toLowerCase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "invilade Email."
        }
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        minlength: [ 10, 'Color must be at least 10 characters long' ],
    },
     socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: [ 'active', 'inactive' ],
        default: 'inactive',
    },
    vehicle: {
        color: {
            type: String,
            required: true,
        },
        plate: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: [ 1, 'Capacity must be at least 1' ],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: [ 'car', 'motorcycle', 'auto' ],
        }
    },
    location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
})

driverSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

driverSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

driverSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        userName: this.userName,
        email: this.email,
        fullName: this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

driverSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }

)
}



export const driver = new mongoose.model("driver", driverSchema)