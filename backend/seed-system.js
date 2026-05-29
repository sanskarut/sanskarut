/**
 * seed-system.js — Sansrut Mail Engine v2 System Seeder
 * ═══════════════════════════════════════════════════════
 * Usage (from the backend/ directory):
 *   node seed-system.js           → seed only if DB is empty
 *   node seed-system.js --drop    → drop all docs first, then seed fresh
 *   node seed-system.js --help    → display usage instructions
 *
 * This script seeds:
 *   - 2 User accounts (FREE plan + PRO plan)
 *   - 2 ApiKey records (one per user, SHA-256 hashed)
 *   - 3 EmailTemplate documents (Welcome, OTP, Thank You)
 */

const mongoose = require("mongoose")
const crypto   = require("crypto")
const bcrypt   = require("bcryptjs")

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sansrut_mail_db"

// ─── Inline Mongoose Schemas (avoids TypeScript compilation requirement) ──────

const UserSchema = new mongoose.Schema({
  name:            { type: String,  required: true, trim: true },
  email:           { type: String,  required: true, unique: true, lowercase: true, trim: true },
  password:        { type: String,  required: true },
  plan:            { type: String,  enum: ["FREE", "PRO"], default: "FREE" },
  apiCallLimit:    { type: Number,  default: 1000 },
  apiCallCount:    { type: Number,  default: 0 },
  apiCallResetAt:  { type: Date,    default: () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) },
  createdAt:       { type: Date,    default: Date.now },
})

const ApiKeySchema = new mongoose.Schema({
  name:       { type: String,                          required: true },
  hashedKey:  { type: String,                          required: true, unique: true },
  ownerId:    { type: mongoose.Schema.Types.ObjectId,  ref: "User", required: true },
  lastUsed:   { type: Date,                            default: null },
  createdAt:  { type: Date,                            default: Date.now },
})

const EmailTemplateSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    subject:     { type: String, required: true, trim: true },
    htmlContent: { type: String, required: true },
  },
  { timestamps: true }
)

// Use mongoose.models to avoid "Cannot overwrite model once compiled" in hot-reload contexts
const User          = mongoose.models.User          || mongoose.model("User",          UserSchema)
const ApiKey        = mongoose.models.ApiKey        || mongoose.model("ApiKey",        ApiKeySchema)
const EmailTemplate = mongoose.models.EmailTemplate || mongoose.model("EmailTemplate", EmailTemplateSchema)

// ─── Responsive Email Template HTML ──────────────────────────────────────────

const WELCOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Welcome</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">SANSRUT</h1>
    <p style="color:#3b82f6;margin:8px 0 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Mail Engine</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <h2 style="color:#0b192c;font-size:22px;font-weight:700;margin:0 0 16px;">Welcome aboard, {{name}}!</h2>
    <p style="color:#334155;font-size:15px;line-height:26px;margin:0 0 28px;">{{body}}</p>
    <a href="{{ctaUrl}}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">{{ctaText}}</a>
  </td></tr>
  <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Agency · All rights reserved.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

const OTP_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Your OTP Code</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">SANSRUT</h1>
  </td></tr>
  <tr><td style="padding:40px;text-align:center;">
    <h2 style="color:#0b192c;font-size:22px;font-weight:700;margin:0 0 12px;">Verification Code</h2>
    <p style="color:#64748b;font-size:14px;line-height:22px;margin:0 0 32px;">This one-time code expires in <strong>{{expiresIn}} minutes</strong>. Never share it.</p>
    <div style="display:inline-block;background:#f1f5f9;border-radius:14px;padding:24px 48px;letter-spacing:14px;font-size:40px;font-weight:900;color:#0b192c;">{{otp}}</div>
    <p style="color:#94a3b8;font-size:12px;margin:28px 0 0;">If you didn't request this, you can safely ignore this email.</p>
  </td></tr>
  <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Agency · All rights reserved.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

const THANK_YOU_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Thank You</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">SANSRUT</h1>
  </td></tr>
  <tr><td style="padding:48px 40px;text-align:center;">
    <div style="font-size:56px;margin-bottom:20px;">🎉</div>
    <h2 style="color:#0b192c;font-size:26px;font-weight:800;margin:0 0 16px;">Thank you, {{name}}!</h2>
    <p style="color:#334155;font-size:15px;line-height:26px;margin:0 auto;max-width:440px;">{{message}}</p>
  </td></tr>
  <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© ${new Date().getFullYear()} Sanskarut Tech Agency · All rights reserved.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

// ─── Helper: Generate API Key pair ────────────────────────────────────────────

