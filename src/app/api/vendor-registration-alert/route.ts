import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type VendorAlertPayload = {
  businessName?: string;
  ownerName?: string;
  mobile?: string;
  whatsapp?: string;
  email?: string;
  state?: string;
  city?: string;
  complianceStatus?: string;
  source?: string;
  campaign?: string;
  createdAt?: string;
};

type NormalizedVendorAlertPayload = {
  businessName: string;
  ownerName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  state: string;
  city: string;
  complianceStatus: string;
  source: string;
  campaign: string;
  createdAt: string;
};

const REQUIRED_SMTP_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "ADMIN_VENDOR_ALERT_EMAIL",
] as const;

const REQUIRED_ALERT_FIELDS = [
  "businessName",
  "ownerName",
  "mobile",
  "whatsapp",
  "email",
  "state",
  "city",
  "complianceStatus",
  "source",
  "campaign",
  "createdAt",
] as const;

function normalize(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getMissingEnvVars() {
  return REQUIRED_SMTP_ENV_VARS.filter((key) => !normalize(process.env[key]));
}

function normalizePayload(body: VendorAlertPayload): NormalizedVendorAlertPayload {
  return {
    businessName: normalize(body.businessName),
    ownerName: normalize(body.ownerName),
    mobile: normalize(body.mobile),
    whatsapp: normalize(body.whatsapp),
    email: normalize(body.email),
    state: normalize(body.state),
    city: normalize(body.city),
    complianceStatus: normalize(body.complianceStatus),
    source: normalize(body.source),
    campaign: normalize(body.campaign),
    createdAt: normalize(body.createdAt),
  };
}

function getMissingFields(payload: NormalizedVendorAlertPayload) {
  return REQUIRED_ALERT_FIELDS.filter((field) => !payload[field]);
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VendorAlertPayload;
    const payload = normalizePayload(body);

    const missingFields = getMissingFields(payload);
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required vendor alert fields.",
          missingFields,
        },
        { status: 400 },
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Vendor email is invalid.",
        },
        { status: 400 },
      );
    }

    const missingEnvVars = getMissingEnvVars();
    if (missingEnvVars.length > 0) {
      console.error("VENDOR_ALERT_ENV_MISSING", { missingEnvVars });
      return NextResponse.json(
        {
          success: false,
          message: "Vendor alert email configuration is incomplete.",
          missingEnvVars,
        },
        { status: 503 },
      );
    }

    const recipient = normalize(process.env.ADMIN_VENDOR_ALERT_EMAIL);
    if (recipient.toLowerCase() !== "admin@bookmyhalwai.com") {
      console.error("VENDOR_ALERT_RECIPIENT_INVALID", {
        configuredRecipient: recipient,
      });
      return NextResponse.json(
        {
          success: false,
          message: "Vendor alert recipient is invalid.",
          requiredRecipient: "admin@bookmyhalwai.com",
        },
        { status: 503 },
      );
    }

    const smtpPort = Number(normalize(process.env.SMTP_PORT));
    if (!Number.isInteger(smtpPort) || smtpPort <= 0) {
      console.error("VENDOR_ALERT_SMTP_PORT_INVALID", {
        smtpPort: process.env.SMTP_PORT,
      });
      return NextResponse.json(
        {
          success: false,
          message: "SMTP port is invalid.",
        },
        { status: 503 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: normalize(process.env.SMTP_HOST),
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: normalize(process.env.SMTP_USER),
        pass: normalize(process.env.SMTP_PASS),
      },
    });

    await transporter.sendMail({
      from: normalize(process.env.SMTP_FROM),
      to: recipient,
      subject: `New Vendor Registration: ${payload.businessName}`,
      text: [
        "New vendor registration received.",
        "",
        `Business Name: ${payload.businessName}`,
        `Owner Name: ${payload.ownerName}`,
        `Mobile: ${payload.mobile}`,
        `WhatsApp: ${payload.whatsapp}`,
        `Email: ${payload.email}`,
        `State: ${payload.state}`,
        `City: ${payload.city}`,
        `Compliance Status: ${payload.complianceStatus}`,
        `Source: ${payload.source}`,
        `Campaign: ${payload.campaign}`,
        `Created At: ${payload.createdAt}`,
      ].join("\n"),
      html: `
        <h2>New vendor registration received</h2>
        <table cellpadding="6" cellspacing="0" border="1" style="border-collapse: collapse; border-color: #d1d5db;">
          <tr><td><strong>Business Name</strong></td><td>${payload.businessName}</td></tr>
          <tr><td><strong>Owner Name</strong></td><td>${payload.ownerName}</td></tr>
          <tr><td><strong>Mobile</strong></td><td>${payload.mobile}</td></tr>
          <tr><td><strong>WhatsApp</strong></td><td>${payload.whatsapp}</td></tr>
          <tr><td><strong>Email</strong></td><td>${payload.email}</td></tr>
          <tr><td><strong>State</strong></td><td>${payload.state}</td></tr>
          <tr><td><strong>City</strong></td><td>${payload.city}</td></tr>
          <tr><td><strong>Compliance Status</strong></td><td>${payload.complianceStatus}</td></tr>
          <tr><td><strong>Source</strong></td><td>${payload.source}</td></tr>
          <tr><td><strong>Campaign</strong></td><td>${payload.campaign}</td></tr>
          <tr><td><strong>Created At</strong></td><td>${payload.createdAt}</td></tr>
        </table>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Vendor alert email sent successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("VENDOR_ALERT_EMAIL_FAILED", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Vendor registration saved, but alert email failed.",
      },
      { status: 500 },
    );
  }
}
