import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

// ---------- Mongo helpers ----------
let _client = null;
async function getDb() {
  if (!_client) {
    _client = new MongoClient(process.env.MONGO_URL);
    await _client.connect();
  }
  return _client.db(process.env.DB_NAME || "agency");
}

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

// ============================================================
// LEAD / CONTACT-FORM PROVIDER ADAPTER
// Structured so you can drop in Resend, Formspree, EmailJS, or
// a custom API later WITHOUT touching the UI.
//
// To enable a provider set LEAD_PROVIDER env var to one of:
//   "resend"    -> uses RESEND_API_KEY + LEAD_TO_EMAIL
//   "formspree" -> uses FORMSPREE_ENDPOINT
//   "emailjs"   -> uses EMAILJS_SERVICE_ID / TEMPLATE_ID / USER_ID
//   "custom"    -> POSTs to CUSTOM_LEAD_ENDPOINT
//   anything else -> stored in Mongo only (default MVP behavior)
// ============================================================
async function forwardLead(payload) {
  const provider = (process.env.LEAD_PROVIDER || "").toLowerCase();
  try {
    if (provider === "resend" && process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || "leads@resend.dev",
          to: [process.env.LEAD_TO_EMAIL],
          subject: `New lead — ${payload.fullName} (${payload.businessName || "—"})`,
          html: `<pre>${JSON.stringify(payload, null, 2)}</pre>`,
        }),
      });
    } else if (provider === "formspree" && process.env.FORMSPREE_ENDPOINT) {
      await fetch(process.env.FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
    } else if (provider === "custom" && process.env.CUSTOM_LEAD_ENDPOINT) {
      await fetch(process.env.CUSTOM_LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    // EmailJS is client-side by design; skip on server.
  } catch (err) {
    console.error("[lead-provider]", err);
  }
}

// ============================================================
// NEWSLETTER PROVIDER ADAPTER
// Set NEWSLETTER_PROVIDER to "resend", "mailchimp", "convertkit",
// "supabase", or leave unset for Mongo-only storage.
// ============================================================
async function forwardNewsletter(email) {
  const provider = (process.env.NEWSLETTER_PROVIDER || "").toLowerCase();
  try {
    if (provider === "mailchimp" && process.env.MAILCHIMP_API_KEY) {
      const dc = process.env.MAILCHIMP_API_KEY.split("-")[1];
      await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from("anystring:" + process.env.MAILCHIMP_API_KEY).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_address: email, status: "subscribed" }),
        }
      );
    } else if (provider === "convertkit" && process.env.CONVERTKIT_API_KEY) {
      await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ api_key: process.env.CONVERTKIT_API_KEY, email }),
        }
      );
    } else if (provider === "resend" && process.env.RESEND_API_KEY && process.env.RESEND_AUDIENCE_ID) {
      await fetch(
        `https://api.resend.com/audiences/${process.env.RESEND_AUDIENCE_ID}/contacts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, unsubscribed: false }),
        }
      );
    }
    // Supabase would use its SDK client-side or via service key.
  } catch (err) {
    console.error("[newsletter-provider]", err);
  }
}

// ============================================================
// ROUTES
// ============================================================
export async function GET(request, { params }) {
  const path = (await params)?.path || [];
  const route = Array.isArray(path) ? path.join("/") : path;

  if (route === "" || route === "health") {
    return json({ ok: true, service: "agency-api" });
  }

  if (route === "leads") {
    try {
      const db = await getDb();
      const leads = await db
        .collection("leads")
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
      return json({ leads });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  if (route === "newsletter") {
    try {
      const db = await getDb();
      const subs = await db
        .collection("newsletter")
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
      return json({ subscribers: subs });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  return json({ error: "not found", route }, 404);
}

export async function POST(request, { params }) {
  const path = (await params)?.path || [];
  const route = Array.isArray(path) ? path.join("/") : path;

  // -------- Contact / Lead form --------
  if (route === "contact") {
    try {
      const body = await request.json();
      const {
        fullName,
        email,
        phone,
        businessName,
        website,
        service,
        budget,
        message,
      } = body || {};

      if (!fullName || !email || !phone || !businessName || !service || !budget || !message) {
        return json({ error: "Please fill in all required fields." }, 400);
      }
      if (!validEmail(email)) {
        return json({ error: "Please provide a valid email address." }, 400);
      }

      const doc = {
        id: uuidv4(),
        fullName: String(fullName).trim(),
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        businessName: String(businessName).trim(),
        website: (website || "").trim(),
        service,
        budget,
        message: String(message).trim(),
        source: "website-contact-form",
        createdAt: new Date().toISOString(),
      };

      const db = await getDb();
      await db.collection("leads").insertOne({ ...doc });
      await forwardLead(doc);

      return json({ ok: true, id: doc.id, message: "Thanks! We'll be in touch within one business day." });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  // -------- Newsletter --------
  if (route === "newsletter") {
    try {
      const { email } = await request.json();
      if (!validEmail(email)) {
        return json({ error: "Please enter a valid email address." }, 400);
      }
      const clean = String(email).trim().toLowerCase();
      const db = await getDb();
      const existing = await db.collection("newsletter").findOne({ email: clean });
      if (existing) {
        return json({ ok: true, alreadySubscribed: true, message: "You're already on the list — thanks!" });
      }
      const doc = {
        id: uuidv4(),
        email: clean,
        createdAt: new Date().toISOString(),
      };
      await db.collection("newsletter").insertOne({ ...doc });
      await forwardNewsletter(clean);
      return json({ ok: true, message: "You're in. Watch your inbox for our next drop." });
    } catch (e) {
      return json({ error: e.message }, 500);
    }
  }

  return json({ error: "not found", route }, 404);
}
