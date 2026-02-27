import { Router } from "express";
import { 
    acceptRide, 
    completeRide, 
    driverlogout, 
    driverProfile, 
    getDriverRideHistory, 
    getDriverTotalEarnings, 
    logingDriver, 
    registationForDriver, 
    startRide, 
    toggleDriverAvailability, 
    updateDriverLocation 
} from "../controller/driver.controller.js";
import { verifyDriverjwt } from "../middleware/autho.middleware.js";


const router = Router()


router.route('/createDriver').post(registationForDriver)
router.route('/loginDriver').post(logingDriver)
router.route('/driverProfile').get(verifyDriverjwt ,driverProfile)
router.route('/driverLogout').post(verifyDriverjwt, driverlogout)
router.route('/acceptRide').post(verifyDriverjwt, acceptRide)
router.route('/startRide/:rideId').post(verifyDriverjwt, startRide)
router.route('/completeRide/:rideId').post(verifyDriverjwt, completeRide)
router.route('/updateDriverLocation').post(verifyDriverjwt, updateDriverLocation)
router.route('/toggleDriverAvailability').post(verifyDriverjwt, toggleDriverAvailability)
router.route('/getDriverTotalEarnings').get(verifyDriverjwt, getDriverTotalEarnings)
router.route('/getDriverRideHistory').get(verifyDriverjwt, getDriverRideHistory)


export default router