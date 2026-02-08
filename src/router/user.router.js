import { Router } from "express";
import { loginUser, registerUser } from "../controller/user.controller";



const router = Router()


router.route('/registerUser').post(registerUser)
router.route('/userlogin').post(loginUser)


export default router