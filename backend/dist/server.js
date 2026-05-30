import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-routes.js";
import emailRoutes from "./routes/email-routes.js";
import templateRoutes from "./routes/template-routes.js";
import apiKeyRoutes from "./routes/api-key-routes.js";
import { User, ApiKey, EmailTemplate } from "./models.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sansrut_mail_db";
// ─── CORS & Body Parser ───────────────────────────────────────────────────────
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:3000",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/emails", emailRoutes);
app.use("/api/v1/templates", templateRoutes);
app.use("/api/v1/api-keys", apiKeyRoutes);
// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        service: "Sansrut Mail Engine API",
        version: "2.0.0",
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});
// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("[Global Error Handler]", {
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
        url: req.url,
        method: req.method,
    });
    res.status(err.status || 500).json({
        success: false,
        error: err.name || "Internal Server Error",
        message: err.message ||
            "An unexpected error occurred inside the mail engine service.",
    });
});
// ─── Email Template HTML Definitions ─────────────────────────────────────────
const WELCOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Welcome</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
  <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">SANSRUT</h1>
  <p style="color:#3b82f6;margin:8px 0 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Mail Engine</p>
</td></tr>
<tr><td style="padding:40px;">
  <h2 style="color:#0b192c;font-size:22px;font-weight:700;margin:0 0 16px;">Welcome aboard, {{name}}!</h2>
  <p style="color:#334155;font-size:15px;line-height:26px;margin:0 0 28px;">{{body}}</p>
  <a href="{{ctaUrl}}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">{{ctaText}}</a>
</td></tr>
<tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
  <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Team · All rights reserved.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
const OTP_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Your OTP Code</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
  <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;">SANSRUT</h1>
</td></tr>
<tr><td style="padding:40px;text-align:center;">
  <h2 style="color:#0b192c;font-size:22px;font-weight:700;margin:0 0 12px;">Verification Code</h2>
  <p style="color:#64748b;font-size:14px;line-height:22px;margin:0 0 32px;">This one-time code expires in <strong>{{expiresIn}} minutes</strong>. Do not share it.</p>
  <div style="display:inline-block;background:#f1f5f9;border-radius:14px;padding:24px 48px;letter-spacing:14px;font-size:40px;font-weight:900;color:#0b192c;">{{otp}}</div>
  <p style="color:#94a3b8;font-size:12px;margin:28px 0 0;">If you did not request this, safely ignore this email.</p>
</td></tr>
<tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
  <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Team · All rights reserved.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
const THANK_YOU_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Thank You</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
<tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
  <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;">SANSRUT</h1>
</td></tr>
<tr><td style="padding:48px 40px;text-align:center;">
  <div style="font-size:56px;margin-bottom:20px;">🎉</div>
  <h2 style="color:#0b192c;font-size:26px;font-weight:800;margin:0 0 16px;">Thank you, {{name}}!</h2>
  <p style="color:#334155;font-size:15px;line-height:26px;margin:0 auto;max-width:440px;">{{message}}</p>
</td></tr>
<tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
  <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Team · All rights reserved.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
