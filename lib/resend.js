import { Resend } from "resend";

// ============================================================
// Resend adapter — used only when RESEND_API_KEY is set.
// Called from the /api/contact and /api/newsletter routes.
// Fails silently (logged) so the DB submission always succeeds.
// ============================================================

let _client = null;
function client() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_client) _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const AGENCY_NAME = "NAVYRIX";

function leadNotificationHtml(lead) {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;background:#0b0b0f;color:#e6e6e6;padding:32px;border-radius:16px;max-width:640px">
      <h1 style="font-size:22px;margin:0 0 8px 0;color:#fff">New lead — ${esc(lead.fullName)}</h1>
      <p style="color:#9ca3af;margin:0 0 24px 0">via ${AGENCY_NAME} website contact form</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#9ca3af;width:140px">Full Name</td><td style="padding:8px 0">${esc(lead.fullName)}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af">Email</td><td style="padding:8px 0"><a href="mailto:${esc(lead.email)}" style="color:#a78bfa">${esc(lead.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af">Phone</td><td style="padding:8px 0">${esc(lead.phone)}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af">Business</td><td style="padding:8px 0">${esc(lead.businessName)}</td></tr>
        ${lead.website ? `<tr><td style="padding:8px 0;color:#9ca3af">Website</td><td style="padding:8px 0"><a href="${esc(lead.website)}" style="color:#a78bfa">${esc(lead.website)}</a></td></tr>` : ""}
        <tr><td style="padding:8px 0;color:#9ca3af">Service</td><td style="padding:8px 0">${esc(lead.service)}</td></tr>
        <tr><td style="padding:8px 0;color:#9ca3af">Budget</td><td style="padding:8px 0">${esc(lead.budget)}</td></tr>
      </table>
      <div style="margin-top:24px;padding:16px;border-radius:12px;background:#141420">
        <div style="color:#9ca3af;font-size:12px;margin-bottom:6px">Message</div>
        <div style="white-space:pre-wrap;line-height:1.6">${esc(lead.message)}</div>
      </div>
      <p style="margin-top:24px;color:#6b7280;font-size:12px">Lead ID: ${esc(lead.id)}</p>
    </div>`;
}

function leadConfirmationHtml(lead) {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;background:#ffffff;color:#111;padding:32px;max-width:560px">
      <h1 style="font-size:22px;margin:0 0 12px 0">Thanks, ${esc(lead.fullName.split(" ")[0])} — we got it. 🙌</h1>
      <p style="color:#4b5563;line-height:1.6">
        Just a quick note to confirm your message reached ${AGENCY_NAME}. Someone on our team
        will personally review your project and reply within <b>one business day</b>.
      </p>
      <p style="color:#4b5563;line-height:1.6">
        Here's what you sent us for reference:
      </p>
      <div style="padding:14px 16px;border-radius:10px;background:#f7f7f9;border:1px solid #ececf1;font-size:14px;line-height:1.6">
        <div><b>Service:</b> ${esc(lead.service)}</div>
        <div><b>Budget:</b> ${esc(lead.budget)}</div>
        <div style="margin-top:8px"><b>Message:</b><br/>${esc(lead.message).replace(/\n/g, "<br/>")}</div>
      </div>
      <p style="color:#4b5563;line-height:1.6;margin-top:24px">
        In the meantime, feel free to reply directly to this email if anything else comes up.
      </p>
      <p style="margin-top:28px;color:#111">— The ${AGENCY_NAME} Team<br/><span style="color:#6b7280;font-size:13px">Lucky Srivastava &amp; Abhishek Srivastava · Founders</span></p>
    </div>`;
}

function newsletterWelcomeHtml() {
  return `
    <div style="font-family:Inter,system-ui,sans-serif;background:#ffffff;color:#111;padding:32px;max-width:560px">
      <h1 style="font-size:22px;margin:0 0 12px 0">You're in. Welcome to the NAVYRIX newsletter. ✨</h1>
      <p style="color:#4b5563;line-height:1.6">
        You'll get one thoughtful email a week — case studies, industry breakdowns, and one
        useful tactic you can apply the same day.
      </p>
      <p style="color:#4b5563;line-height:1.6">
        No spam. Unsubscribe anytime.
      </p>
      <p style="margin-top:28px;color:#111">— The ${AGENCY_NAME} Team<br/><span style="color:#6b7280;font-size:13px">Lucky Srivastava &amp; Abhishek Srivastava · Founders</span></p>
    </div>`;
}

// ---------- Public helpers ----------

export async function sendContactEmails(lead) {
  const r = client();
  if (!r) return { skipped: true };
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";
  const notify = process.env.AGENCY_NOTIFICATION_EMAIL;
  // --------------- chatgpt code 6 aug -------------- //
  console.log("========== RESEND DEBUG ==========");
  console.log("FROM:", from);
  console.log("NOTIFY:", notify);
  console.log("LEAD EMAIL:", lead.email);
  console.log("==================================");
  // --------------- chatgpt code 6 aug -------------- //
  const results = {};

  try {
    if (notify) {
      const notification = await r.emails.send({
        from,
        to: [notify],
        replyTo: lead.email,
        subject: `New lead — ${lead.fullName} (${lead.businessName || "—"})`,
        html: leadNotificationHtml(lead),
      });
      // --------------- chatgpt code 6 aug -------------- //
      console.log("RESEND RESPONSE:");
      console.dir(notification, { depth: null });
      // --------------- chatgpt code 6 aug -------------- //
      results.notification = notification;
      if (notification.error) console.error("[resend:notification]", notification.error);
    }

    if (String(process.env.SEND_LEAD_CONFIRMATION).toLowerCase() === "true") {
      const confirmation = await r.emails.send({
        from,
        to: [lead.email],
        subject: `We got your message — ${AGENCY_NAME}`,
        html: leadConfirmationHtml(lead),
      });
      results.confirmation = confirmation;
      if (confirmation.error) console.error("[resend:confirmation]", confirmation.error);
    }
    return { ok: true, ...results };
  } catch (err) {
    console.error("[resend:sendContactEmails]", err);
    return { ok: false, error: String(err?.message || err) };
  }
}

export async function subscribeNewsletter(email) {
  const r = client();
  if (!r) return { skipped: true };
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  try {
    // Optional: add to Resend audience if configured
    if (process.env.RESEND_AUDIENCE_ID) {
      const contact = await r.contacts.create({
        email,
        unsubscribed: false,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });
      if (contact.error) console.error("[resend:contact]", contact.error);
    }
    // Send welcome email
    const welcome = await r.emails.send({
      from,
      to: [email],
      subject: `Welcome to the ${AGENCY_NAME} newsletter`,
      html: newsletterWelcomeHtml(),
    });
    if (welcome.error) console.error("[resend:welcome]", welcome.error);
    return { ok: true };
  } catch (err) {
    console.error("[resend:subscribeNewsletter]", err);
    return { ok: false, error: String(err?.message || err) };
  }
}
