import mongoose, { Schema, Document } from "mongoose"

// ─────────────────────────────────────────────────────────────────────────────
// 1.  User Model  (tiered plan with rate-limit tracking)
// ─────────────────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  plan: "FREE" | "PRO";
  apiCallLimit: number;
  apiCallCount: number;
  apiCallResetAt: Date;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Full name is required."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email address is required."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  plan: {
    type: String,
    enum: ["FREE", "PRO"],
    default: "FREE",
  },
  // Maximum API calls allowed per cycle (month)
  apiCallLimit: {
    type: Number,
    default: 1000,
  },
  // Running counter of API calls made in the current cycle
  apiCallCount: {
    type: Number,
    default: 0,
  },
  // Timestamp when the counter resets (beginning of next month)
  apiCallResetAt: {
    type: Date,
    default: () => {
      const now = new Date()
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      return nextMonth
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Fast email lookup for auth check-email endpoint
UserSchema.index({ email: 1 })

export const User = mongoose.model<IUser>("User", UserSchema)

// ─────────────────────────────────────────────────────────────────────────────
// 2.  ApiKey Model
// ─────────────────────────────────────────────────────────────────────────────

export interface IApiKey extends Document {
  name: string;
  hashedKey: string;
  maskedKey: string;
  ownerId: mongoose.Types.ObjectId;
  lastUsed: Date | null;
  createdAt: Date;
}

const ApiKeySchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "API key label name is required."],
    trim: true,
  },
  hashedKey: {
    type: String,
    required: true,
    unique: true,
  },
  maskedKey: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastUsed: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Sub-millisecond SHA-256 hash lookup index
ApiKeySchema.index({ hashedKey: 1 })

export const ApiKey = mongoose.model<IApiKey>("ApiKey", ApiKeySchema)

// ─────────────────────────────────────────────────────────────────────────────
// 3.  EmailTemplate Model
// ─────────────────────────────────────────────────────────────────────────────

export interface IEmailTemplate extends Document {
  name: string;
  slug: string;
  subject: string;
  htmlContent: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailTemplateSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Template name is required."],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug identifier is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Default subject line is required."],
      trim: true,
    },
    htmlContent: {
      type: String,
      required: [true, "HTML template content is required."],
    },
  },
  { timestamps: true }
)

// Fast slug-based template retrieval
EmailTemplateSchema.index({ slug: 1 })

export const EmailTemplate = mongoose.model<IEmailTemplate>(
  "EmailTemplate",
  EmailTemplateSchema
)

// ─────────────────────────────────────────────────────────────────────────────
// 4.  EmailLog Model
// ─────────────────────────────────────────────────────────────────────────────

export interface IEmailLog extends Document {
  senderId: mongoose.Types.ObjectId;
  recipientEmail: string;
  subject: string;
  templateSlug?: string;
  status: "Delivered" | "Failed";
  errorMessage?: string;
  timestamp: Date;
}

const EmailLogSchema: Schema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  templateSlug: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["Delivered", "Failed"],
    required: true,
  },
  errorMessage: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

// Compound index for efficient log queries by sender + timestamp
EmailLogSchema.index({ senderId: 1, timestamp: -1 })

export const EmailLog = mongoose.model<IEmailLog>("EmailLog", EmailLogSchema)
