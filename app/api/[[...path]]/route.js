import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { subscribeNewsletter } from "@/lib/resend";

export const runtime = "nodejs";

// ============================================================
// MongoDB
// ============================================================

let _client = null;

async function getDb() {
  if (!_client) {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is missing");
    }

    _client = new MongoClient(process.env.MONGO_URL);
    await _client.connect();
  }

  return _client.db(process.env.DB_NAME || "agency");
}

// ============================================================
// JSON helper
// ============================================================

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

// ============================================================
// Email validation
// ============================================================

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email || "").trim()
  );
}

// ============================================================
// WEB3FORMS - CONTACT FORM
// ============================================================
//
// Contact form flow:
//
// Frontend
//    ↓
// /api/contact
//    ↓
// MongoDB
//    ↓
// Web3Forms
//    ↓
// Your email
//
// Required Vercel variable:
//
// WEB3FORMS_ACCESS_KEY
//
// ============================================================

async function forwardLead(payload) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    console.error(
      "[Web3Forms] WEB3FORMS_ACCESS_KEY is missing"
    );

    return {
      ok: false,
      error: "WEB3FORMS_ACCESS_KEY is missing",
    };
  }

  try {
    const web3Response = await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          access_key: accessKey,

          subject: `New NAVYRIX Lead — ${payload.fullName}`,

          from_name: "NAVYRIX Website",

          name: payload.fullName,

          email: payload.email,

          phone: payload.phone,

          businessName: payload.businessName,

          website: payload.website || "",

          service: payload.service,

          budget: payload.budget,

          message: payload.message,

          replyto: payload.email,
        }),
      }
    );

    const result = await web3Response.json();

    console.log("[Web3Forms]", {
      status: web3Response.status,
      success: result?.success,
      message: result?.message,
    });

    if (!web3Response.ok || !result?.success) {
      console.error(
        "[Web3Forms] Email failed:",
        result
      );

      return {
        ok: false,
        error:
          result?.message ||
          "Web3Forms submission failed",
      };
    }

    console.log(
      "[Web3Forms] Email sent successfully"
    );

    return {
      ok: true,
    };
  } catch (error) {
    console.error(
      "[Web3Forms] Request error:",
      error
    );

    return {
      ok: false,
      error: String(
        error?.message || error
      ),
    };
  }
}

// ============================================================
// NEWSLETTER
// ============================================================
//
// Newsletter still uses your existing Resend integration.
//
// Set:
//
// NEWSLETTER_PROVIDER=resend
//
// ============================================================

async function forwardNewsletter(email) {
  const provider = (
    process.env.NEWSLETTER_PROVIDER || ""
  ).toLowerCase();

  try {
    // -------------------------
    // Mailchimp
    // -------------------------

    if (
      provider === "mailchimp" &&
      process.env.MAILCHIMP_API_KEY
    ) {
      const dc =
        process.env.MAILCHIMP_API_KEY.split("-")[1];

      await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Basic ${Buffer.from(
                "anystring:" +
                  process.env.MAILCHIMP_API_KEY
              ).toString("base64")}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
          }),
        }
      );
    }

    // -------------------------
    // ConvertKit
    // -------------------------

    else if (
      provider === "convertkit" &&
      process.env.CONVERTKIT_API_KEY
    ) {
      await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            api_key:
              process.env.CONVERTKIT_API_KEY,

            email,
          }),
        }
      );
    }

    // -------------------------
    // Resend
    // -------------------------

    else if (
      provider === "resend" &&
      process.env.RESEND_API_KEY
    ) {
      await subscribeNewsletter(email);
    }

    return {
      ok: true,
    };
  } catch (error) {
    console.error(
      "[Newsletter Provider]",
      error
    );

    return {
      ok: false,
      error: String(
        error?.message || error
      ),
    };
  }
}

// ============================================================
// GET ROUTES
// ============================================================

export async function GET(request, { params }) {
  const path =
    (await params)?.path || [];

  const route = Array.isArray(path)
    ? path.join("/")
    : path;

  // -------------------------
  // Health
  // -------------------------

  if (
    route === "" ||
    route === "health"
  ) {
    return json({
      ok: true,
      service: "agency-api",
    });
  }

  // -------------------------
  // Leads
  // -------------------------

  if (route === "leads") {
    try {
      const db = await getDb();

      const leads = await db
        .collection("leads")
        .find(
          {},
          {
            projection: {
              _id: 0,
            },
          }
        )
        .sort({
          createdAt: -1,
        })
        .limit(50)
        .toArray();

      return json({
        leads,
      });
    } catch (error) {
      console.error(
        "[GET leads]",
        error
      );

      return json(
        {
          error: error.message,
        },
        500
      );
    }
  }

  // -------------------------
  // Newsletter
  // -------------------------

  if (route === "newsletter") {
    try {
      const db = await getDb();

      const subscribers =
        await db
          .collection("newsletter")
          .find(
            {},
            {
              projection: {
                _id: 0,
              },
            }
          )
          .sort({
            createdAt: -1,
          })
          .limit(50)
          .toArray();

      return json({
        subscribers,
      });
    } catch (error) {
      console.error(
        "[GET newsletter]",
        error
      );

      return json(
        {
          error: error.message,
        },
        500
      );
    }
  }

  return json(
    {
      error: "not found",
      route,
    },
    404
  );
}

