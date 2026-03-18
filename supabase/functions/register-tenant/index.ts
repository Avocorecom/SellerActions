// Supabase Edge Function: register-tenant
// Handles tenant registration + Amazon store connection after OAuth callback
// Replaces the old Next.js API routes: RegisterTenant + TenantStoresGrantAccessToStore
//
// Environment secrets (set via: supabase secrets set KEY=VALUE):
//   BACKEND_API_URL    - e.g. https://v1host.analision.net/api
//   BACKEND_ADMIN_USER - e.g. ApplicationUser@avocore.com
//   BACKEND_ADMIN_PASS - admin password
//   RESEND_API_KEY     - Resend.com API key for sending emails

import "@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonRes({ status: false, error: "Method not allowed" }, 405);
  }

  try {
    const API_URL = Deno.env.get("BACKEND_API_URL")!;
    const ADMIN_USER = Deno.env.get("BACKEND_ADMIN_USER")!;
    const ADMIN_PASS = Deno.env.get("BACKEND_ADMIN_PASS")!;

    const body = await req.json();
    const {
      email,
      name,
      password,
      companyName,
      spapiOauthCode,
      sellingPartnerId,
      storeName,
      serviceTypeIds, // array of serviceTypeId numbers, e.g. [5, 8]
      products,       // array of { slug, name } from cart
    } = body;

    // Validate required fields
    if (!email || !name || !password || !companyName) {
      return jsonRes(
        {
          status: false,
          error:
            "Missing required fields: email, name, password, companyName",
        },
        400,
      );
    }

    // ===== STEP 1: Admin login to .NET backend =====
    const adminLoginRes = await backendPost(
      `${API_URL}/TokenAuth/Authenticate`,
      {
        userNameOrEmailAddress: ADMIN_USER,
        password: ADMIN_PASS,
      },
    );

    if (!adminLoginRes.result?.accessToken) {
      return jsonRes(
        { status: false, error: "Backend admin login failed" },
        500,
      );
    }

    const adminToken = adminLoginRes.result.accessToken;

    // ===== STEP 2: Create Tenant (no Stripe) =====
    const tenancyName = companyName
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/ /g, "_");

    // Build service list without Stripe subscription IDs
    const serviceTypeIdList = (serviceTypeIds || []).map((id: number) => ({
      serviceTypeId: id,
      stripeSubscriptionId: "",
    }));

    // Trial end date: 14 days from now
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const tenantData = {
      tenancyName,
      name,
      adminEmailAddress: email,
      adminPassword: password,
      editionId: null,
      isInTrialPeriod: true,
      subscriptionEndDateUtc: trialEnd.toISOString(),
      isActive: true,
      platformName: "SellerActions",
      serviceTypeIdList,
      customerId: "",
    };

    let tenantToken: string;
    let customerId: string;
    let tenantId: string | undefined;
    let isExistingUser = false;

    // Try creating tenant
    let createTenantRes: any;
    try {
      createTenantRes = await backendPost(
        `${API_URL}/services/app/Tenant/CreateTenant`,
        tenantData,
        adminToken,
      );
    } catch (e: any) {
      // If email already exists, try logging in with existing credentials
      const errMsg = (e.message || "").toLowerCase();
      if (errMsg.includes("already") || errMsg.includes("exist") || errMsg.includes("duplicate")) {
        isExistingUser = true;
      } else {
        return jsonRes({ status: false, error: e.message || "Failed to create tenant" }, 400);
      }
    }

    // Also check structured error response
    if (createTenantRes?.error) {
      const errMsg = (createTenantRes.error?.message || "").toLowerCase();
      if (errMsg.includes("already") || errMsg.includes("exist") || errMsg.includes("duplicate")) {
        isExistingUser = true;
      } else {
        return jsonRes(
          { status: false, error: createTenantRes.error?.message || "Failed to create tenant" },
          400,
        );
      }
    }

    if (!isExistingUser) {
      tenantId = createTenantRes?.result?.tenantId;
    }

    // ===== STEP 3: Login as tenant admin (new or existing) =====
    const tenantLoginRes = await backendPost(
      `${API_URL}/TokenAuth/Authenticate`,
      {
        userNameOrEmailAddress: email,
        password: password,
      },
    );

    if (!tenantLoginRes.result?.accessToken) {
      return jsonRes(
        {
          status: false,
          error: isExistingUser
            ? "Account exists but login failed. Please check your password."
            : "Tenant created but login failed",
        },
        isExistingUser ? 401 : 500,
      );
    }

    tenantToken = tenantLoginRes.result.accessToken;
    customerId = tenantLoginRes.result.customerId;

    // ===== STEP 4: Grant Amazon store access (if OAuth data provided) =====
    let storeResult = null;
    if (spapiOauthCode && sellingPartnerId) {
      const grantStoreData = {
        IntegrationEndpointName: "Amazon",
        amazonMarketplaceIds: [3],
        PlatformName: "SellerActions",
        spapiOauthCode,
        sellingPartnerId,
        name: storeName || "Amazon Store",
      };

      try {
        const storeRes = await backendPost(
          `${API_URL}/services/app/Stores/GrantAccessToStore`,
          grantStoreData,
          tenantToken,
        );
        storeResult = storeRes.result || storeRes;
      } catch (e) {
        console.error("Store grant failed:", e);
        storeResult = {
          error: "Store connection failed, can be retried from dashboard",
        };
      }
    }

    // ===== STEP 5: Send welcome email =====
    const productList = products || [];
    try {
      await sendWelcomeEmail(email, name, companyName, productList, trialEnd);
    } catch (e) {
      console.error("Welcome email failed:", e);
      // Don't fail registration if email fails
    }

    // ===== SUCCESS =====
    return jsonRes({
      status: true,
      result: {
        accessToken: tenantToken,
        customerId,
        tenantId,
        isExistingUser,
        store: storeResult,
        products: productList,
      },
    });
  } catch (error) {
    console.error("register-tenant error:", error);
    return jsonRes(
      {
        status: false,
        error: error.message || "Internal server error",
      },
      500,
    );
  }
});

