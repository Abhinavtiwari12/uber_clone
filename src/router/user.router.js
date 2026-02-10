import { Router } from "express";
import { userlogin, createUser, userlogout, userProfile } from "../controller/user.controller.js";
import { verifyUserjwt } from "../middleware/autho.middleware.js";



const router = Router()


router.route('/registerUser').post(createUser)
router.route('/userlogin').post(userlogin)
router.route('/userlogout').post(verifyUserjwt,userlogout)
router.route("/userProfile").post(verifyUserjwt,userProfile)


// export default router
export default router