import { Router } from "express";
import multer from "multer";
import { verifyjwt } from "../middlewares/jwt.middleware";
import { verifyManager } from "../middlewares/isManager.middleware";
import { approveGoal, editGoalBeforeApproval, getTeamGoals, returnGoal } from "../controllers/manageApproval.controller";

const router=Router()
const formparser=multer.none()

router.route("/team-goals").get(verifyjwt,verifyManager,getTeamGoals)
router.route("/goals/:id/approve").put(verifyjwt,verifyManager,approveGoal)
router.route("/goals/:id/return").put(verifyjwt,verifyManager,returnGoal)
router.route("/goals/:id/edit").put(verifyjwt,verifyManager,editGoalBeforeApproval)

export default router