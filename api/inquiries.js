/**
 * Vercel Serverless Function: /api/inquiries
 * Handles form submissions from the contact/inquiry form
 * Stores inquiries in memory (for demo) or integrates with a database/email service
 */

export default function handler(req, res) {
  // Enable CORS for POST requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  try {
    const { name, email, phone, subject, message } = req.body

    // Basic validation
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Log inquiry (in production, send to database or email service)
    console.log('📨 New Inquiry:', { name, email, phone, subject, message, timestamp: new Date().toISOString() })

    // TODO: Integrate with email service (e.g., SendGrid, Nodemailer)
    // or database (e.g., Supabase, MongoDB Atlas)
    // Example:
    // await sendEmail({ to: 'brhygiene23@gmail.com', subject: `New ${subject} Inquiry from ${name}`, body: message })

    // For now, return success (inquiry is logged to Vercel console)
    return res.status(200).json({
      success: true,
      message: 'Inquiry received! We will respond within 24 hours.',
      inquiry_id: `INQ-${Date.now()}`,
    })
  } catch (error) {
    console.error('❌ Error processing inquiry:', error)
    return res.status(500).json({ error: 'Failed to process inquiry. Please try again or contact us directly.' })
  }
}
