import { Router } from "express";
import { verifyjwt } from "../middlewares/jwt.middleware.js";
import multer from "multer";
import { CreateGoal, editGoal, getMyGoals, getSingleGoal, SubmitGoals } from "../controllers/goal.controller.js";

const formparser=multer().none()
const router=Router()

router.route("/CreateGoals").post(formparser,CreateGoal)
router.route("/EditGoal").post(formparser,editGoal)
router.route("/GetMyGoals").post(formparser,getMyGoals)
router.route("/getSingleGoal").post(formparser,getSingleGoal)
router.route("/SubmitGoal").post(formparser,SubmitGoals)

export default router
