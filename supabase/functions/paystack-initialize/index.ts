import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { amount_ksh, email, channel, phone } = await req.json();

    if (!amount_ksh || typeof amount_ksh !== "number" || amount_ksh < 10) {
      return new Response(
        JSON.stringify({ error: "Minimum deposit is KSH 10" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const reference = `GPA-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Map channel to method name
    const methodName = channel === 'mpesa' ? 'mpesa' : channel === 'airtel' ? 'airtel_money' : 'bank_card';

    const { error: txError } = await adminClient.from("transactions").insert({
      user_id: user.id,
      type: "deposit",
      method: methodName,
      amount_ksh,
      status: "pending",
      reference,
    });

    if (txError) {
      return new Response(JSON.stringify({ error: "Failed to create transaction" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build Paystack payload
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const paystackBody: Record<string, any> = {
      email: email || user.email,
      amount: Math.round(amount_ksh * 100), // Paystack uses kobo/cents
      currency: "KES",
      reference,
      callback_url: req.headers.get("origin") + "/dashboard/deposit?status=success",
      metadata: {
        user_id: user.id,
        channel: channel || 'bank',
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: user.id,
          },
          {
            display_name: "Payment Channel",
            variable_name: "channel",
            value: channel || 'bank',
          },
        ],
      },
    };

    // For M-Pesa and Airtel, set mobile money channels
    if (channel === 'mpesa' || channel === 'airtel') {
      paystackBody.channels = ["mobile_money"];
      if (phone) {
        paystackBody.metadata.phone = phone;
      }
    } else {
      // Bank/Card
      paystackBody.channels = ["card", "bank"];
    }

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paystackBody),
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status) {
      await adminClient
        .from("transactions")
        .update({ status: "failed" })
        .eq("reference", reference);

      return new Response(
        JSON.stringify({ error: paystackData.message || "Payment initialization failed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
