import {Router} from "express"
import multer from "multer"
import { verifyjwt } from "../middlewares/jwt.middleware"
import {verifyManagerOrAdmin} from "../middlewares/isAdminOrManager.middleware"
import {verifyManager} from "../middlewares/isManager.middleware"
import {verifyEmployee} from "../middlewares/isEmployee.middleware"
import { createThrustArea, deleteThrustArea, getAllThrustAreas, updateThrustArea } from "../controllers/ThrustArea.controller"
import { verifyAdmin } from "../middlewares/isAdmin.middleware"

const router=Router()
const formparser=multer.none()

router.route("/").get(verifyjwt,getAllThrustAreas)
router.route("/create").post(verifyjwt,verifyAdmin,createThrustArea)
router.route("/:id").put(verifyjwt,verifyAdmin,updateThrustArea)
router.route("/:id").delete(verifyjwt,deleteThrustArea)


export default router