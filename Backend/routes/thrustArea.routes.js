import {Router} from "express"
import multer from "multer"
import { verifyjwt } from "../middlewares/jwt.middleware.js"
import {verifyManagerOrAdmin} from "../middlewares/isAdminOrManager.middleware.js"
import {verifyManager} from "../middlewares/isManager.middleware.js"
import {verifyEmployee} from "../middlewares/isEmployee.middleware.js"
import { createThrustArea, deleteThrustArea, getAllThrustAreas, updateThrustArea } from "../controllers/ThrustArea.controller.js"
import { verifyAdmin } from "../middlewares/isAdmin.middleware.js"

const router=Router()
const formparser=multer().none()

router.route("/").get(verifyjwt,getAllThrustAreas)
router.route("/create").post(verifyjwt,verifyAdmin,createThrustArea)
router.route("/:id").put(verifyjwt,verifyAdmin,updateThrustArea)
router.route("/:id").delete(verifyjwt,deleteThrustArea)


export default router