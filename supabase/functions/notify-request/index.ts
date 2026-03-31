import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const TO_EMAIL = 'executive@avocore.com';
const FROM_EMAIL = 'SellerActions <notifications@selleractions.com>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, title, description, email, platform, request_id, author, comment, vote_title } = await req.json();

    let subject = '';
    let html = '';

    if (type === 'feature_request') {
      subject = `🆕 New Feature Request: ${title}`;
      html = `
        <h2 style="color:#00c2d1;">New Feature Request Submitted</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:8px;color:#666;width:120px;"><b>Tool Name</b></td><td style="padding:8px;">${title}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;"><b>Description</b></td><td style="padding:8px;">${description}</td></tr>
          <tr><td style="padding:8px;color:#666;"><b>Platform</b></td><td style="padding:8px;">${platform || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;"><b>Email</b></td><td style="padding:8px;">${email || '—'}</td></tr>
          <tr><td style="padding:8px;color:#666;"><b>Status</b></td><td style="padding:8px;"><span style="background:#fef3c7;color:#d97706;padding:2px 8px;border-radius:4px;font-size:12px;">Pending Review</span></td></tr>
        </table>
        <p style="margin-top:16px;font-size:13px;color:#999;">
          Review in Supabase: <a href="https://supabase.com/dashboard/project/ccbcmxgdzxzgqkszcddk/editor">Open Dashboard</a>
        </p>
      `;
    } else if (type === 'vote') {
      subject = `👍 New Vote: ${vote_title}`;
      html = `
        <h2 style="color:#00c2d1;">Someone Voted on a Feature Request</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:8px;color:#666;width:120px;"><b>Request</b></td><td style="padding:8px;">${vote_title}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;"><b>Email</b></td><td style="padding:8px;">${email || '—'}</td></tr>
        </table>
      `;
    } else if (type === 'comment') {
      subject = `💬 New Comment on: ${vote_title || request_id}`;
      html = `
        <h2 style="color:#00c2d1;">New Comment on a Feature Request</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
          <tr><td style="padding:8px;color:#666;width:120px;"><b>Request</b></td><td style="padding:8px;">${vote_title || request_id}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;"><b>Author</b></td><td style="padding:8px;">${author || 'Anonymous'}</td></tr>
          <tr><td style="padding:8px;color:#666;"><b>Email</b></td><td style="padding:8px;">${email || '—'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;color:#666;"><b>Comment</b></td><td style="padding:8px;">${comment}</td></tr>
        </table>
      `;
    } else {
      return new Response(JSON.stringify({ error: 'Unknown type' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject,
        html,
        reply_to: email || undefined,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend error:', data);
      return new Response(JSON.stringify({ error: data }), {
        status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (e) {
    console.error('Edge function error:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
