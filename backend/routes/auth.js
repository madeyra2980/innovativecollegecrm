import express from "express";
import AuthController from "../controllers/AuthController.js";
const router = express.Router();

router.post("/register", AuthController.register);
router.get("/verify", AuthController.verifyEmail);
router.post("/login", AuthController.login);


export default router