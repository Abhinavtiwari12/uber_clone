import { Router } from "express";
import { loginUser, registerUser, userlogout } from "../controller/user.controller";



const router = Router()


router.route('/registerUser').post(registerUser)
router.route('/userlogin').post(loginUser)
router.route('/userlogout').post(userlogout)


export default router