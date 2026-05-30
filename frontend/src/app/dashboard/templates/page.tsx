"use client"

import React, { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileCode2,
  Plus,
  Trash2,
  Edit2,
  LayoutTemplate,
  Search,
  Clock,
  Zap,
  RefreshCw,
  Eye,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  X,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmailTemplate {
  _id: string
  name: string
  slug: string
  subject: string
  htmlContent: string
  updatedAt: string
  createdAt: string
}

interface UserUsage {
  plan: "FREE" | "PRO"
  apiCallCount: number
  apiCallLimit: number
  apiCallResetAt: string
  name: string
  email: string
}

// ─── Full HTML Templates ──────────────────────────────────────────────────────

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
    <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Sanskarut Tech Agency · All rights reserved.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

const OTP_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>OTP Verification</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">SANSRUT</h1>
  </td></tr>
  <tr><td style="padding:40px;text-align:center;">
    <h2 style="color:#0b192c;font-size:22px;font-weight:700;margin:0 0 12px;">Verification Code</h2>
    <p style="color:#64748b;font-size:14px;line-height:22px;margin:0 0 32px;">Expires in <strong>{{expiresIn}} minutes</strong>. Do not share this code.</p>
    <div style="display:inline-block;background:#f1f5f9;border-radius:14px;padding:24px 48px;letter-spacing:14px;font-size:40px;font-weight:900;color:#0b192c;">{{otp}}</div>
    <p style="color:#94a3b8;font-size:12px;margin:28px 0 0;">If you did not request this, safely ignore this email.</p>
  </td></tr>
  <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Sanskarut Tech Agency · All rights reserved.</p>
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
    <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Sanskarut Tech Agency · All rights reserved.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

const PASSWORD_RESET_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Reset Your Password</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td bgcolor="#0b192c" style="padding:40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">SANSRUT</h1>
    <p style="color:#f87171;margin:8px 0 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Security Alert</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <div style="width:56px;height:56px;background:#fef2f2;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 0 24px;">
      <span style="font-size:28px;">🔐</span>
    </div>
    <h2 style="color:#0b192c;font-size:22px;font-weight:700;margin:0 0 12px;">Reset your password</h2>
    <p style="color:#334155;font-size:15px;line-height:26px;margin:0 0 8px;">Hi <strong>{{name}}</strong>, we received a request to reset the password for your account associated with <strong>{{email}}</strong>.</p>
    <p style="color:#64748b;font-size:13px;margin:0 0 28px;">This link expires in <strong>{{expiresIn}}</strong>. If you did not make this request, you can safely ignore this email.</p>
    <a href="{{resetUrl}}" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">Reset Password</a>
  </td></tr>
  <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Sanskarut Tech Agency · All rights reserved.</p>
    <p style="color:#cbd5e1;font-size:10px;margin:6px 0 0;">If you have trouble clicking the button, copy this URL: {{resetUrl}}</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

const NEWSLETTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>{{subject}}</title></head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
  <tr><td style="background:linear-gradient(135deg,#0b192c 0%,#1e3a5f 100%);padding:48px 40px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:28px;font-weight:800;">SANSRUT</h1>
    <p style="color:#93c5fd;margin:8px 0 0;font-size:13px;">{{edition}} · {{date}}</p>
  </td></tr>
  <tr><td style="padding:40px 40px 24px;">
    <h2 style="color:#0b192c;font-size:24px;font-weight:800;margin:0 0 8px;">{{headline}}</h2>
    <p style="color:#64748b;font-size:13px;margin:0 0 24px;border-bottom:1px solid #f1f5f9;padding-bottom:24px;">{{subheadline}}</p>
    <h3 style="color:#0b192c;font-size:16px;font-weight:700;margin:0 0 12px;">{{article1Title}}</h3>
    <p style="color:#334155;font-size:14px;line-height:24px;margin:0 0 20px;">{{article1Body}}</p>
    <div style="background:#f8fafc;border-left:4px solid #2563eb;padding:16px 20px;border-radius:4px;margin:0 0 24px;">
      <p style="color:#1e40af;font-size:14px;font-weight:600;margin:0;">💡 {{tipContent}}</p>
    </div>
    <a href="{{ctaUrl}}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;font-size:14px;">{{ctaText}}</a>
  </td></tr>
  <tr><td bgcolor="#0b192c" style="padding:24px 40px;text-align:center;">
    <p style="color:#64748b;font-size:11px;margin:0;">© 2025 Sanskarut Tech Agency · <a href="{{unsubscribeUrl}}" style="color:#64748b;">Unsubscribe</a></p>
  </td></tr>
</table></td></tr></table>
</body></html>`

const ORDER_CONFIRM_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Order Confirmed!</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td bgcolor="#059669" style="padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:12px;">✅</div>
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Order Confirmed!</h1>
    <p style="color:#a7f3d0;margin:8px 0 0;font-size:13px;">Order #{{orderId}}</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#334155;font-size:15px;margin:0 0 24px;">Hi <strong>{{name}}</strong>, thank you for your purchase! Your order has been confirmed and is being processed.</p>
    <div style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:24px;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr><td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;">
          <span style="color:#64748b;font-size:13px;font-weight:600;">Item</span>
          <span style="color:#0b192c;font-size:13px;font-weight:700;">{{itemName}}</span>
        </td></tr>
        <tr><td style="padding:16px 20px;border-bottom:1px solid #f1f5f9;">
          <table width="100%"><tr>
            <td style="color:#64748b;font-size:13px;font-weight:600;">Quantity</td>
            <td align="right" style="color:#0b192c;font-size:13px;font-weight:700;">{{quantity}}</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:16px 20px;background:#f0fdf4;">
          <table width="100%"><tr>
            <td style="color:#059669;font-size:14px;font-weight:700;">Total</td>
            <td align="right" style="color:#059669;font-size:18px;font-weight:800;">{{total}}</td>
          </tr></table>
        </td></tr>
      </table>
    </div>
    <p style="color:#64748b;font-size:13px;margin:0 0 24px;">Estimated delivery: <strong>{{deliveryDate}}</strong></p>
    <a href="{{trackingUrl}}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">Track Your Order</a>
  </td></tr>
  <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Sanskarut Tech Agency · All rights reserved.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

const INVOICE_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Invoice #{{invoiceId}}</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td style="padding:40px;">
    <table width="100%"><tr>
      <td><h1 style="color:#0b192c;margin:0;font-size:24px;font-weight:900;">INVOICE</h1><p style="color:#64748b;margin:4px 0 0;font-size:13px;">#{{invoiceId}}</p></td>
      <td align="right"><p style="color:#0b192c;font-weight:800;font-size:20px;margin:0;">SANSRUT</p><p style="color:#3b82f6;margin:2px 0 0;font-size:11px;font-weight:700;text-transform:uppercase;">Tech Agency</p></td>
    </tr></table>
    <div style="height:1px;background:#f1f5f9;margin:24px 0;"></div>
    <table width="100%"><tr>
      <td><p style="color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;margin:0 0 4px;">Billed To</p><p style="color:#0b192c;font-weight:700;margin:0;">{{clientName}}</p><p style="color:#64748b;font-size:13px;margin:4px 0 0;">{{clientEmail}}</p></td>
      <td align="right"><p style="color:#64748b;font-size:12px;font-weight:700;text-transform:uppercase;margin:0 0 4px;">Invoice Date</p><p style="color:#0b192c;font-weight:700;margin:0;">{{invoiceDate}}</p><p style="color:#64748b;font-size:13px;margin:4px 0 0;">Due: {{dueDate}}</p></td>
    </tr></table>
    <div style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;margin:24px 0;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr style="background:#0b192c;"><td style="padding:12px 20px;color:#fff;font-size:12px;font-weight:700;">DESCRIPTION</td><td style="padding:12px 20px;color:#fff;font-size:12px;font-weight:700;text-align:right;">AMOUNT</td></tr>
        <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:16px 20px;color:#334155;font-size:14px;">{{serviceDescription}}</td><td style="padding:16px 20px;color:#0b192c;font-size:14px;font-weight:700;text-align:right;">{{serviceAmount}}</td></tr>
        <tr style="background:#f0fdf4;"><td style="padding:16px 20px;color:#059669;font-size:15px;font-weight:800;">Total Due</td><td style="padding:16px 20px;color:#059669;font-size:18px;font-weight:900;text-align:right;">{{totalAmount}}</td></tr>
      </table>
    </div>
    <a href="{{paymentUrl}}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;">Pay Now</a>
  </td></tr>
  <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Sanskarut Tech Agency · All rights reserved.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

const APPOINTMENT_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>Appointment Confirmation</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:40px 10px;">
<table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
  <tr><td bgcolor="#7c3aed" style="padding:40px;text-align:center;">
    <div style="font-size:48px;margin-bottom:12px;">📅</div>
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Appointment Confirmed</h1>
    <p style="color:#ddd6fe;margin:8px 0 0;font-size:13px;">We look forward to seeing you!</p>
  </td></tr>
  <tr><td style="padding:40px;">
    <p style="color:#334155;font-size:15px;margin:0 0 24px;">Hi <strong>{{name}}</strong>, your appointment has been confirmed. Here are the details:</p>
    <div style="background:#faf5ff;border:2px solid #e9d5ff;border-radius:14px;padding:28px;margin-bottom:24px;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr><td style="padding:8px 0;border-bottom:1px solid #f3e8ff;">
          <table width="100%"><tr>
            <td style="color:#7c3aed;font-size:12px;font-weight:700;text-transform:uppercase;">Date</td>
            <td align="right" style="color:#0b192c;font-size:14px;font-weight:700;">{{appointmentDate}}</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #f3e8ff;">
          <table width="100%"><tr>
            <td style="color:#7c3aed;font-size:12px;font-weight:700;text-transform:uppercase;">Time</td>
            <td align="right" style="color:#0b192c;font-size:14px;font-weight:700;">{{appointmentTime}}</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:8px 0;border-bottom:1px solid #f3e8ff;">
          <table width="100%"><tr>
            <td style="color:#7c3aed;font-size:12px;font-weight:700;text-transform:uppercase;">Location</td>
            <td align="right" style="color:#0b192c;font-size:14px;font-weight:700;">{{location}}</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:8px 0;">
          <table width="100%"><tr>
            <td style="color:#7c3aed;font-size:12px;font-weight:700;text-transform:uppercase;">With</td>
            <td align="right" style="color:#0b192c;font-size:14px;font-weight:700;">{{hostName}}</td>
          </tr></table>
        </td></tr>
      </table>
    </div>
    <div style="display:flex;gap:12px;">
      <a href="{{rescheduleUrl}}" style="display:inline-block;background:#f1f5f9;color:#334155;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700;font-size:13px;border:1px solid #e2e8f0;">Reschedule</a>
      <a href="{{calendarUrl}}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700;font-size:13px;">Add to Calendar</a>
    </div>
  </td></tr>
  <tr><td bgcolor="#f8fafc" style="padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
    <p style="color:#94a3b8;font-size:11px;margin:0;">© 2025 Sanskarut Tech Agency · All rights reserved.</p>
  </td></tr>
</table></td></tr></table>
</body></html>`

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_TEMPLATES: EmailTemplate[] = [
  {
    _id: "tpl-1",
    name: "Welcome Email",
    slug: "welcome",
    subject: "Welcome to Sansrut — We're glad you're here, {{name}}!",
    htmlContent: WELCOME_HTML,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "tpl-2",
    name: "OTP Verification",
    slug: "otp-verification",
    subject: "Your Sansrut Verification Code: {{otp}}",
    htmlContent: OTP_HTML,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "tpl-3",
    name: "Thank You Email",
    slug: "thank-you",
    subject: "Thank You, {{name}} — Your action was received!",
    htmlContent: THANK_YOU_HTML,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "tpl-4",
    name: "Password Reset",
    slug: "password-reset",
    subject: "Reset your Sansrut password",
    htmlContent: PASSWORD_RESET_HTML,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "tpl-5",
    name: "Newsletter",
    slug: "newsletter",
    subject: "{{headline}} — {{edition}}",
    htmlContent: NEWSLETTER_HTML,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "tpl-6",
    name: "Order Confirmation",
    slug: "order-confirmation",
    subject: "Order #{{orderId}} Confirmed! 🎉",
    htmlContent: ORDER_CONFIRM_HTML,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "tpl-7",
    name: "Invoice",
    slug: "invoice",
    subject: "Invoice #{{invoiceId}} from Sanskarut",
    htmlContent: INVOICE_HTML,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    _id: "tpl-8",
    name: "Appointment Confirmation",
    slug: "appointment-confirmation",
    subject: "Your appointment on {{appointmentDate}} is confirmed",
    htmlContent: APPOINTMENT_HTML,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
]

const DEFAULT_USAGE: UserUsage = {
  plan: "FREE",
  apiCallCount: 530,
  apiCallLimit: 1000,
  apiCallResetAt: new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  ).toISOString(),
  name: "Sanskar Sharma",
  email: "admin@sanskarut.qzz.io",
}

const TAG_COLORS = [
  "bg-blue-50 text-blue-600 border-blue-200/50",
  "bg-violet-50 text-violet-600 border-violet-200/50",
  "bg-emerald-50 text-emerald-600 border-emerald-200/50",
  "bg-amber-50 text-amber-600 border-amber-200/50",
  "bg-rose-50 text-rose-600 border-rose-200/50",
  "bg-cyan-50 text-cyan-600 border-cyan-200/50",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function extractVariables(html: string): string[] {
  const matches = html.match(/\{\{(\w+)\}\}/g) || []
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "")))]
}