// ─── Auto-Seeder ──────────────────────────────────────────────────────────────
// Runs on first boot when DB is empty. Creates:
//   - 1 FREE plan admin user
//   - 1 PRO plan developer user
//   - 2 API keys (one per user)
//   - 3 default email templates
// ─────────────────────────────────────────────────────────────────────────────
async function autoSeedDatabase() {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log(`✅ Database already seeded — ${userCount} user(s) found.`);
            return;
        }
        console.log("\n🌱 Empty database detected. Running auto-seed...");
        // ── Admin user (FREE plan) ────────────────────────────────────────────────
        const ADMIN_PASSWORD = "Sansrut@Admin2026!";
        const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        const now = new Date();
        const nextMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const adminUser = await User.create({
            name: "Sanskar Sharma",
            email: "admin@sanskarut.com",
            password: adminHash,
            plan: "FREE",
            apiCallLimit: 1000,
            apiCallCount: 42, // Pre-populated to show analytics
            apiCallResetAt: nextMonthReset,
        });
        // ── Developer user (PRO plan) ─────────────────────────────────────────────
        const DEV_PASSWORD = "DevPro@Sansrut2026!";
        const devHash = await bcrypt.hash(DEV_PASSWORD, 12);
        const devUser = await User.create({
            name: "Dev Account",
            email: "dev@sanskarut.com",
            password: devHash,
            plan: "PRO",
            apiCallLimit: 50000,
            apiCallCount: 3821, // Pre-populated to show analytics
            apiCallResetAt: nextMonthReset,
        });
        // ── API Keys ──────────────────────────────────────────────────────────────
        const adminRaw = `sk_sansrut_${crypto.randomBytes(16).toString("hex")}`;
        const adminKeyHash = crypto
            .createHash("sha256")
            .update(adminRaw)
            .digest("hex");
        await ApiKey.create({
            name: "Admin Bootstrap Token",
            hashedKey: adminKeyHash,
            maskedKey: `sk_sansrut_••••${adminRaw.slice(-4)}`,
            ownerId: adminUser._id,
        });
        const devRaw = `sk_sansrut_${crypto.randomBytes(16).toString("hex")}`;
        const devKeyHash = crypto
            .createHash("sha256")
            .update(devRaw)
            .digest("hex");
        await ApiKey.create({
            name: "Pro Developer Token",
            hashedKey: devKeyHash,
            maskedKey: `sk_sansrut_••••${devRaw.slice(-4)}`,
            ownerId: devUser._id,
        });
        // ── Email Templates ───────────────────────────────────────────────────────
        await EmailTemplate.insertMany([
            {
                name: "Welcome Email",
                slug: "welcome",
                subject: "Welcome to Sansrut — We're glad you're here, {{name}}!",
                htmlContent: WELCOME_HTML,
            },
            {
                name: "OTP Verification",
                slug: "otp-verification",
                subject: "Your Sansrut Verification Code: {{otp}}",
                htmlContent: OTP_HTML,
            },
            {
                name: "Thank You Email",
                slug: "thank-you",
                subject: "Thank You, {{name}} — Your action was received!",
                htmlContent: THANK_YOU_HTML,
            },
        ]);
        // ── Print credentials ─────────────────────────────────────────────────────
        console.log("\n" + "=".repeat(60));
        console.log("       🚀 SANSRUT MAIL ENGINE v2 — SEED COMPLETE 🚀");
        console.log("=".repeat(60));
        console.log("\n  ── FREE Plan Admin ──────────────────────────────────");
        console.log(`  Email    : ${adminUser.email}`);
        console.log(`  Password : ${ADMIN_PASSWORD}`);
        console.log(`  API Key  : ${adminRaw}`);
        console.log(`  Plan     : FREE  |  Limit: 1,000 calls/month`);
        console.log("\n  ── PRO Plan Developer ───────────────────────────────");
        console.log(`  Email    : ${devUser.email}`);
        console.log(`  Password : ${DEV_PASSWORD}`);
        console.log(`  API Key  : ${devRaw}`);
        console.log(`  Plan     : PRO   |  Limit: 50,000 calls/month`);
        console.log("\n  ── Templates Seeded ─────────────────────────────────");
        console.log("  ✅ welcome, otp-verification, thank-you");
        console.log("\n  ⚠️  API keys are stored as SHA-256 hashes.");
        console.log("     Copy them now — they cannot be retrieved again!");
        console.log("=".repeat(60) + "\n");
    }
    catch (error) {
        console.error("❌ Database seed sequence failed:", error);
    }
}
// ─── Bootstrap ────────────────────────────────────────────────────────────────
mongoose
    .connect(MONGODB_URI)
    .then(async () => {
    console.log(`✅ MongoDB connected → ${MONGODB_URI.replace(/mongodb:\/\/[^@]+@/, "mongodb://<auth>@")}`);
    await autoSeedDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Sansrut Mail Engine v2 listening on http://localhost:${PORT}`);
        console.log(`   Health check: http://localhost:${PORT}/health`);
    });
})
    .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
});
