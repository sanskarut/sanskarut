import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import nodemailer from "nodemailer"
import { EmailLog, EmailTemplate } from "../models.js"


// Strict payload input validations utilizing Zod supporting optional database templates
const sendEmailSchema = z.object({
  to: z.string().email("Invalid recipient email structure."),
  subject: z.string().optional(),
  title: z.string().optional(),
  bodyContent: z.string().optional(),
  ctaText: z.string().optional(),
  ctaUrl: z.string().url("CTA Link must represent a valid web URL.").optional(),
  templateSlug: z.string().min(1).optional(),
  templateId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Template ID must be a valid 24-character hexadecimal Mongoose ObjectId.").optional(),
  variables: z.record(z.string(), z.any()).optional(),
}).refine((data) => {
  // If templateSlug and templateId are both omitted, the user must provide subject, title, and bodyContent
  if (!data.templateSlug && !data.templateId) {
    return !!data.subject && !!data.title && !!data.bodyContent
  }
  return true
}, {
  message: "When both templateSlug and templateId are omitted; subject, title, and bodyContent are strictly required.",
  path: ["templateSlug"]
})

// Configure Nodemailer Transport
// Includes automated test account fallback if environment variables are missing
const getTransporter = async () => {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    // Return mock fallback logging transporter
    return {
      sendMail: async (mailOptions: any) => {
        console.log("------- [SMTP MOCK SIMULATION] -------")
        console.log(`To: ${mailOptions.to}`)
        console.log(`Subject: ${mailOptions.subject}`)
        console.log("--------------------------------------")
        return { messageId: `mock-msg-${Date.now()}` }
      }
    }
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port || "587"),
    secure: port === "465",
    auth: {
      user,
      pass,
    },
  })
}

