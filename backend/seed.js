/**
 * seed.js — Sansrut Mail Engine Bootstrap Seeder
 * ================================================
 * Run: node seed.js
 *
 * This standalone script connects to MongoDB, wipes existing data,
 * and seeds a fresh admin TeamUser + API Key + 3 default email templates.
 *
 * Usage from the backend/ directory:
 *   node seed.js
 *   node seed.js --drop    (drops all collections first)
 */

const mongoose = require("mongoose")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sansrut_mail_db"

const ADMIN_EMAIL = "admin@sanskarut.com"
const ADMIN_PASSWORD = "Sansrut@Admin2026!"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const TeamUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "member"], default: "member" },
  createdAt: { type: Date, default: Date.now },
})

const ApiKeySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "TeamUser", required: true },
  name: { type: String, required: true },
  keyHash: { type: String, required: true, unique: true },
  maskedKey: { type: String, required: true },
  lastUsed: { type: Date, default: null },
  isRevoked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const EmailTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    htmlContent: { type: String, required: true },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamUser",
      required: true,
    },
  },
  { timestamps: true }
)

const TeamUser = mongoose.model("TeamUser", TeamUserSchema)
const ApiKey = mongoose.model("ApiKey", ApiKeySchema)
const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema)

// ─── Template HTML Definitions ────────────────────────────────────────────────

const welcomeHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Welcome</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
    <table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;">SANSRUT</h1>
        <p style="color:#3b82f6;margin:6px 0 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">Internal Mail Engine</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <h2 style="color:#0b192c;font-size:22px;margin:0 0 16px;">Welcome aboard, {{name}}!</h2>
        <p style="color:#334155;font-size:15px;line-height:26px;margin:0 0 28px;">{{body}}</p>
        <a href="{{ctaUrl}}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">{{ctaText}}</a>
      </td></tr>
      <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="color:#64748b;font-size:12px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Team. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`

const otpHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Your OTP Code</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
    <table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;">SANSRUT</h1>
      </td></tr>
      <tr><td style="padding:40px;text-align:center;">
        <h2 style="color:#0b192c;font-size:22px;margin:0 0 10px;">Verification Code</h2>
        <p style="color:#64748b;font-size:14px;line-height:22px;margin:0 0 32px;">This OTP expires in <strong>{{expiresIn}} minutes</strong>. Do not share it with anyone.</p>
        <div style="display:inline-block;background:#f1f5f9;border-radius:14px;padding:28px 48px;letter-spacing:14px;font-size:40px;font-weight:900;color:#0b192c;">{{otp}}</div>
        <p style="color:#94a3b8;font-size:12px;margin:28px 0 0;">If you did not request this code, you can safely ignore this email.</p>
      </td></tr>
      <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="color:#64748b;font-size:12px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Team. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`

const thankYouHtml = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Thank You</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
    <table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;">SANSRUT</h1>
      </td></tr>
      <tr><td style="padding:48px;text-align:center;">
        <div style="font-size:56px;margin-bottom:20px;">🎉</div>
        <h2 style="color:#0b192c;font-size:26px;margin:0 0 16px;font-weight:800;">Thank you, {{name}}!</h2>
        <p style="color:#334155;font-size:15px;line-height:26px;margin:0 auto;max-width:440px;">{{message}}</p>
      </td></tr>
      <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="color:#64748b;font-size:12px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Team. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`

// ─── Seed Function ────────────────────────────────────────────────────────────

async function seed() {
  const shouldDrop = process.argv.includes("--drop")

  console.log("\n===============================================")
  console.log("   SANSRUT MAIL ENGINE — DATABASE SEEDER   ")
  console.log("===============================================")
  console.log(`Connecting to: ${MONGODB_URI}\n`)

  await mongoose.connect(MONGODB_URI)
  console.log("✅ MongoDB connected successfully.\n")

  if (shouldDrop) {
    await TeamUser.deleteMany({})
    await ApiKey.deleteMany({})
    await EmailTemplate.deleteMany({})
    console.log("🗑️  All collections cleared (--drop flag used).\n")
  }

  // Check if already seeded
  const existingAdmin = await TeamUser.findOne({ email: ADMIN_EMAIL })
  if (existingAdmin && !shouldDrop) {
    console.log(`⚠️  Admin user "${ADMIN_EMAIL}" already exists. Skipping seed.`)
    console.log("   Use 'node seed.js --drop' to re-seed from scratch.\n")
    process.exit(0)
  }

  // 1. Hash admin password
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

  // 2. Create admin user
  const admin = await TeamUser.create({
    name: "Sanskar Sharma",
    email: ADMIN_EMAIL,
    passwordHash,
    role: "admin",
  })
  console.log(`✅ Admin user created: ${admin.email}`)

  // 3. Generate API Key
  const randomPart = crypto.randomBytes(16).toString("hex")
  const plaintextKey = `sk_sansrut_${randomPart}`
  const keyHash = crypto.createHash("sha256").update(plaintextKey).digest("hex")
  const maskedKey = `sk_sansrut_••••••••${plaintextKey.slice(-4)}`

  await ApiKey.create({
    userId: admin._id,
    name: "Admin Bootstrap Token",
    keyHash,
    maskedKey,
  })
  console.log(`✅ API Key generated (hash stored): ${maskedKey}`)

  // 4. Seed Email Templates
  const templates = [
    {
      name: "Welcome Email",
      slug: "welcome",
      subject: "Welcome to Sansrut — We're glad you're here!",
      htmlContent: welcomeHtml,
      lastUpdatedBy: admin._id,
    },
    {
      name: "OTP Verification",
      slug: "otp-verification",
      subject: "Your Sansrut Verification Code: {{otp}}",
      htmlContent: otpHtml,
      lastUpdatedBy: admin._id,
    },
    {
      name: "Thank You Email",
      slug: "thank-you",
      subject: "Thank You, {{name}} — Your action was received!",
      htmlContent: thankYouHtml,
      lastUpdatedBy: admin._id,
    },
  ]

  await EmailTemplate.insertMany(templates)
  console.log(`✅ ${templates.length} email templates created in MongoDB.`)

  // 5. Print summary
  console.log("\n===============================================")
  console.log("              SEED CREDENTIALS")
  console.log("===============================================")
  console.log(`  Admin Email    : ${ADMIN_EMAIL}`)
  console.log(`  Admin Password : ${ADMIN_PASSWORD}`)
  console.log(`  API Key (raw)  : ${plaintextKey}`)
  console.log("")
  console.log("  ⚠️  SAVE THE API KEY ABOVE — it is stored as")
  console.log("     a SHA-256 hash and cannot be retrieved again!")
  console.log("===============================================\n")

  process.exit(0)
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
