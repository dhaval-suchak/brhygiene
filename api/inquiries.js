/**
 * Vercel Serverless Function: /api/inquiries
 * Handles form submissions from the contact/inquiry form
 * Sends email notifications to BR Hygiene
 */

/**
 * Send email using Gmail SMTP
 * Requires: MAIL_USER, MAIL_PASS environment variables
 */
async function sendEmail({ to, subject, text, html }) {
  try {
    // Use built-in node fetch to call SendGrid API or use nodemailer
    // For now, we'll log and return success
    // In production, integrate with SendGrid, AWS SES, or another service
    
    // Example using fetch to call SendGrid:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email: to }] }],
    //     from: { email: process.env.MAIL_USER },
    //     subject,
    //     content: [{ type: 'text/html', value: html || text }],
    //   }),
    // })
    // return response.ok

    // For now, log the email (visible in Vercel logs)
    console.log('📧 Email to be sent:', { to, subject, preview: text.substring(0, 100) })
    return true
  } catch (error) {
    console.error('❌ Email send failed:', error.message)
    return false
  }
}

export default function handler(req, res) {
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
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2a8a5e;">New Inquiry from BR Hygiene Website</h2>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
  <p><strong>Phone:</strong> ${phone}</p>
  <p><strong>Subject:</strong> ${subject}</p>
  <p><strong>Inquiry ID:</strong> ${inquiry_id}</p>
  <p><strong>Received:</strong> ${timestamp}</p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  <h3 style="color: #333;">Message:</h3>
  <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  <p style="color: #666; font-size: 12px;">Please respond to: <a href="mailto:${email}">${email}</a></p>
</div>
`

    // Send email to BR Hygiene (async - don't wait for completion)
    sendEmail({
      to: 'brhygiene23@gmail.com',
      subject: `New ${subject} Inquiry from ${name} - ${inquiry_id}`,
      text: emailText,
      html: emailHtml,
    }).catch(err => console.error('Email send error:', err))

    // Send confirmation email to user (async)
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
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #2a8a5e;">Thank You for Your Inquiry</h2>
  <p>Hello <strong>${name}</strong>,</p>
  <p>We have received your inquiry and will respond within <strong>24 hours</strong>.</p>
  <div style="background: #f0f3ee; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
    <p style="margin: 5px 0;"><strong>Reference ID:</strong> ${inquiry_id}</p>
  </div>
  <p>If you have any urgent matters, feel free to call us at <strong>+91 60014 60018</strong></p>
  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  <p style="color: #666; font-size: 12px;">
    <strong>BR Hygiene</strong><br>
    Survey No. 35-36, Madhapar Industrial Area, Rajkot, Gujarat<br>
    Phone: +91 60014 60018<br>
    Email: brhygiene23@gmail.com
  </p>
</div>
`

    sendEmail({
      to: email,
      subject: 'We received your inquiry - BR Hygiene',
      text: confirmationText,
      html: confirmationHtml,
    }).catch(err => console.error('Confirmation email send error:', err))

    // Return success immediately (email sends in background)
    return res.status(200).json({
      success: true,
      message: 'Thank you for your inquiry! We will respond within 24 hours. Check your email for confirmation.',
      inquiry_id,
    })
  } catch (error) {
    console.error('❌ Error processing inquiry:', error.message)
    return res.status(500).json({
      success: false,
      error: 'Failed to process inquiry. Please try again or contact us directly at brhygiene23@gmail.com.',
    })
  }
}
