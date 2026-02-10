import { Router } from "express";
import { registationForDriver } from "../controller/driver.controller.js";


const router = Router()


router.route('/createDriver').post(registationForDriver)


export default router