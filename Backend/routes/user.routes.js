import { Router } from "express";
import { verifyjwt } from "../middlewares/jwt.middleware.js";
import multer from "multer";
import { login, register } from "../controllers/user.controller.js";
const router=Router();
const formparser=multer().none();
router.route("/register").post(formparser,register)
// router.route("/logout").post(formparser,verifyjwt,logoutuser)
router.route("/login").post(formparser,login);
// router.route("/:userid/getuser").get(formparser,getuserbyid)
// router.route("/getuser").get(verifyjwt,getuser)
export default router 