function generateApiKeyPair() {
  const raw     = `sk_sansrut_${crypto.randomBytes(16).toString("hex")}`
  const hashed  = crypto.createHash("sha256").update(raw).digest("hex")
  return { raw, hashed }
}

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  const args     = process.argv.slice(2)
  const shouldDrop = args.includes("--drop")
  const showHelp   = args.includes("--help")

  if (showHelp) {
    console.log(`
Usage: node seed-system.js [options]

Options:
  (no flag)   Seed the database only if empty
  --drop      Drop all collections and re-seed from scratch
  --help      Show this help message

Database: ${MONGODB_URI}
    `)
    process.exit(0)
  }

  console.log("\n" + "═".repeat(60))
  console.log("   SANSRUT MAIL ENGINE v2 — SYSTEM SEEDER")
  console.log("═".repeat(60))
  console.log(`  Target  : ${MONGODB_URI}`)
  console.log(`  Mode    : ${shouldDrop ? "DROP & RE-SEED" : "SEED IF EMPTY"}`)
  console.log("═".repeat(60) + "\n")

  await mongoose.connect(MONGODB_URI)
  console.log("✅ MongoDB connected.\n")

  // ── Drop existing documents if requested ───────────────────────────────────
  if (shouldDrop) {
    const [u, k, t] = await Promise.all([
      User.deleteMany({}),
      ApiKey.deleteMany({}),
      EmailTemplate.deleteMany({}),
    ])
    console.log(
      `🗑️  Cleared → Users: ${u.deletedCount}, ` +
      `ApiKeys: ${k.deletedCount}, ` +
      `Templates: ${t.deletedCount}\n`
    )
  }

  // ── Skip if already seeded ─────────────────────────────────────────────────
  const existingCount = await User.countDocuments()
  if (existingCount > 0 && !shouldDrop) {
    console.log(
      `⚠️  Database already contains ${existingCount} user(s). Skipping seed.\n` +
      `   Run with --drop to clear and re-seed.\n`
    )
    process.exit(0)
  }

  // ── Seed Users ─────────────────────────────────────────────────────────────
  console.log("👤 Creating user accounts...")

  const ADMIN_PASSWORD = "Sansrut@Admin2026!"
  const DEV_PASSWORD   = "DevPro@Sansrut2026!"

  const now            = new Date()
  const nextMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const [adminHash, devHash] = await Promise.all([
    bcrypt.hash(ADMIN_PASSWORD, 12),
    bcrypt.hash(DEV_PASSWORD,   12),
  ])

  const [adminUser, devUser] = await Promise.all([
    User.create({
      name:           "Sanskar Sharma",
      email:          "admin@sanskarut.com",
      password:       adminHash,
      plan:           "FREE",
      apiCallLimit:   1000,
      apiCallCount:   530,   // Pre-loaded to showcase progress bar
      apiCallResetAt: nextMonthReset,
    }),
    User.create({
      name:           "Dev Account",
      email:          "dev@sanskarut.com",
      password:       devHash,
      plan:           "PRO",
      apiCallLimit:   50000,
      apiCallCount:   12300, // Pre-loaded to showcase progress bar
      apiCallResetAt: nextMonthReset,
    }),
  ])

  console.log(`  ✅ admin@sanskarut.com  (FREE  — 1,000/mo)`)
  console.log(`  ✅ dev@sanskarut.com    (PRO   — 50,000/mo)\n`)

  // ── Seed API Keys ──────────────────────────────────────────────────────────
  console.log("🔑 Generating API keys...")

  const adminKeyPair = generateApiKeyPair()
  const devKeyPair   = generateApiKeyPair()

  await Promise.all([
    ApiKey.create({
      name:      "Admin Bootstrap Token",
      hashedKey: adminKeyPair.hashed,
      ownerId:   adminUser._id,
    }),
    ApiKey.create({
      name:      "Pro Developer Token",
      hashedKey: devKeyPair.hashed,
      ownerId:   devUser._id,
    }),
  ])

  console.log("  ✅ 2 API keys generated (SHA-256 hashed in DB)\n")

  // ── Seed Email Templates ───────────────────────────────────────────────────
  console.log("📧 Inserting email templates...")

  await EmailTemplate.insertMany([
    {
      name:        "Welcome Email",
      slug:        "welcome",
      subject:     "Welcome to Sansrut — We're glad you're here, {{name}}!",
      htmlContent: WELCOME_HTML,
    },
    {
      name:        "OTP Verification",
      slug:        "otp-verification",
      subject:     "Your Sansrut Verification Code: {{otp}}",
      htmlContent: OTP_HTML,
    },
    {
      name:        "Thank You Email",
      slug:        "thank-you",
      subject:     "Thank You, {{name}} — Your action was received!",
      htmlContent: THANK_YOU_HTML,
    },
  ])

  console.log("  ✅ welcome, otp-verification, thank-you templates inserted\n")

  // ── Summary Output ─────────────────────────────────────────────────────────
  console.log("═".repeat(60))
  console.log("              SEED CREDENTIALS SUMMARY")
  console.log("═".repeat(60))
  console.log("\n  ── FREE Plan Admin ──────────────────────────────────")
  console.log(`  Login Email : admin@sanskarut.com`)
  console.log(`  Password    : ${ADMIN_PASSWORD}`)
  console.log(`  API Key     : ${adminKeyPair.raw}`)
  console.log(`  Plan Quota  : 530 / 1,000 calls used (pre-seeded)`)
  console.log("\n  ── PRO Plan Developer ───────────────────────────────")
  console.log(`  Login Email : dev@sanskarut.com`)
  console.log(`  Password    : ${DEV_PASSWORD}`)
  console.log(`  API Key     : ${devKeyPair.raw}`)
  console.log(`  Plan Quota  : 12,300 / 50,000 calls used (pre-seeded)`)
  console.log("\n  ── Sample Rate Limit Test ───────────────────────────")
  console.log(`  curl -X POST http://localhost:4000/api/v1/emails/send \\`)
  console.log(`    -H "Authorization: Bearer ${adminKeyPair.raw}" \\`)
  console.log(`    -H "Content-Type: application/json" \\`)
  console.log(`    -d '{"to":"test@example.com","subject":"Test","title":"Hi","bodyContent":"Hello!"}'`)
  console.log("")
  console.log("  ⚠️  API keys are hashed — copy them now, cannot be retrieved!")
  console.log("═".repeat(60) + "\n")

  process.exit(0)
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err.message)
  process.exit(1)
})
