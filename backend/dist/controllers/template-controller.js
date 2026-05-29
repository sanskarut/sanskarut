import { z } from "zod";
import { EmailTemplate } from "../models.js";
// ─── Zod Validation Schemas ───────────────────────────────────────────────────
const createTemplateSchema = z.object({
    name: z.string().min(1, "Template name is required.").trim(),
    slug: z
        .string()
        .min(1, "Slug identifier is required.")
        .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens."),
    subject: z.string().min(1, "Default subject line is required.").trim(),
    htmlContent: z.string().min(1, "HTML template content must be provided."),
});
const updateTemplateSchema = createTemplateSchema.partial({
    name: true,
    subject: true,
}).extend({
    slug: z
        .string()
        .min(1)
        .regex(/^[a-z0-9-]+$/)
        .optional(),
    htmlContent: z.string().min(1).optional(),
});
// ─────────────────────────────────────────────────────────────────────────────
// 1. GET /api/v1/templates — Retrieve all templates
// ─────────────────────────────────────────────────────────────────────────────
export async function getTemplatesController(req, res, next) {
    try {
        const templates = await EmailTemplate.find()
            .sort({ updatedAt: -1 })
            .lean();
        res.status(200).json({
            success: true,
            count: templates.length,
            templates,
        });
    }
    catch (error) {
        next(error);
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// 2. GET /api/v1/templates/:id — Retrieve single template by ID
// ─────────────────────────────────────────────────────────────────────────────
export async function getTemplateByIdController(req, res, next) {
    try {
        const { id } = req.params;
        const template = await EmailTemplate.findById(id).lean();
        if (!template) {
            res.status(404).json({
                success: false,
                error: "Not Found",
                message: "The requested email template could not be located.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            template,
        });
    }
    catch (error) {
        next(error);
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// 3. POST /api/v1/templates — Create a new template
// ─────────────────────────────────────────────────────────────────────────────
export async function createTemplateController(req, res, next) {
    try {
        const parseResult = createTemplateSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                success: false,
                error: "Validation Failure",
                details: parseResult.error.flatten().fieldErrors,
            });
            return;
        }
        const { name, slug, subject, htmlContent } = parseResult.data;
        // Enforce unique slug constraint with descriptive conflict message
        const existing = await EmailTemplate.findOne({ slug }).select("_id").lean();
        if (existing) {
            res.status(409).json({
                success: false,
                error: "Duplicate Slug",
                message: `A template with the slug '${slug}' already exists. Choose a unique identifier.`,
            });
            return;
        }
        const template = await EmailTemplate.create({
            name,
            slug,
            subject,
            htmlContent,
        });
        res.status(201).json({
            success: true,
            message: "Email template created successfully.",
            template,
        });
    }
    catch (error) {
        next(error);
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// 4. PUT /api/v1/templates/:id — Update existing template (full replace)
// ─────────────────────────────────────────────────────────────────────────────
export async function updateTemplateController(req, res, next) {
    try {
        const { id } = req.params;
        const parseResult = createTemplateSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                success: false,
                error: "Validation Failure",
                details: parseResult.error.flatten().fieldErrors,
            });
            return;
        }
        const { name, slug, subject, htmlContent } = parseResult.data;
        // Check slug uniqueness, excluding the current document
        const duplicate = await EmailTemplate.findOne({
            slug,
            _id: { $ne: id },
        })
            .select("_id")
            .lean();
        if (duplicate) {
            res.status(409).json({
                success: false,
                error: "Duplicate Slug",
                message: `A template with the slug '${slug}' already exists.`,
            });
            return;
        }
        const template = await EmailTemplate.findByIdAndUpdate(id, { $set: { name, slug, subject, htmlContent } }, { new: true, runValidators: true });
        if (!template) {
            res.status(404).json({
                success: false,
                error: "Not Found",
                message: "The email template to update could not be found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Email template updated successfully.",
            template,
        });
    }
    catch (error) {
        next(error);
    }
}
// ─────────────────────────────────────────────────────────────────────────────
// 5. DELETE /api/v1/templates/:id — Delete a template permanently
// ─────────────────────────────────────────────────────────────────────────────
export async function deleteTemplateController(req, res, next) {
    try {
        const { id } = req.params;
        const template = await EmailTemplate.findByIdAndDelete(id);
        if (!template) {
            res.status(404).json({
                success: false,
                error: "Not Found",
                message: "The email template to delete could not be found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Email template deleted successfully.",
        });
    }
    catch (error) {
        next(error);
    }
}
