// Supabase Edge Function: register-tenant
// Handles tenant registration + Amazon store connection after OAuth callback
// Replaces the old Next.js API routes: RegisterTenant + TenantStoresGrantAccessToStore
//
// Environment secrets (set via: supabase secrets set KEY=VALUE):
//   BACKEND_API_URL    - e.g. https://v1host.analision.net/api
//   BACKEND_ADMIN_USER - e.g. ApplicationUser@avocore.com
//   BACKEND_ADMIN_PASS - admin password

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

    const createTenantRes = await backendPost(
      `${API_URL}/services/app/Tenant/CreateTenant`,
      tenantData,
      adminToken,
    );

    if (createTenantRes.error) {
      return jsonRes(
        {
          status: false,
          error: createTenantRes.error?.message || "Failed to create tenant",
        },
        400,
      );
    }

    // ===== STEP 3: Login as new tenant admin =====
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
          error: "Tenant created but login failed",
          tenantCreated: true,
        },
        500,
      );
    }

    const tenantToken = tenantLoginRes.result.accessToken;
    const customerId = tenantLoginRes.result.customerId;

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

    // ===== SUCCESS =====
    return jsonRes({
      status: true,
      result: {
        accessToken: tenantToken,
        customerId,
        tenantId: createTenantRes.result?.tenantId,
        store: storeResult,
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

// Helper: POST to .NET backend API
async function backendPost(url: string, data: unknown, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok && !json.result) {
    throw new Error(json.error?.message || `Backend error: ${res.status}`);
  }

  return json;
}

// Helper: JSON response with CORS headers
function jsonRes(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
