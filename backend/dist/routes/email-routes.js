import { Router } from "express";
import { sendEmailController, getEmailLogsController, getDeveloperTemplatesController, } from "../controllers/email-controller.js";
import { authorizeApiKey } from "../middleware/auth.js";
import { authorizeJwt } from "../middleware/jwt-auth.js";
import { checkRateLimit } from "../middleware/rate-limiter.js";
const router = Router();
// POST /api/v1/emails/send
// Middleware chain:
//   1. authorizeApiKey  → validates SK bearer token, populates req.user
//   2. checkRateLimit   → enforces MongoDB-driven plan quota, increments counter
//   3. sendEmailController → processes and dispatches the email
router.post("/send", authorizeApiKey, checkRateLimit, sendEmailController);
// GET /api/v1/emails/templates
// Allows external developer integrations to query all available templates using API keys
router.get("/templates", authorizeApiKey, getDeveloperTemplatesController);
// GET /api/v1/emails/logs
// Retrieves actual email log documents from MongoDB for the active dashboard user
router.get("/logs", authorizeJwt, getEmailLogsController);
export default router;
