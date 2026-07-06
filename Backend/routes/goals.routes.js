import { Router } from "express";
import { verifyjwt } from "../middlewares/jwt.middleware.js";
import multer from "multer";
import {
    CreateGoal,
    editGoal,
    getMyGoals,
    getSingleGoal,
    SubmitGoals
} from "../controllers/goal.controller.js";

const formparser = multer().none();
const router = Router();

router.use(verifyjwt);

router.post("/create", formparser, CreateGoal);
router.put("/:id", formparser, editGoal);
router.get("/my-goals", getMyGoals);
router.get("/:id", getSingleGoal);
router.post("/submit", SubmitGoals);

export default router;