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
// JSON RESPONSE HELPER
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
// EMAIL VALIDATION
// ============================================================

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email || "").trim()
  );
}

// ============================================================
// NEWSLETTER PROVIDER
// ============================================================
//
// Newsletter can continue using Resend.
//
// Set:
// NEWSLETTER_PROVIDER=resend
//
// Contact form email is NOT handled here.
// Contact form email is sent directly from ContactForm.js
// through Web3Forms.
// ============================================================

async function forwardNewsletter(email) {
  const provider = (
    process.env.NEWSLETTER_PROVIDER || ""
  ).toLowerCase();

  try {
    // --------------------------------------------------------
    // Mailchimp
    // --------------------------------------------------------

    if (
      provider === "mailchimp" &&
      process.env.MAILCHIMP_API_KEY
    ) {
      const dc =
        process.env.MAILCHIMP_API_KEY.split("-")[1];

      const response = await fetch(
        `https://${dc}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Basic ${Buffer.from(
                "anystring:" +
                  process.env.MAILCHIMP_API_KEY
              ).toString("base64")}`,

            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();

        console.error(
          "[Newsletter] Mailchimp error:",
          text
        );
      }
    }

    // --------------------------------------------------------
    // ConvertKit
    // --------------------------------------------------------

    else if (
      provider === "convertkit" &&
      process.env.CONVERTKIT_API_KEY
    ) {
      const response = await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            api_key:
              process.env.CONVERTKIT_API_KEY,

            email,
          }),
        }
      );

      if (!response.ok) {
        const text = await response.text();

        console.error(
          "[Newsletter] ConvertKit error:",
          text
        );
      }
    }

    // --------------------------------------------------------
    // Resend
    // --------------------------------------------------------

    else if (
      provider === "resend" &&
      process.env.RESEND_API_KEY
    ) {
      const result =
        await subscribeNewsletter(email);

      if (!result?.ok && !result?.skipped) {
        console.error(
          "[Newsletter] Resend failed:",
          result?.error
        );
      }
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

  // ==========================================================
  // HEALTH CHECK
  // ==========================================================

  if (
    route === "" ||
    route === "health"
  ) {
    return json({
      ok: true,
      service: "agency-api",
    });
  }

  // ==========================================================
  // GET LEADS
  // ==========================================================

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
          error:
            error?.message ||
            "Unable to fetch leads",
        },
        500
      );
    }
  }

  // ==========================================================
  // GET NEWSLETTER SUBSCRIBERS
  // ==========================================================

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
          error:
            error?.message ||
            "Unable to fetch subscribers",
        },
        500
      );
    }
  }

  // ==========================================================
  // UNKNOWN GET ROUTE
  // ==========================================================

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

      // --------------------------------------------------------
      // Required fields
      // --------------------------------------------------------

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

      // --------------------------------------------------------
      // Validate email
      // --------------------------------------------------------

      if (!validEmail(email)) {
        return json(
          {
            error:
              "Please provide a valid email address.",
          },
          400
        );
      }

      // --------------------------------------------------------
      // Create lead document
      // --------------------------------------------------------

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

        service:
          String(service).trim(),

        budget:
          String(budget).trim(),

        message:
          String(message).trim(),

        source:
          "website-contact-form",

        createdAt:
          new Date().toISOString(),
      };

      // ========================================================
      // SAVE CONTACT LEAD TO MONGODB
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
      // IMPORTANT
      // ========================================================
      //
      // Email is NOT sent from this route.
      //
      // ContactForm.js sends the email directly to Web3Forms.
      //
      // This avoids the Web3Forms server-side restriction/error.
      //
      // ========================================================

      return json({
        ok: true,

        id: doc.id,

        message:
          "Thanks! We'll be in touch within one business day.",
      });
    } catch (error) {
      console.error(
        "[Contact] Error:",
        error
      );

      return json(
        {
          error:
            error?.message ||
            "Unable to submit contact form",
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

      // --------------------------------------------------------
      // Validate email
      // --------------------------------------------------------

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

      // --------------------------------------------------------
      // Check duplicate
      // --------------------------------------------------------

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

      // --------------------------------------------------------
      // Create subscriber
      // --------------------------------------------------------

      const doc = {
        id: uuidv4(),

        email: clean,

        createdAt:
          new Date().toISOString(),
      };

      // --------------------------------------------------------
      // Save subscriber to MongoDB
      // --------------------------------------------------------

      await db
        .collection("newsletter")
        .insertOne({
          ...doc,
        });

      console.log(
        "[Newsletter] Subscriber saved to MongoDB:",
        clean
      );

      // --------------------------------------------------------
      // Forward to newsletter provider
      // --------------------------------------------------------

      const newsletterResult =
        await forwardNewsletter(clean);

      if (!newsletterResult.ok) {
        console.error(
          "[Newsletter] Provider failed:",
          newsletterResult.error
        );
      }

      // --------------------------------------------------------
      // Return success
      // --------------------------------------------------------

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
            error?.message ||
            "Unable to subscribe",
        },
        500
      );
    }
  }

  // ==========================================================
  // UNKNOWN POST ROUTE
  // ==========================================================

  return json(
    {
      error: "not found",
      route,
    },
    404
  );
}
