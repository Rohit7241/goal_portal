import {Router} from "express"
import multer from "multer"
import { verifyjwt } from "../middlewares/jwt.middleware"
import {verifyAdmin} from "../middlewares/isAdmin.middleware"
import { activateWindow, CreateWindow, deactivateWindow, getAllUsers, getAllWindows, shareGoal, unlockGoal } from "../controllers/admin.controller"
const router=Router()
const formparser=multer.none()

router.route("/windows/create").post(verifyjwt,verifyAdmin,CreateWindow)
router.route("windows/:id/activate").put(verifyjwt,verifyAdmin,activateWindow)
router.route("windows/:id/deactivate").put(verifyjwt,verifyAdmin,deactivateWindow)
router.route("windows").get(verifyjwt,verifyAdmin,getAllWindows)
router.route("goals/:id/unlock").put(verifyjwt,verifyAdmin,unlockGoal)
router.route("goals/share").post(verifyjwt,verifyAdmin,shareGoal)

export default router