// Generates highly compatible and responsive email structures using table templates
function renderEmailTemplate(
  title: string,
  bodyContent: string,
  ctaText?: string,
  ctaUrl?: string
): string {
  const ctaButtonHtml = ctaText && ctaUrl
    ? `
      <tr>
        <td align="center" style="padding: 24px 0 8px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" bgcolor="#2563eb" style="border-radius: 8px;">
                <a href="${ctaUrl}" target="_blank" style="font-size: 14px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 12px 28px; border: 1px solid #2563eb; display: inline-block;">
                  ${ctaText}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : ""

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; min-width: 100%; background-color: #f8fafc; }
        img { height: auto; line-height: 100%; border: 0; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f8fafc" style="table-layout: fixed;">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <!-- Main Content Card Container -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <!-- Navy Accent Header -->
              <tr>
                <td bgcolor="#0b192c" align="center" style="padding: 40px 40px 30px 40px;">
                  <h1 style="color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">
                    SANSKARUT
                  </h1>
                  <p style="color: #3b82f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; font-weight: bold; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">
                    Developer Mail Service Gateway
                  </p>
                </td>
              </tr>

              <!-- Email Body Section -->
              <tr>
                <td style="padding: 40px 40px 30px 40px; background-color: #ffffff;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="color: #0b192c; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9;">
                        ${title}
                      </td>
                    </tr>
                    <tr>
                      <td style="color: #334155; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; line-height: 24px; font-weight: 500; padding: 24px 0 10px 0;">
                        ${bodyContent.replace(/\n/g, "<br>")}
                      </td>
                    </tr>
                    
                    <!-- Call To Action Button (Conditional Grid injection) -->
                    ${ctaButtonHtml}

                  </table>
                </td>
              </tr>

              <!-- Footer Section -->
              <tr>
                <td bgcolor="#f8fafc" style="padding: 24px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="color: #64748b; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; line-height: 18px; margin: 0;">
                    You are receiving this transaction log via active node instances of Sanskarut Tech Team.
                  </p>
                  <p style="color: #94a3b8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 500; margin: 10px 0 0 0;">
                    &copy; ${new Date().getFullYear()} Sanskarut Tech Team. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
}

export async function sendEmailController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate inputs against Zod schema
    const parseResult = sendEmailSchema.safeParse(req.body)

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: "Validation Failure",
        details: parseResult.error.flatten().fieldErrors,
      })
      return
    }

    const { to, subject, title, bodyContent, ctaText, ctaUrl, templateSlug, templateId, variables } = parseResult.data
    const senderId = req.user?.id || req.apiKeyId // Fallback to bound auth keys

    if (!senderId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "No active user context detected for request.",
      })
      return
    }

    let finalSubject = subject || ""
    let htmlBody = ""
    let resolvedTemplateSlug: string | null = null

    if (templateSlug || templateId) {
      let template = null
      if (templateId) {
        template = await EmailTemplate.findById(templateId)
        if (!template) {
          res.status(400).json({
            success: false,
            error: "Template Not Found",
            message: `The template ID "${templateId}" could not be located in the database.`,
          })
          return
        }
      } else if (templateSlug) {
        template = await EmailTemplate.findOne({ slug: templateSlug.trim().toLowerCase() })
        if (!template) {
          res.status(400).json({
            success: false,
            error: "Template Not Found",
            message: `The template slug "${templateSlug}" could not be located in the database.`,
          })
          return
        }
      }

      if (template) {
        resolvedTemplateSlug = template.slug
        // Compile subject line with variables
        finalSubject = subject || template.subject
        const vars = variables || {}
        for (const [key, val] of Object.entries(vars)) {
          finalSubject = finalSubject.replace(new RegExp(`{{${key}}}`, "g"), String(val))
        }

        // Compile HTML body content with variables
        let compiledHtml = template.htmlContent
        for (const [key, val] of Object.entries(vars)) {
          compiledHtml = compiledHtml.replace(new RegExp(`{{${key}}}`, "g"), String(val))
        }
        htmlBody = compiledHtml
      }
    } else {
      finalSubject = subject || "Developer Notification"
      htmlBody = renderEmailTemplate(title || "Gateway Event", bodyContent || "", ctaText, ctaUrl)
    }

    // Respond to user early with Accepted state
    res.status(202).json({
      success: true,
      message: "Email queued for asynchronous delivery.",
      recipient: to,
      templateSlug: resolvedTemplateSlug || templateSlug || null,
    })

    // Initiate delivery pipeline asynchronously
    const transporter = await getTransporter()
    
    transporter.sendMail({
      from: process.env.SMTP_FROM || `"Sanskarut Developer Gateway" <noreply@sanskarut.com>`,
      to,
      subject: finalSubject,
      html: htmlBody,
    })
    .then(async (info: any) => {
      // Log successful delivery
      await EmailLog.create({
        senderId,
        recipientEmail: to,
        subject: finalSubject,
        templateSlug: resolvedTemplateSlug || templateSlug || null,
        status: "Delivered",
      })
      console.log(`[Email Success] Delivered message log saved for ${to}. ID: ${info.messageId}`)
    })
    .catch(async (error: any) => {
      // Log failed transmission
      await EmailLog.create({
        senderId,
        recipientEmail: to,
        subject: finalSubject,
        templateSlug: resolvedTemplateSlug || templateSlug || null,
        status: "Failed",
        errorMessage: error.message || "Failed during Nodemailer transport sequence.",
      })
      console.error(`[Email Error] Failed transmission logged for ${to}:`, error)
    })

  } catch (error) {
    next(error)
  }
}

// Fetch real email transmission logs from database
export async function getEmailLogsController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id

    if (!userId) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "Active session required to fetch logs.",
      })
      return
    }

    const logs = await EmailLog.find({ senderId: userId }).sort({ timestamp: -1 })

    const formattedLogs = logs.map((log) => ({
      id: log._id.toString(),
      recipient: log.recipientEmail,
      subject: log.subject,
      timestamp: log.timestamp.toISOString().replace("T", " ").substring(0, 19).replace(" ", " "),
      status: log.status,
      errorMessage: log.errorMessage,
    }))

    res.status(200).json({
      success: true,
      logs: formattedLogs,
    })
  } catch (error) {
    next(error)
  }
}

// GET /api/v1/emails/templates
// Allows external developer APIs to query and select seeded/custom templates in real-time
export async function getDeveloperTemplatesController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const templates = await EmailTemplate.find().sort({ name: 1 }).lean()

    res.status(200).json({
      success: true,
      count: templates.length,
      templates: templates.map((t) => ({
        id: t._id.toString(),
        name: t.name,
        slug: t.slug,
        subject: t.subject,
        htmlContent: t.htmlContent,
      })),
    })
  } catch (error) {
    next(error)
  }
}

