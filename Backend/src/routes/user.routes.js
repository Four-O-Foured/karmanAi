import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, (req, res) => {
    res.json(req.user);
});
router.get("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.status(200).json({message: "Logout successful" });
});

export default router;