const express = require('express');
const cors = require('cors');
const supabase = require('./db');       // ← Supabase client
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ── Email Transporter ─────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER || 'brhygiene23@gmail.com',
    pass: process.env.MAIL_PASS
  }
});

/* ── GET /api/products ─────────────────────── */
app.get('/api/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Supabase products error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
  res.json(data);
});

/* ── POST /api/inquiries ───────────────────── */
app.post('/api/inquiries', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'Name, email and phone are required.' });
  }

  // Save to Supabase
  const { error: dbError } = await supabase
    .from('inquiries')
    .insert({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message: message || ''
    });

  if (dbError) {
    console.error('Supabase insert error:', dbError.message);
    return res.status(500).json({ error: 'Failed to save inquiry' });
  }

  // Send notification email to BR Hygiene only (no customer auto-reply to avoid bounces)
  const mailToAdmin = {
    from: `"BR Hygiene Inquiries" <${process.env.MAIL_USER}>`,
    to: 'brhygiene23@gmail.com',
    replyTo: email,
    subject: `🔔 New Inquiry: ${subject || 'General'} — ${name}`,
    html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="margin:0;padding:0;background:#f0f4f0;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;padding:30px 0;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#0d2b1e 0%,#1a5c3a 100%);padding:32px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="color:#7ed6a8;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">BR Hygiene — Website</p>
                          <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">New Inquiry Received</h1>
                        </td>
                        <td align="right">
                          <div style="background:rgba(126,214,168,0.15);border:1px solid rgba(126,214,168,0.3);border-radius:8px;padding:10px 16px;display:inline-block;">
                            <p style="color:#7ed6a8;font-size:11px;margin:0;font-weight:600;">TYPE</p>
                            <p style="color:#ffffff;font-size:14px;margin:4px 0 0;font-weight:700;">${subject || 'General Inquiry'}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px;">
                    
                    <!-- Contact Details -->
                    <p style="color:#888;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 16px;">Contact Details</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8f0eb;border-radius:10px;overflow:hidden;">
                      <tr style="background:#f8fcfa;">
                        <td style="padding:14px 20px;border-bottom:1px solid #e8f0eb;width:140px;">
                          <p style="color:#888;font-size:12px;margin:0;font-weight:600;">👤 Name</p>
                        </td>
                        <td style="padding:14px 20px;border-bottom:1px solid #e8f0eb;">
                          <p style="color:#0d2b1e;font-size:15px;margin:0;font-weight:700;">${name}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 20px;border-bottom:1px solid #e8f0eb;">
                          <p style="color:#888;font-size:12px;margin:0;font-weight:600;">📧 Email</p>
                        </td>
                        <td style="padding:14px 20px;border-bottom:1px solid #e8f0eb;">
                          <a href="mailto:${email}" style="color:#2a8a5e;font-size:14px;text-decoration:none;font-weight:600;">${email}</a>
                        </td>
                      </tr>
                      <tr style="background:#f8fcfa;">
                        <td style="padding:14px 20px;border-bottom:1px solid #e8f0eb;">
                          <p style="color:#888;font-size:12px;margin:0;font-weight:600;">📞 Phone</p>
                        </td>
                        <td style="padding:14px 20px;border-bottom:1px solid #e8f0eb;">
                          <a href="tel:${phone}" style="color:#0d2b1e;font-size:14px;text-decoration:none;font-weight:700;">${phone}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:14px 20px;vertical-align:top;">
                          <p style="color:#888;font-size:12px;margin:0;font-weight:600;">💬 Message</p>
                        </td>
                        <td style="padding:14px 20px;">
                          <p style="color:#333;font-size:14px;margin:0;line-height:1.6;">${message || '—'}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                      <tr>
                        <td>
                          <a href="mailto:${email}?subject=Re: Your Inquiry — BR Hygiene" 
                             style="display:inline-block;background:#2a8a5e;color:#ffffff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;">
                            ↩ Reply to ${name}
                          </a>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f8fcfa;padding:20px 40px;border-top:1px solid #e8f0eb;">
                    <p style="color:#aaa;font-size:12px;margin:0;">
                      Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' })} IST &nbsp;·&nbsp; BR Hygiene Website Inquiry Form
                    </p>
                  </td>
                </tr>

              </table>
            </td></tr>
          </table>
        </body>
        </html>
        `
  };

  try {
    await transporter.sendMail(mailToAdmin);
    console.log(`✅ Inquiry email sent for ${name} (${email})`);
  } catch (mailErr) {
    console.error('Email sending failed (inquiry saved to Supabase):', mailErr.message);
  }

  res.json({ success: true, message: 'Inquiry submitted successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ BR Hygiene server running on port ${PORT} (Supabase)`);
});
