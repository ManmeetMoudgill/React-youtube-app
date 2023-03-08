import express from "express";
import { signUp, googleAuth, signIn } from "../controllers/auth";

const router = express.Router();

//create a user
//sign IN
//google authentification

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/google-auth", googleAuth);

export default router;
