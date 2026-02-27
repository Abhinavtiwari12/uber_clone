import { Router } from "express";
import { 
    userlogin, 
    createUser, 
    userlogout, 
    userProfile, 
    createRide, 
    cancelRide, 
    getUserRides, 
    getRideCurrentStatus 
} from "../controller/user.controller.js";
import { verifyUserjwt } from "../middleware/autho.middleware.js";


const router = Router()


router.route('/registerUser').post(createUser)
router.route('/userlogin').post(userlogin)
router.route('/userlogout').post(verifyUserjwt,userlogout)
router.route('/userProfile').post(verifyUserjwt,userProfile)
router.route('/createRide').post(verifyUserjwt, createRide)
router.route('/cancelRide/:rideId').post(verifyUserjwt, cancelRide)
router.route('/getUserRides').get(verifyUserjwt, getUserRides)
router.route('/getRideCurrentStatus/:rideId').get(verifyUserjwt, getRideCurrentStatus)


export default router