import nodemailer from "nodemailer";
import { randomUUID } from "node:crypto";
import { db } from "./database";

export function testMode() {
  return process.env.MARKETPLACE_TEST_MODE === "true";
}
export function mailConfigured() {
  return (
    !testMode() &&
    Boolean(
      process.env.SMTP_HOST && process.env.MAIL_FROM && process.env.APP_ORIGIN,
    )
  );
}
export async function queueMail(
  userId: string,
  recipient: string,
  subject: string,
  content: string,
) {
  const id = randomUUID();
  db()
    .prepare(
      "INSERT INTO mail_outbox (id,user_id,recipient,subject,content,created_at) VALUES (?,?,?,?,?,?)",
    )
    .run(id, userId, recipient, subject, content, Date.now());
  if (!mailConfigured()) return { delivered: false };
  return { delivered: await deliverMail(id) };
}
export async function deliverMail(id: string) {
  const message = db()
    .prepare(
      "SELECT * FROM mail_outbox WHERE id=? AND status IN ('queued','failed')",
    )
    .get(id);
  if (!message || !mailConfigured()) return false;
  const claimed = db()
    .prepare(
      "UPDATE mail_outbox SET status='sending',attempts=attempts+1 WHERE id=? AND status IN ('queued','failed')",
    )
    .run(id);
  if (!Number(claimed.changes)) return false;
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      requireTLS: process.env.SMTP_SECURE !== "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
      connectionTimeout: 10000,
      socketTimeout: 15000,
    });
    await transport.sendMail({
      from: process.env.MAIL_FROM,
      to: String(message.recipient),
      subject: String(message.subject),
      text: String(message.content),
    });
    db()
      .prepare("UPDATE mail_outbox SET status='sent',content='' WHERE id=?")
      .run(id);
    return true;
  } catch {
    db().prepare("UPDATE mail_outbox SET status='failed' WHERE id=?").run(id);
    return false;
  }
}
