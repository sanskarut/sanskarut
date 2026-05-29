import { Router } from "express";
import { getTemplatesController, getTemplateByIdController, createTemplateController, updateTemplateController, deleteTemplateController, } from "../controllers/template-controller.js";
import { authorizeJwt } from "../middleware/jwt-auth.js";
const router = Router();
// All dashboard template routes require authenticated JWT session tokens
router.use(authorizeJwt);
router.get("/", getTemplatesController);
router.get("/:id", getTemplateByIdController);
router.post("/", createTemplateController);
router.put("/:id", updateTemplateController);
router.delete("/:id", deleteTemplateController);
export default router;
