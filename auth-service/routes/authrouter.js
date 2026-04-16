import { Router } from "express";
const router = Router();

import {
    register,
    login,
    logout,    
    forgotPassword, 
    resetPassword,
    updateProfile,
    verifyToken,
} from "../controllers/authcontroller.js";
import {
  validateRegisterInput,
  validateLoginInput,
} from "../middleware/validatormiddleware.js";
import { authenticateUser } from "../middleware/authmiddleware.js";

router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);
router.post("/logout", logout);
router.post("/verify", verifyToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", authenticateUser, updateProfile);

export default router;
