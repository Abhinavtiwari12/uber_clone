import mongoose, { Schema } from "mongoose";
import { User } from "./user.model";
import { driver } from "./driver.model";


const rideSchema  = new Schema ({

    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    driver: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "driver" 
    },
    pickup: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },  
        coordinates: {
            type: [Number], 
            required: true
        },  
        address: String
    },
    destination: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },  
        coordinates: {
            type: [Number], 
            required: true
        },  
        address: String
    },
    fare: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
       type: String,
       enum: ["requested", "accepted", "started", "completed", "cancelled"],
       default: "requested"
    },
    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,

    cancelReason: String,
},{ timestamps:true } )

export const Ride = new mongoose.model("Ride", rideSchema)