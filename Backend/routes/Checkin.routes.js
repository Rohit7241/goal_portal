import {Router} from "express"
import multer from "multer"
import { verifyjwt } from "../middlewares/jwt.middleware"
import {verifyManagerOrAdmin} from "../middlewares/isAdminOrManager.middleware"
import {verifyManager} from "../middlewares/isManager.middleware"
import {verifyEmployee} from "../middlewares/isEmployee.middleware"
import { getActiveWindow, getMyCheckins, getTeamCheckins, submitCheckin } from "../controllers/checkin.controller"

const router=Router()
const formparser=multer.none()

router.route("/active-window").get(verifyjwt,getActiveWindow)
router.route("/submit").post(verifyjwt,verifyEmployee,submitCheckin)
router.route("/my-checkins").get(verifyjwt,verifyEmployee,getMyCheckins)
router.route("/team-checkins").get(verifyjwt,verifyManager,getTeamCheckins)
router.route("/:id/comment").get(verifyjwt,verifyManager,getActiveWindow)

export default router