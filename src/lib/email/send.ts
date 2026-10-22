import { appendFileSync } from "node:fs";
import { resend, EMAIL_FROM } from "@/lib/email/resend";

interface Mail {
  to: string;
  subject: string;
  html: string;
}

/**
 * Levélküldés a Resenden át. RESEND_API_KEY nélkül nem küld, hanem naplóz:
 * a konzolra, és ha az EMAIL_LOG_FILE be van állítva, JSON-sorként a fájlba
 * (az E2E csomag ezt olvassa). A küldési hiba soha nem dobódik tovább.
 */
export async function sendMail(mail: Mail): Promise<"sent" | "logged" | "failed"> {
  if (!process.env.RESEND_API_KEY?.trim()) {
    const entry = {
      at: new Date().toISOString(),
      from: EMAIL_FROM,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
    };
    console.log(`[email:napló] ${mail.to} | ${mail.subject}`);
    const file = process.env.EMAIL_LOG_FILE?.trim();
    if (file) {
      try {
        appendFileSync(file, JSON.stringify(entry) + "\n");
      } catch (error) {
        console.error("Az e-mail napló írása sikertelen:", error);
      }
    }
    return "logged";
  }
  try {
    await resend.emails.send({ from: EMAIL_FROM, ...mail });
    return "sent";
  } catch (error) {
    console.error(`E-mail küldési hiba (${mail.subject}):`, error);
    return "failed";
  }
}

/** Felhasználótól jövő szöveg beillesztése a levél HTML-jébe. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
