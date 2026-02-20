/**
 * Vercel Serverless Function: /api/inquiries
 * Handles form submissions from the contact/inquiry form
 * Stores inquiries and notifies via email
 */

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

    // Log inquiry (visible in Vercel logs)
    console.log('📨 New Inquiry Received:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    })

    // TODO: Integrate with email service
    // Example with Nodemailer or SendGrid:
    // const transporter = nodemailer.createTransport({
    //   host: process.env.MAIL_HOST,
    //   port: 587,
    //   auth: {
    //     user: process.env.MAIL_USER,
    //     pass: process.env.MAIL_PASS,
    //   },
    // })
    // await transporter.sendMail({
    //   from: process.env.MAIL_USER,
    //   to: 'brhygiene23@gmail.com',
    //   subject: `New ${subject} Inquiry from ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    // })

    // TODO: Save to database (Supabase)
    // const { data, error } = await supabase
    //   .from('inquiries')
    //   .insert([{ name, email, phone, subject, message }])
    // if (error) throw error

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Thank you for your inquiry! We will respond within 24 hours.',
      inquiry_id: `INQ-${Date.now()}`,
    })
  } catch (error) {
    console.error('❌ Error processing inquiry:', error.message)
    return res.status(500).json({
      success: false,
      error: 'Failed to process inquiry. Please try again or contact us directly at brhygiene23@gmail.com.',
    })
  }
}
