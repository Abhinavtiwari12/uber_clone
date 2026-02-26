import { Router } from "express";
import { acceptRide, driverlogout, driverProfile, logingDriver, registationForDriver } from "../controller/driver.controller.js";
import { verifyDriverjwt } from "../middleware/autho.middleware.js";


const router = Router()


router.route('/createDriver').post(registationForDriver)
router.route('/loginDriver').post(logingDriver)
router.route('/driverProfile').get(verifyDriverjwt ,driverProfile)
router.route('/driverLogout').post(verifyDriverjwt, driverlogout)
router.route('/acceptRide').post(verifyDriverjwt, acceptRide)


export default router