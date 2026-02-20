/**
 * Vercel Serverless Function: /api/products
 * Returns the list of BR Hygiene products
 */

// Fallback products data
const PRODUCTS = [
  {
    id: 1,
    name: 'Aloe Vera & Cucumber Wipe',
    description: 'Infused with aloe vera and cooling cucumber for deep hydration and gentle skin care.',
    features: JSON.stringify(['Alcohol Free', 'Skin Friendly', 'Moisturizing']),
    usage_text: 'Ideal for face, neck, and hands for a gentle cleanse anytime.',
    image_path: '/images/alovera mockup.jpeg',
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Lemon Wipe',
    description: 'Zesty lemon scent delivers an instant burst of energy while effectively cleansing skin.',
    features: JSON.stringify(['Citrus Freshness', 'pH Balanced', 'Individually Sealed']),
    usage_text: 'Perfect for post-meal cleanup or quick refreshment during travel.',
    image_path: '/images/lemon mockup.jpeg',
    badge: 'Popular'
  },
  {
    id: 3,
    name: 'Custom Formulation',
    description: 'Tailored wipes designed to meet your specific requirements and branding needs.',
    features: JSON.stringify(['White Label', 'Custom Scent', 'Private Label']),
    usage_text: 'Ideal for corporate gifts, hospitality, and bulk distribution.',
    image_path: '/images/oem.jpeg',
    badge: 'OEM Available'
  }
]

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only accept GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  try {
    // Return products
    console.log('📦 Products requested')
    return res.status(200).json(PRODUCTS)
  } catch (error) {
    console.error('❌ Error fetching products:', error.message)
    return res.status(500).json({
      error: 'Failed to fetch products. Please try again later.',
    })
  }
}
