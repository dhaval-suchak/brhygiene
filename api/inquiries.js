/**
 * Vercel Serverless Function: /api/inquiries
 * Handles form submissions from the contact/inquiry form
 * Sends email notifications to BR Hygiene using Gmail SMTP
 */

import nodemailer from 'nodemailer'

/**
 * Send email using Gmail SMTP
 * Requires: MAIL_USER, MAIL_PASS environment variables
 */
async function sendEmail({ to, subject, text, html }) {
  try {
    // Check if credentials are available
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.warn('⚠️  Email credentials not configured. Email not sent.')
      return false
    }

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // Gmail app password (not regular password)
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      html,
    })

    console.log('✅ Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
    return false
  }
}

export default async function handler(req, res) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    const { name, email, phone, subject, message } = req.body

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, phone, subject, message',
      })
    }

    const inquiry_id = `INQ-${Date.now()}`
    const timestamp = new Date().toISOString()

    // Log inquiry to console (visible in Vercel Logs)
    console.log('📨 New Inquiry Received:', {
      inquiry_id,
      name,
      email,
      phone,
      subject,
      message,
      timestamp,
      ip: req.headers['x-forwarded-for'] || 'unknown',
    })

    // Email content to send to BR Hygiene
    const emailText = `
New Inquiry from BR Hygiene Website

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Inquiry ID: ${inquiry_id}
Timestamp: ${timestamp}

Message:
${message}

---
Please respond to: ${email}
`

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f4f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#123b28 0%,#1a5c3a 100%);padding:32px 40px;">
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
                <td style="padding:16px 20px;border-bottom:1px solid #e8f0eb;width:140px;">
                  <p style="color:#888;font-size:13px;margin:0;font-weight:600;">👤 Name</p>
                </td>
                <td style="padding:16px 20px;border-bottom:1px solid #e8f0eb;">
                  <p style="color:#0d2b1e;font-size:15px;margin:0;font-weight:700;">${name}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid #e8f0eb;">
                  <p style="color:#888;font-size:13px;margin:0;font-weight:600;">📧 Email</p>
                </td>
                <td style="padding:16px 20px;border-bottom:1px solid #e8f0eb;">
                  <a href="mailto:${email}" style="color:#2a8a5e;font-size:15px;text-decoration:none;font-weight:600;">${email}</a>
                </td>
              </tr>
              <tr style="background:#f8fcfa;">
                <td style="padding:16px 20px;border-bottom:1px solid #e8f0eb;">
                  <p style="color:#888;font-size:13px;margin:0;font-weight:600;">📞 Phone</p>
                </td>
                <td style="padding:16px 20px;border-bottom:1px solid #e8f0eb;">
                  <a href="tel:${phone}" style="color:#0d2b1e;font-size:15px;text-decoration:none;font-weight:700;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;vertical-align:top;">
                  <p style="color:#888;font-size:13px;margin:0;font-weight:600;">💬 Message</p>
                </td>
                <td style="padding:16px 20px;">
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

    // Send email to BR Hygiene
    const brEmailSent = await sendEmail({
      to: 'brhygiene23@gmail.com',
      subject: `New ${subject} Inquiry from ${name} - ${inquiry_id}`,
      text: emailText,
      html: emailHtml,
    })

    // Send confirmation email to user
    const confirmationText = `
Hello ${name},

Thank you for reaching out to BR Hygiene!

We have received your inquiry and will respond within 24 hours.

Your Inquiry Details:
- Subject: ${subject}
- Reference ID: ${inquiry_id}

Best regards,
BR Hygiene Team
Rajkot, Gujarat, India
Phone: +91 60014 60018
Email: brhygiene23@gmail.com
`

    const confirmationHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f4f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#123b28 0%,#1a5c3a 100%);padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="color:#7ed6a8;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">BR Hygiene — Website</p>
                  <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">Inquiry Received</h1>
                </td>
                <td align="right">
                  <div style="background:rgba(126,214,168,0.15);border:1px solid rgba(126,214,168,0.3);border-radius:8px;padding:10px 16px;display:inline-block;">
                    <p style="color:#7ed6a8;font-size:11px;margin:0;font-weight:600;">STATUS</p>
                    <p style="color:#ffffff;font-size:14px;margin:4px 0 0;font-weight:700;">Processing</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            
            <p style="color:#333;font-size:15px;margin:0 0 24px;">Hello <strong>${name}</strong>,</p>
            <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">Thank you for reaching out to BR Hygiene. We have received your inquiry regarding <strong>${subject}</strong> and our team will get back to you within 24 hours.</p>
            
            <!-- Details Box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fcfa;border:1px solid #e8f0eb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 20px;">
                   <p style="color:#888;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">Reference ID</p>
                   <p style="color:#0d2b1e;font-size:16px;margin:0;font-weight:700;">${inquiry_id}</p>
                </td>
              </tr>
            </table>

            <p style="color:#555;font-size:14px;line-height:1.6;margin:0;">If you have any urgent matters, feel free to call us at <a href="tel:+916001460018" style="color:#2a8a5e;text-decoration:none;font-weight:600;">+91 60014 60018</a>.</p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fcfa;padding:20px 40px;border-top:1px solid #e8f0eb;">
            <p style="color:#aaa;font-size:12px;margin:0;line-height:1.6;">
              <strong>BR Hygiene</strong><br/>
              Survey No. 35-36, Madhapar Industrial Area, Rajkot<br/>
              <a href="mailto:brhygiene23@gmail.com" style="color:#888;text-decoration:none;">brhygiene23@gmail.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`

    const userEmailSent = await sendEmail({
      to: email,
      subject: 'We received your inquiry - BR Hygiene',
      text: confirmationText,
      html: confirmationHtml,
    })

    // Return success
    return res.status(200).json({
      success: true,
      message: 'Thank you for your inquiry! We will respond within 24 hours. Check your email for confirmation.',
      inquiry_id,
      emails_sent: {
        to_br_hygiene: brEmailSent,
        to_user: userEmailSent,
      },
    })
  } catch (error) {
    console.error('❌ Error processing inquiry:', error.message)
    return res.status(500).json({
      success: false,
      error: 'Failed to process inquiry. Please try again or contact us directly at brhygiene23@gmail.com.',
    })
  }
}
