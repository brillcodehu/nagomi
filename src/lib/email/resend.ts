import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Lazy proxy
export const resend = new Proxy({} as Resend, {
  get(_, prop) {
    return (getResend() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const EMAIL_FROM = "Nagomi Pilates <foglalas@nagomipilates.hu>";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "info@nagomipilates.hu";
