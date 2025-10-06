import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function base64ToUint8Array(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  } catch (e) {
    throw new Error("Invalid base64 input");
  }
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const API_URL = Deno.env.get("UNSTRACT_API_URL");
    const API_TOKEN = Deno.env.get("UNSTRACT_API_TOKEN");

    if (!API_URL || !API_TOKEN) {
      console.error("Missing Unstract API credentials");
      return new Response(
        JSON.stringify({ error: "API credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const contentType = req.headers.get("content-type") || "";
    let action = "";

    // Accept both JSON and multipart/form-data
    if (contentType.includes("application/json")) {
      const body = await req.json();
      action = body.action;

      if (action === "upload") {
        const fileName = body.file_name as string | undefined;
        const fileBase64 = body.file_base64 as string | undefined;
        if (!fileName || !fileBase64) {
          return new Response(
            JSON.stringify({ error: "Missing file_name or file_base64" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const fileBytes = base64ToUint8Array(fileBase64);
        const blob = new Blob([fileBytes], { type: "application/octet-stream" });

        const form = new FormData();
        form.append("files", new File([blob], fileName));
        form.append("timeout", "300");
        form.append("include_metadata", "false");

        console.log("Uploading to Unstract API:", API_URL);
        const uploadRes = await fetch(API_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${API_TOKEN}` },
          body: form,
        });

        const text = await uploadRes.text();
        console.log("Unstract upload response status:", uploadRes.status);
        console.log("Unstract upload response body:", text);
        
        if (!uploadRes.ok) {
          console.error("Upload failed:", uploadRes.status, text);
          return new Response(JSON.stringify({ error: "Upload failed", details: text }), {
            status: uploadRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Parse and validate the response
        let responseData;
        try {
          responseData = JSON.parse(text);
          console.log("Parsed response data:", responseData);
        } catch (e) {
          console.error("Failed to parse response as JSON:", text);
          return new Response(JSON.stringify({ error: "Invalid response from API", details: text }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Normalize: extract top-level execution_id
        const executionId = responseData?.message?.result?.[0]?.metadata?.execution_id ??
          (typeof responseData?.message?.status_api === "string"
            ? (responseData.message.status_api.match(/execution_id=([^&]+)/)?.[1] || null)
            : null);
        if (!executionId) {
          console.error("execution_id not found in upload response:", responseData);
        }

        return new Response(JSON.stringify({ execution_id: executionId, raw: responseData }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      if (action === "status") {
        const executionId = body.execution_id as string | undefined;
        if (!executionId) {
          return new Response(
            JSON.stringify({ error: "No execution_id provided" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        console.log("Checking status for execution_id:", executionId);
        const statusRes = await fetch(`${API_URL}?execution_id=${executionId}&include_metadata=False`, {
          method: "GET",
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });

        const text = await statusRes.text();
        console.log("Status check response:", statusRes.status, text);
        
        if (!statusRes.ok) {
          console.error("Status check failed:", statusRes.status, text);
          return new Response(JSON.stringify({ error: "Status check failed", details: text }), {
            status: statusRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Parse and return the status
        let statusData;
        try {
          statusData = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse status response:", text);
          return new Response(JSON.stringify({ error: "Invalid status response", details: text }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Normalize shape for client
        const normalized = {
          status: statusData?.status ?? statusData?.message?.execution_status ?? null,
          result: statusData?.result ?? statusData?.message?.result ?? null,
          data: (statusData?.result ?? statusData?.message?.result)?.[0]?.result?.output ?? null,
          raw: statusData,
        };

        return new Response(JSON.stringify(normalized), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Legacy support: multipart/form-data from browser
      const formData = await req.formData();
      action = (formData.get("action") as string) || "upload";

      if (action === "upload") {
        const file = formData.get("file") as File | null;
        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const uploadFormData = new FormData();
        uploadFormData.append("files", file);
        uploadFormData.append("timeout", "300");
        uploadFormData.append("include_metadata", "false");

        const uploadRes = await fetch(API_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${API_TOKEN}` },
          body: uploadFormData,
        });

        const text = await uploadRes.text();
        if (!uploadRes.ok) {
          console.error("Upload failed:", uploadRes.status, text);
          return new Response(text || JSON.stringify({ error: "Upload failed" }), {
            status: uploadRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(text, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      if (action === "status") {
        const executionId = formData.get("execution_id") as string | null;
        if (!executionId) {
          return new Response(
            JSON.stringify({ error: "No execution_id provided" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const statusRes = await fetch(`${API_URL}?execution_id=${executionId}&include_metadata=False`, {
          method: "GET",
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });

        const text = await statusRes.text();
        if (!statusRes.ok) {
          console.error("Status check failed:", statusRes.status, text);
          return new Response(text || JSON.stringify({ error: "Status check failed" }), {
            status: statusRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(text, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("Error in extract-document function:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