// ============================================================
// POST ROUTES
// ============================================================

export async function POST(request, { params }) {
  const path =
    (await params)?.path || [];

  const route = Array.isArray(path)
    ? path.join("/")
    : path;

  // ==========================================================
  // CONTACT FORM
  // ==========================================================

  if (route === "contact") {
    try {
      const body =
        await request.json();

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

      // -------------------------
      // Required fields
      // -------------------------

      if (
        !fullName ||
        !email ||
        !phone ||
        !businessName ||
        !service ||
        !budget ||
        !message
      ) {
        return json(
          {
            error:
              "Please fill in all required fields.",
          },
          400
        );
      }

      // -------------------------
      // Email validation
      // -------------------------

      if (!validEmail(email)) {
        return json(
          {
            error:
              "Please provide a valid email address.",
          },
          400
        );
      }

      // -------------------------
      // Create lead
      // -------------------------

      const doc = {
        id: uuidv4(),

        fullName:
          String(fullName).trim(),

        email:
          String(email)
            .trim()
            .toLowerCase(),

        phone:
          String(phone).trim(),

        businessName:
          String(businessName).trim(),

        website:
          String(website || "").trim(),

        service,

        budget,

        message:
          String(message).trim(),

        source:
          "website-contact-form",

        createdAt:
          new Date().toISOString(),
      };

      // ========================================================
      // STEP 1
      // SAVE LEAD TO MONGODB
      // ========================================================

      const db = await getDb();

      await db
        .collection("leads")
        .insertOne({
          ...doc,
        });

      console.log(
        "[Contact] Lead saved to MongoDB:",
        doc.id
      );

      // ========================================================
      // STEP 2
      // SEND EMAIL THROUGH WEB3FORMS
      // ========================================================

      const emailResult =
        await forwardLead(doc);

      if (!emailResult.ok) {
        console.error(
          "[Contact] Web3Forms failed:",
          emailResult.error
        );
      }

      // ========================================================
      // STEP 3
      // RETURN SUCCESS
      // ========================================================

      return json({
        ok: true,

        id: doc.id,

        message:
          "Thanks! We'll be in touch within one business day.",

        emailSent:
          emailResult.ok,
      });
    } catch (error) {
      console.error(
        "[Contact] Error:",
        error
      );

      return json(
        {
          error:
            error.message,
        },
        500
      );
    }
  }

  // ==========================================================
  // NEWSLETTER
  // ==========================================================

  if (route === "newsletter") {
    try {
      const body =
        await request.json();

      const { email } = body || {};

      // -------------------------
      // Validate email
      // -------------------------

      if (!validEmail(email)) {
        return json(
          {
            error:
              "Please enter a valid email address.",
          },
          400
        );
      }

      const clean =
        String(email)
          .trim()
          .toLowerCase();

      const db = await getDb();

      // -------------------------
      // Check duplicate
      // -------------------------

      const existing =
        await db
          .collection("newsletter")
          .findOne({
            email: clean,
          });

      if (existing) {
        return json({
          ok: true,

          alreadySubscribed: true,

          message:
            "You're already on the list — thanks!",
        });
      }

      // -------------------------
      // Create subscriber
      // -------------------------

      const doc = {
        id: uuidv4(),

        email: clean,

        createdAt:
          new Date().toISOString(),
      };

      // -------------------------
      // Save to MongoDB
      // -------------------------

      await db
        .collection("newsletter")
        .insertOne({
          ...doc,
        });

      // -------------------------
      // Send newsletter email
      // -------------------------

      await forwardNewsletter(
        clean
      );

      return json({
        ok: true,

        message:
          "You're in. Watch your inbox for our next drop.",
      });
    } catch (error) {
      console.error(
        "[Newsletter] Error:",
        error
      );

      return json(
        {
          error:
            error.message,
        },
        500
      );
    }
  }

  // ==========================================================
  // UNKNOWN ROUTE
  // ==========================================================

  return json(
    {
      error: "not found",
      route,
    },
    404
  );
}
