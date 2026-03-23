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

    const { reference } = await req.json();

    if (!reference || typeof reference !== "string") {
      return new Response(JSON.stringify({ error: "Reference is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check transaction exists and belongs to user
    const { data: tx } = await adminClient
      .from("transactions")
      .select("*")
      .eq("reference", reference)
      .eq("user_id", user.id)
      .single();

    if (!tx) {
      return new Response(JSON.stringify({ error: "Transaction not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (tx.status === "completed") {
      return new Response(
        JSON.stringify({ status: "completed", message: "Already verified" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify with Paystack
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${paystackSecret}` },
      }
    );

    const verifyData = await verifyRes.json();

    if (verifyData.status && verifyData.data.status === "success") {
      const amountKsh = verifyData.data.amount / 100; // Convert from kobo

      // Update transaction to completed
      await adminClient
        .from("transactions")
        .update({ status: "completed", amount_ksh: amountKsh })
        .eq("reference", reference);

      // Credit user balance
      const { data: profile } = await adminClient
        .from("profiles")
        .select("balance_ksh, bonus_locked, bonus_ksh")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        let newBalance = (profile.balance_ksh || 500) + amountKsh;
        const updates: Record<string, any> = { balance_ksh: newBalance };

        // Unlock bonus if deposit >= 100 KSH
        if (profile.bonus_locked && amountKsh >= 100) {
          updates.bonus_locked = false;
          updates.balance_ksh = newBalance + (profile.bonus_ksh || 500);
        }

        await adminClient
          .from("profiles")
          .update(updates)
          .eq("user_id", user.id);
      }

      return new Response(
        JSON.stringify({ status: "completed", amount_ksh: amountKsh }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else if (verifyData.data?.status === "abandoned" || verifyData.data?.status === "failed") {
      await adminClient
        .from("transactions")
        .update({ status: "failed" })
        .eq("reference", reference);

      return new Response(
        JSON.stringify({ status: "failed", message: "Payment was not completed" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ status: tx.status, message: "Payment still pending" }),
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
