import { Router } from "express";
import { loginUser, createUser, userlogout } from "../controller/user.controller.js";



const router = Router()


router.route('/registerUser').post(createUser)
router.route('/userlogin').post(loginUser)
router.route('/userlogout').post(userlogout)


// export default router
export default router