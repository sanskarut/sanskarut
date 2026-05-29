import { Router } from "express";
import { getApiKeysController, createApiKeyController, deleteApiKeyController, } from "../controllers/api-key-controller.js";
import { authorizeJwt } from "../middleware/jwt-auth.js";
const router = Router();
// All developer API key routes require authenticated JWT session tokens
router.use(authorizeJwt);
router.get("/", getApiKeysController);
router.post("/", createApiKeyController);
router.delete("/:id", deleteApiKeyController);
export default router;