// Helper: Send welcome email via Resend
async function sendWelcomeEmail(
  email: string,
  name: string,
  companyName: string,
  products: Array<{ slug: string; name: string }>,
  trialEnd: Date,
) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping welcome email");
    return;
  }

  const trialEndStr = trialEnd.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const productRows = products.length > 0
    ? products.map(p => `
        <tr>
          <td style="padding:10px 16px; border-bottom:1px solid #1e293b; color:#e2e8f0; font-size:14px;">${p.name}</td>
          <td style="padding:10px 16px; border-bottom:1px solid #1e293b; color:#10b981; font-size:14px; text-align:right;">Active</td>
        </tr>
      `).join("")
    : `<tr><td style="padding:10px 16px; color:#94a3b8; font-size:14px;" colspan="2">No tools selected yet</td></tr>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0; padding:0; background:#0b0f1a; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:560px; margin:0 auto; padding:40px 20px;">

        <div style="text-align:center; margin-bottom:32px;">
          <div style="display:inline-block; background:linear-gradient(135deg,#00c2d1,#6366f1); padding:10px 16px; border-radius:10px; color:#fff; font-weight:700; font-size:18px; letter-spacing:0.5px;">SA</div>
          <h1 style="color:#ffffff; font-size:22px; margin:16px 0 4px;">Welcome to SellerActions!</h1>
          <p style="color:#94a3b8; font-size:14px; margin:0;">Your free trial has started</p>
        </div>

        <div style="background:#111827; border:1px solid #1e293b; border-radius:12px; padding:28px; margin-bottom:24px;">
          <p style="color:#e2e8f0; font-size:15px; margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
          <p style="color:#94a3b8; font-size:14px; line-height:1.6; margin:0 0 20px;">
            Your account for <strong style="color:#e2e8f0;">${companyName}</strong> is ready.
            Here's a summary of your setup:
          </p>

          <h3 style="color:#00c2d1; font-size:13px; text-transform:uppercase; letter-spacing:1px; margin:0 0 12px;">Your Tools</h3>
          <table style="width:100%; border-collapse:collapse; background:#0d1117; border-radius:8px; overflow:hidden;">
            <thead>
              <tr style="background:#161b22;">
                <th style="padding:10px 16px; text-align:left; color:#64748b; font-size:12px; text-transform:uppercase;">Tool</th>
                <th style="padding:10px 16px; text-align:right; color:#64748b; font-size:12px; text-transform:uppercase;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
        </div>

        <div style="background:#111827; border:1px solid #1e293b; border-radius:12px; padding:24px; margin-bottom:24px;">
          <h3 style="color:#e2e8f0; font-size:14px; margin:0 0 14px;">What's next:</h3>
          <div style="color:#94a3b8; font-size:13px; line-height:1.8;">
            <p style="margin:0;">&#10003; Your Amazon data will start syncing automatically</p>
            <p style="margin:0;">&#10003; Tools are active in your dashboard</p>
            <p style="margin:0;">&#10003; Free trial ends on <strong style="color:#fbbf24;">${trialEndStr}</strong></p>
            <p style="margin:0;">&#10003; No charge until trial ends — we'll remind you before</p>
          </div>
        </div>

        <div style="text-align:center; margin:28px 0;">
          <a href="https://avocorecom.github.io/SellerActions/dashboard.html"
             style="display:inline-block; background:linear-gradient(135deg,#00c2d1,#6366f1); color:#fff; padding:14px 36px; border-radius:8px; font-weight:600; font-size:14px; text-decoration:none;">
            Go to Dashboard
          </a>
        </div>

        <div style="text-align:center; border-top:1px solid #1e293b; padding-top:24px; margin-top:16px;">
          <p style="color:#475569; font-size:12px; margin:0;">
            &copy; 2026 SellerActions. All rights reserved.<br>
            <a href="https://avocorecom.github.io/SellerActions/" style="color:#64748b; text-decoration:none;">selleractions.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "SellerActions <noreply@selleractions.com>",
      to: [email],
      subject: `Welcome to SellerActions — ${products.length} tool${products.length !== 1 ? "s" : ""} activated!`,
      html,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Resend error:", errText);
  }
}

// Helper: POST to .NET backend API (with logging)
async function backendPost(url: string, data: unknown, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Log request (mask sensitive fields)
  const endpoint = url.replace(/https?:\/\/[^/]+/, "");
  const safeData = maskSensitive(data);
  console.log(`[API REQ] ${endpoint}`, JSON.stringify(safeData));

  const startTime = Date.now();
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const json = await res.json();
  const duration = Date.now() - startTime;

  // Log response (mask tokens)
  const safeJson = maskSensitive(json);
  console.log(`[API RES] ${endpoint} → ${res.status} (${duration}ms)`, JSON.stringify(safeJson));

  if (!res.ok && !json.result) {
    throw new Error(json.error?.message || `Backend error: ${res.status}`);
  }

  return json;
}

// Mask passwords, tokens, and keys in log output
function maskSensitive(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;
  const masked: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
  for (const key of Object.keys(masked)) {
    const lk = key.toLowerCase();
    if (lk.includes("password") || lk.includes("secret") || lk.includes("apikey")) {
      masked[key] = "***";
    } else if (lk.includes("token") || lk === "authorization") {
      const val = String(masked[key] || "");
      masked[key] = val.length > 10 ? val.slice(0, 8) + "..." : "***";
    } else if (typeof masked[key] === "object" && masked[key] !== null) {
      masked[key] = maskSensitive(masked[key]);
    }
  }
  return masked;
}

// Helper: JSON response with CORS headers
function jsonRes(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
