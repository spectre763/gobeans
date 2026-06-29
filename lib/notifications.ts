import nodemailer from "nodemailer";
import { Resend } from "resend";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import type { Booking } from "./bookings";
import { BOOKABLE_LOCATIONS } from "@/data/locations";

function formatTimeSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function buildConfirmationEmail(booking: Booking) {
  const location = BOOKABLE_LOCATIONS.find((loc) => loc.id === booking.locationId);
  const formattedDate = new Date(booking.date).toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = formatTimeSlot(booking.time);
  const guestLabel = booking.partySize === 1 ? "guest" : "guests";
  const locationAddress = location
    ? `${location.address}, ${location.city}`
    : booking.locationName;
  const locationPhone = location?.phone ?? "+91 98765 43210";

  const subject = `GoBeans Reservation Confirmed — ${formattedDate} at ${formattedTime}`;

  const text = [
    `Hi ${booking.name},`,
    ``,
    `Your table at GoBeans ${booking.locationName} is confirmed.`,
    ``,
    `Name:     ${booking.name}`,
    `Email:    ${booking.email}`,
    `Phone:    ${booking.phone}`,
    `Date:     ${formattedDate}`,
    `Time:     ${formattedTime}`,
    `Guests:   ${booking.partySize} ${guestLabel}`,
    `Location: ${booking.locationName}`,
    `Address:  ${locationAddress}`,
    `Hours:    11:00 AM – 11:00 PM daily`,
    booking.notes ? `Notes:    ${booking.notes}` : "",
    ``,
    `We hold reservations for 15 minutes.`,
    ``,
    `See you soon,`,
    `The GoBeans Team`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0eb;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#050505;padding:32px 36px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
              Go<span style="color:#C58B45;">Beans</span>
            </p>
            <p style="margin:8px 0 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.45);">
              Reservation Confirmed
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px;">
            <p style="margin:0 0 8px;font-size:16px;color:#1a1a1a;">Hi ${booking.name},</p>
            <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
              Your table at <strong style="color:#1a1a1a;">${booking.locationName}</strong> is booked. We look forward to welcoming you.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:8px;overflow:hidden;margin-bottom:28px;">
              <tr style="background:#faf7f4;">
                <td style="padding:12px 16px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;width:90px;">Name</td>
                <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-weight:500;">${booking.name}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Email</td>
                <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-weight:500;">${booking.email}</td>
              </tr>
              <tr style="background:#faf7f4;">
                <td style="padding:12px 16px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Phone</td>
                <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-weight:500;">${booking.phone}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Date</td>
                <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-weight:500;">${formattedDate}</td>
              </tr>
              <tr style="background:#faf7f4;">
                <td style="padding:12px 16px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Time</td>
                <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-weight:500;">${formattedTime}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Guests</td>
                <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;font-weight:500;">${booking.partySize} ${guestLabel}</td>
              </tr>
              <tr style="background:#faf7f4;">
                <td style="padding:12px 16px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Location</td>
                <td style="padding:12px 16px;font-size:14px;color:#1a1a1a;">${booking.locationName}<br><span style="color:#777;font-size:13px;">${locationAddress}</span></td>
              </tr>
              ${booking.notes ? `<tr><td style="padding:12px 16px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">Notes</td><td style="padding:12px 16px;font-size:14px;color:#1a1a1a;">${booking.notes}</td></tr>` : ""}
            </table>
            <p style="margin:0 0 6px;font-size:13px;color:#999;">Café hours: 11:00 AM – 11:00 PM daily</p>
            <p style="margin:0 0 24px;font-size:13px;color:#999;">Reservations held for 15 minutes.</p>
            <p style="margin:0;font-size:14px;color:#555;">See you soon,<br><strong style="color:#C58B45;">The GoBeans Team</strong></p>
          </td>
        </tr>
        <tr>
          <td style="background:#050505;padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:0.05em;">
              GoBeans Café · Bhavnagar, Gujarat
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

async function saveToOutbox(
  booking: Booking,
  payload: { subject: string; text: string; html: string }
) {
  const outboxFile = path.join(process.cwd(), "data", "email-outbox.json");
  let outbox: Array<{
    to: string;
    subject: string;
    text: string;
    sentAt: string;
    bookingId: string;
  }> = [];

  try {
    const raw = await fs.readFile(outboxFile, "utf-8");
    outbox = JSON.parse(raw);
  } catch {
    await fs.mkdir(path.dirname(outboxFile), { recursive: true });
  }

  outbox.push({
    to: booking.email,
    subject: payload.subject,
    text: payload.text,
    sentAt: new Date().toISOString(),
    bookingId: booking.id,
  });

  await fs.writeFile(outboxFile, JSON.stringify(outbox, null, 2), "utf-8");
}

async function sendViaResend(
  booking: Booking,
  payload: { subject: string; text: string; html: string }
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from =
    process.env.RESEND_FROM || "GoBeans <onboarding@resend.dev>";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: booking.email,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  if (error) {
    console.error("Resend error:", error);
    return false;
  }

  return true;
}

async function sendViaSmtp(
  booking: Booking,
  payload: { subject: string; text: string; html: string }
): Promise<boolean> {
  if (!process.env.SMTP_HOST) return false;

  const from = process.env.SMTP_FROM || "hello@gobeans.in";

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `GoBeans <${from}>`,
    to: booking.email,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });

  return true;
}

export async function sendBookingConfirmation(
  booking: Booking
): Promise<boolean> {
  const payload = buildConfirmationEmail(booking);

  if (process.env.RESEND_API_KEY) {
    return sendViaResend(booking, payload);
  }

  if (process.env.SMTP_HOST) {
    return sendViaSmtp(booking, payload);
  }

  await saveToOutbox(booking, payload);
  return true;
}
