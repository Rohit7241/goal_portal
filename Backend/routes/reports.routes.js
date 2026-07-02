import { Router } from "express";
import { verifyjwt } from "../middlewares/jwt.middleware.js";
import { verifyAdmin } from "../middlewares/isAdmin.middleware.js";
import { verifyManagerOrAdmin } from "../middlewares/isAdminOrManager.middleware.js";
import multer from "multer";
import { exportCSV, getAchievementReport, getAuditLog, getCompletionDashboard } from "../controllers/report.controller.js";

const router=Router()
const formparser=multer().none()
router.route("/achievement").get(verifyjwt,verifyManagerOrAdmin,getAchievementReport)
router.route("/completion").get(verifyjwt,verifyManagerOrAdmin,getCompletionDashboard)
router.route("/audit-log").get(verifyjwt,verifyAdmin,getAuditLog)
router.route("export").get(verifyjwt,verifyManagerOrAdmin,exportCSV)

export default router