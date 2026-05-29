import { Router } from "express";
import { checkEmailController, loginController, signupController, getMeController, } from "../controllers/auth-controller.js";
import { authorizeJwt } from "../middleware/jwt-auth.js";
const router = Router();
// ── Public routes (no auth required) ──────────────────────────────────────────
// Step 1 of Google-style flow: check if email exists in the system
router.post("/check-email", checkEmailController);
// Step 2a: existing user login with password + JWT issuance
router.post("/login", loginController);
// Step 2b: new user account creation with FREE plan assignment + JWT issuance
router.post("/signup", signupController);
// ── Protected routes (JWT session required) ───────────────────────────────────
// Dashboard: fetch current user profile + live usage stats
router.get("/me", authorizeJwt, getMeController);
export default router;
