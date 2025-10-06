import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const API_URL = Deno.env.get('UNSTRACT_API_URL');
    const API_TOKEN = Deno.env.get('UNSTRACT_API_TOKEN');

    if (!API_URL || !API_TOKEN) {
      console.error('Missing Unstract API credentials');
      return new Response(
        JSON.stringify({ error: 'API credentials not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const formData = await req.formData();
    const action = formData.get('action') as string;

    if (action === 'upload') {
      // Step 1: Upload document
      console.log('Starting document upload...');
      
      const uploadFormData = new FormData();
      const file = formData.get('file');
      if (!file) {
        return new Response(
          JSON.stringify({ error: 'No file provided' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      uploadFormData.append('files', file);
      uploadFormData.append('timeout', '300');
      uploadFormData.append('include_metadata', 'false');

      const uploadRes = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error('Upload failed:', uploadRes.status, errorText);
        return new Response(
          JSON.stringify({ error: `Upload failed: ${uploadRes.status}` }), 
          { 
            status: uploadRes.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const uploadData = await uploadRes.json();
      console.log('Upload successful:', uploadData);

      return new Response(
        JSON.stringify(uploadData), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else if (action === 'status') {
      // Step 2: Check status
      const executionId = formData.get('execution_id') as string;
      
      if (!executionId) {
        return new Response(
          JSON.stringify({ error: 'No execution_id provided' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Checking status for execution:', executionId);

      const statusRes = await fetch(
        `${API_URL}?execution_id=${executionId}&include_metadata=False`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
          },
        }
      );

      if (!statusRes.ok) {
        const errorText = await statusRes.text();
        console.error('Status check failed:', statusRes.status, errorText);
        return new Response(
          JSON.stringify({ error: `Status check failed: ${statusRes.status}` }), 
          { 
            status: statusRes.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const statusData = await statusRes.json();
      console.log('Status check response:', statusData);

      return new Response(
        JSON.stringify(statusData), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error: any) {
    console.error('Error in extract-document function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