function formatNumber(n: number) {
  return n.toLocaleString("en-US")
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

function TemplatePreviewModal({
  template,
  onClose,
}: {
  template: EmailTemplate | null
  onClose: () => void
}) {
  if (!template) return null

  return (
    <Dialog open={!!template} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div>
            <DialogTitle className="text-base font-bold text-[#0b192c] dark:text-white">
              {template.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium mt-0.5">
              slug:{" "}
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {template.slug}
              </span>{" "}
              · Subject: {template.subject}
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/templates/${template._id}`}>
              <Button
                size="sm"
                className="bg-[#0b192c] hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer h-8 px-4"
              >
                <Edit2 className="w-3 h-3 mr-1.5" />
                Edit Template
              </Button>
            </Link>
          </div>
        </div>

        {/* Variables banner */}
        {extractVariables(template.htmlContent).length > 0 && (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-amber-50/60 dark:bg-amber-950/10 border-b border-amber-100 dark:border-amber-900/20 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Variables:
            </span>
            {extractVariables(template.htmlContent).map((v) => (
              <span
                key={v}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200/60 font-mono"
              >
                {"{{"}{v}{"}}"}
              </span>
            ))}
          </div>
        )}

        {/* iFrame preview */}
        <div className="h-[520px] bg-[#f0f4f8]">
          <iframe
            srcDoc={template.htmlContent}
            title={`Preview: ${template.name}`}
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Usage Analytics Panel ────────────────────────────────────────────────────

function UsageAnalyticsPanel({ usage }: { usage: UserUsage }) {
  const usedPct = Math.min((usage.apiCallCount / usage.apiCallLimit) * 100, 100)
  const remaining = Math.max(usage.apiCallLimit - usage.apiCallCount, 0)
  const resetDate = formatDate(usage.apiCallResetAt)

  const progressColor =
    usedPct >= 90
      ? "bg-red-500"
      : usedPct >= 70
      ? "bg-amber-500"
      : "bg-blue-600"

  const statusLabel =
    usedPct >= 90 ? "Critical" : usedPct >= 70 ? "High" : usedPct >= 40 ? "Moderate" : "Healthy"

  const statusColor =
    usedPct >= 90
      ? "text-red-600 bg-red-50 border-red-200/60"
      : usedPct >= 70
      ? "text-amber-700 bg-amber-50 border-amber-200/60"
      : "text-green-700 bg-green-50 border-green-200/60"

  return (
    <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl overflow-hidden">
      <div
        className={`h-1 w-full ${
          usedPct >= 90
            ? "bg-gradient-to-r from-red-500 to-rose-600"
            : usedPct >= 70
            ? "bg-gradient-to-r from-amber-500 to-orange-500"
            : "bg-gradient-to-r from-blue-600 to-indigo-600"
        }`}
      />
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#0b192c] dark:text-white text-sm">
                API Usage — {usage.plan} Plan
              </h3>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                Resets on {resetDate}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusColor}`}>
              {statusLabel}
            </span>
            {usage.plan === "FREE" && (
              <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-colors cursor-pointer">
                <Sparkles className="w-2.5 h-2.5" />
                Upgrade
                <ArrowUpRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-black text-[#0b192c] dark:text-white">
                {formatNumber(usage.apiCallCount)}
              </span>
              <span className="text-sm font-bold text-slate-400 ml-1.5">
                / {formatNumber(usage.apiCallLimit)} calls
              </span>
            </div>
            <span className="text-[13px] font-bold text-slate-500">
              {usedPct.toFixed(1)}% used
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
              style={{ width: `${Math.min(usedPct, 100)}%` }}
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            {formatNumber(remaining)} calls remaining this month
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
          {[
            { label: "Plan Limit", value: formatNumber(usage.apiCallLimit), icon: ShieldCheck, color: "text-blue-600" },
            { label: "Calls Made", value: formatNumber(usage.apiCallCount), icon: TrendingUp, color: "text-indigo-600" },
            { label: "Remaining", value: formatNumber(remaining), icon: Zap, color: remaining < 100 ? "text-red-600" : remaining < 300 ? "text-amber-600" : "text-emerald-600" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
                <div className="text-base font-black text-[#0b192c] dark:text-white">
                  {stat.value}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(SEED_TEMPLATES)
  const [usage, setUsage] = useState<UserUsage>(DEFAULT_USAGE)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [newTemplateName, setNewTemplateName] = useState("")
  const [newTemplateSlug, setNewTemplateSlug] = useState("")
  const [newTemplateSubject, setNewTemplateSubject] = useState("")

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4000"

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("sansrut_token") : null
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }, [])

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/templates`, { headers: getAuthHeaders() })
      const data = await res.json()
      if (data.success && Array.isArray(data.templates) && data.templates.length > 0) {
        // Merge backend templates with local seed HTML (backend may have minimal HTML)
        setTemplates(data.templates)
      }
    } catch {
      // Silent — use seed templates
    } finally {
      setIsLoading(false)
    }
  }, [API_URL, getAuthHeaders])

  const fetchUsage = useCallback(async () => {
    try {
      const cached = typeof window !== "undefined" ? localStorage.getItem("sansrut_user") : null
      if (cached) {
        const u = JSON.parse(cached)
        if (u.plan) {
          setUsage({
            plan: u.plan,
            apiCallCount: u.apiCallCount ?? 530,
            apiCallLimit: u.apiCallLimit ?? 1000,
            apiCallResetAt: u.apiCallResetAt || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
            name: u.name || "User",
            email: u.email || "",
          })
        }
      }
      const res = await fetch(`${API_URL}/api/v1/auth/me`, { headers: getAuthHeaders() })
      const data = await res.json()
      if (data.success && data.user) {
        const u = data.user
        setUsage({ plan: u.plan, apiCallCount: u.apiCallCount, apiCallLimit: u.apiCallLimit, apiCallResetAt: u.apiCallResetAt, name: u.name, email: u.email })
        if (typeof window !== "undefined") localStorage.setItem("sansrut_user", JSON.stringify(data.user))
      }
    } catch { /* silent */ }
  }, [API_URL, getAuthHeaders])

  useEffect(() => {
    fetchTemplates()
    fetchUsage()
  }, [fetchTemplates, fetchUsage])

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTemplateName || !newTemplateSlug || !newTemplateSubject) return
    const defaultHtml = `<!DOCTYPE html>\n<html><head><meta charset="utf-8"></head>\n<body style="font-family:sans-serif;padding:40px;">\n  <h1>Hello, {{name}}!</h1>\n  <p>Edit this template in the canvas editor.</p>\n</body></html>`
    try {
      const res = await fetch(`${API_URL}/api/v1/templates`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newTemplateName, slug: newTemplateSlug, subject: newTemplateSubject, htmlContent: defaultHtml }),
      })
      const data = await res.json()
      if (data.success) {
        setTemplates((prev) => [data.template, ...prev])
      } else {
        setTemplates((prev) => [{ _id: `tpl-${Date.now()}`, name: newTemplateName, slug: newTemplateSlug, subject: newTemplateSubject, htmlContent: defaultHtml, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() }, ...prev])
      }
    } catch {
      setTemplates((prev) => [{ _id: `tpl-${Date.now()}`, name: newTemplateName, slug: newTemplateSlug, subject: newTemplateSubject, htmlContent: defaultHtml, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() }, ...prev])
    } finally {
      setNewTemplateName(""); setNewTemplateSlug(""); setNewTemplateSubject(""); setIsCreateOpen(false)
    }
  }

  const handleDeleteTemplate = async () => {
    if (!deleteTarget) return
    try {
      await fetch(`${API_URL}/api/v1/templates/${deleteTarget._id}`, { method: "DELETE", headers: getAuthHeaders() })
    } catch { /* silent */ } finally {
      setTemplates((prev) => prev.filter((t) => t._id !== deleteTarget._id))
      setDeleteTarget(null)
    }
  }

  const filteredTemplates = templates.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none">
      {/* Template Preview Modal */}
      <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black tracking-tight text-[#0b192c] dark:text-white flex items-center">
            <LayoutTemplate className="mr-3 w-8 h-8 text-blue-600 dark:text-blue-400" />
            Email Templates
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1.5">
            {templates.length} templates · Click preview to see the full email render
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { fetchTemplates(); fetchUsage() }} disabled={isLoading} variant="ghost" size="icon" className="text-slate-500 hover:text-[#0b192c] dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer" aria-label="Refresh">
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} className="bg-[#0b192c] hover:bg-blue-600 text-white rounded-xl py-5 px-5 font-bold shadow-md cursor-pointer flex items-center">
            <Plus className="mr-2 w-4 h-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Usage Analytics */}
      <UsageAnalyticsPanel usage={usage} />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Templates", val: templates.length, desc: "Stored in MongoDB", icon: FileCode2 },
          { label: "Active Slugs", val: templates.length, desc: "Unique identifiers", icon: Zap },
          { label: "Total Variables", val: templates.reduce((sum, t) => sum + extractVariables(t.htmlContent).length, 0), desc: "{{placeholders}} detected", icon: Clock },
        ].map((metric, idx) => {
          const Icon = metric.icon
          return (
            <Card key={idx} className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl">
              <CardHeader className="pb-3.5">
                <CardDescription className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {metric.label}
                </CardDescription>
                <CardTitle className="text-2xl sm:text-3xl font-black font-heading text-[#0b192c] dark:text-blue-400 mt-1">
                  {metric.val}
                </CardTitle>
                <p className="text-[11px] font-semibold text-slate-500 mt-1.5">{metric.desc}</p>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white" />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, idx) => {
            const variables = extractVariables(template.htmlContent)
            const tagColor = TAG_COLORS[idx % TAG_COLORS.length]

            return (
              <motion.div key={template._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2, delay: idx * 0.03 }}>
                <Card className="group border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm rounded-2xl hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800/50 transition-all overflow-hidden flex flex-col">
                  {/* Mini email preview thumbnail */}
                  <div
                    className="relative h-40 overflow-hidden bg-[#f0f4f8] cursor-pointer border-b border-slate-100 dark:border-slate-800"
                    onClick={() => setPreviewTemplate(template)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setPreviewTemplate(template)}
                    aria-label={`Preview ${template.name}`}
                  >
                    {/* Scaled-down iframe thumbnail */}
                    <div className="absolute inset-0" style={{ transform: "scale(0.4)", transformOrigin: "top center", width: "250%", marginLeft: "-75%", height: "250%" }}>
                      <iframe
                        srcDoc={template.htmlContent}
                        title={`Thumbnail: ${template.name}`}
                        className="w-full h-full border-0 pointer-events-none"
                        sandbox="allow-same-origin"
                        tabIndex={-1}
                      />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0">
                        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-bold text-[#0b192c]">
                          <Eye className="w-4 h-4" />
                          Preview Email
                        </div>
                      </div>
                    </div>
                    {/* Color accent bar at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                  </div>

                  <CardContent className="p-5 space-y-3.5 flex-1 flex flex-col">
                    {/* Name + slug */}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1 mr-2">
                        <h3 className="text-base font-extrabold text-[#0b192c] dark:text-white truncate leading-tight">
                          {template.name}
                        </h3>
                        <span className={`inline-flex items-center mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tagColor}`}>
                          {template.slug}
                        </span>
                      </div>
                      <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileCode2 className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Subject</p>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{template.subject}</p>
                    </div>

                    {/* Variables */}
                    {variables.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {variables.slice(0, 4).map((v) => (
                          <span key={v} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200/40 font-mono">
                            {"{{"}{v}{"}}"}
                          </span>
                        ))}
                        {variables.length > 4 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            +{variables.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer: date + actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 mt-auto">
                      <p className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(template.updatedAt)}
                      </p>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setPreviewTemplate(template)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors cursor-pointer" aria-label="Preview">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <Link href={`/dashboard/templates/${template._id}`}>
                          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#0b192c] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer" aria-label="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button onClick={() => setDeleteTarget(template)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer" aria-label="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400">
            <LayoutTemplate className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-700" />
            <p className="font-semibold text-sm">No templates found.</p>
            <p className="text-xs mt-1">Try a different search or create a new template.</p>
          </div>
        )}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form onSubmit={handleCreateTemplate} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-xl font-heading font-black text-[#0b192c] dark:text-white flex items-center">
                <FileCode2 className="mr-2.5 w-5 h-5 text-blue-500" />
                Create New Template
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-slate-500 mt-1">
                Set a name, slug, and subject. HTML is edited in the canvas editor.
              </DialogDescription>
            </DialogHeader>
            {[
              { id: "tpl-name", label: "Template Name", placeholder: "e.g. Password Reset Email", value: newTemplateName, onChange: (v: string) => setNewTemplateName(v) },
              { id: "tpl-slug", label: "Slug Identifier", placeholder: "e.g. password-reset", value: newTemplateSlug, onChange: (v: string) => setNewTemplateSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, "-")) },
              { id: "tpl-subject", label: "Default Subject Line", placeholder: "e.g. Reset your Sansrut password", value: newTemplateSubject, onChange: (v: string) => setNewTemplateSubject(v) },
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <label htmlFor={field.id} className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">{field.label}</label>
                <input id={field.id} type="text" required placeholder={field.placeholder} value={field.value} onChange={(e) => field.onChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[#0b192c] dark:text-white" />
              </div>
            ))}
            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-900">
              <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)} className="rounded-xl cursor-pointer font-bold text-slate-500">Cancel</Button>
              <Button type="submit" className="bg-[#0b192c] hover:bg-blue-600 text-white rounded-xl px-5 font-bold cursor-pointer">Create Template</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading font-black text-red-600 dark:text-red-400 flex items-center">
              <Trash2 className="mr-2.5 w-5 h-5" />
              Delete Template
            </DialogTitle>
            <DialogDescription className="text-sm font-semibold text-slate-500 mt-1.5">
              Permanently delete <span className="text-[#0b192c] dark:text-white font-extrabold">&ldquo;{deleteTarget?.name}&rdquo;</span>? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-900">
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)} className="rounded-xl cursor-pointer font-bold text-slate-500">Keep Template</Button>
            <Button type="button" onClick={handleDeleteTemplate} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 font-bold cursor-pointer">Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
