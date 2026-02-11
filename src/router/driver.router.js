import { Router } from "express";
import { logingDriver, registationForDriver } from "../controller/driver.controller.js";


const router = Router()


router.route('/createDriver').post(registationForDriver)
router.route('/loginDriver').post(logingDriver)


export default router