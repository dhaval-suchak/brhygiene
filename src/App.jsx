import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion'
import {
  Package, FlaskConical, ShieldCheck, MapPin, Phone, Mail,
  Globe, Users, MessageCircle, Factory, Leaf,
  CheckCircle2, ChevronRight, Award, Clock, Settings2,
  X, ZoomIn, ChevronLeft, BadgeCheck, Microscope, Zap, Star
} from 'lucide-react'
import './index.css'

/* ─── Animation helpers ──────────────────────────── */
const easeExpo = [0.16, 1, 0.3, 1]
const easeSoft = [0.25, 0.46, 0.45, 0.94]

// Fade + slide up reveal on scroll
function Reveal({ children, className, delay = 0, y = 36, x = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: easeExpo }}
    >
      {children}
    </motion.div>
  )
}

// Scale + fade reveal (for cards and images)
function RevealScale({ children, className, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.7, delay, ease: easeExpo }}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for cascading children
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } }
}
const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeExpo } }
}

/* ─── Wave divider ───────────────────────────────── */
function Wave({ fill, topFill }) {
  return (
    <div style={{ background: topFill || 'transparent', lineHeight: 0, overflow: 'hidden' }}>
      <svg viewBox="0 0 1440 70" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 70 }}>
        <path fill={fill} d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" />
      </svg>
    </div>
  )
}

/* ─── Product Modal ──────────────────────────────── */
function ProductModal({ product, onClose }) {
  const featureList = typeof product.features === 'string'
    ? JSON.parse(product.features) : product.features

  return (
    <motion.div className="modal-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div className="modal-card"
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <div className="modal-image-wrap">
          <motion.img
            src={product.image_path}
            alt={product.name}
            className="modal-image"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: easeExpo }}
          />

        </div>
        <div className="modal-body">
          <h3 className="modal-title">{product.name}</h3>
          <p className="modal-desc">{product.description}</p>
          {featureList && (
            <div className="product-card__tags" style={{ marginBottom: '1rem' }}>
              {featureList.map((f, i) => <span key={i} className="product-card__tag">{f}</span>)}
            </div>
          )}
          <div className="modal-usage">
            <strong>Best for:</strong> {product.usage_text}
          </div>
          <a href="#contact" className="btn btn-primary" style={{ marginTop: '1.4rem', display: 'inline-flex' }} onClick={onClose}>
            Enquire About This Product <ChevronRight size={16} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Product Card ───────────────────────────────── */
function ProductCard({ product, index, onClick }) {
  return (
    <RevealScale delay={index * 0.12}>
      <motion.div
        className="product-card"
        onClick={() => onClick(product)}
        whileHover={{ y: -8, boxShadow: '0 24px 48px rgba(0,0,0,0.13)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      >
        <div className="product-card__image-wrap">
          <img className="product-card__img" src={product.image_path} alt={product.name}
            loading="lazy" width="400" height="300" />
          {product.badge && <span className="product-card__badge">{product.badge}</span>}
          <div className="product-card__zoom-hint">
            <ZoomIn size={18} />
            <span>View Details</span>
          </div>
        </div>
        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__desc">{product.description}</p>
          <div className="product-card__tags">
            {(typeof product.features === 'string' ? JSON.parse(product.features) : product.features || [])
              .map((f, i) => <span key={i} className="product-card__tag">{f}</span>)}
          </div>
        </div>
      </motion.div>
    </RevealScale>
  )
}

/* ─── Clients Slider ─────────────────────────────── */
const CLIENTS = [
  {
    name: 'The Leela Ambiance',
    city: 'Gurugram',
    category: 'Luxury Hospitality',
    logo: '/images/client-leela.jpg',
    accent: '#8B6914',
    bg: '#FAFAFA',
  },
  {
    name: 'The Grand Thakar',
    city: 'Rajkot',
    category: 'Premium Hotel',
    logo: '/images/client-grandthakar.png',
    accent: '#1a3a5c',
    bg: '#EEF4FA',
  },
  {
    name: 'Pathikashram',
    city: 'Gujarat',
    category: 'Hospitality',
    logo: '/images/client-pathikashram.jpg',
    accent: '#2a6b3c',
    bg: '#EEF7F1',
  },
  {
    name: 'Celebration',
    city: 'Rajkot',
    category: 'Events & Banquet',
    logo: '/images/client-celebration.png',
    accent: '#8B1A4A',
    bg: '#FDF0F6',
  },
  {
    name: 'Horn OK Please',
    city: 'Rajkot',
    category: 'Restaurant',
    logo: '/images/client-hornokplease.jpg',
    accent: '#B85C00',
    bg: '#FDF4ED',
  },
  {
    name: 'Thali & More',
    city: 'Jaipur',
    category: 'Restaurant Chain',
    logo: '/images/client-thaliandmore.png',
    accent: '#4a8c2a',
    bg: '#F2FAF0',
  },
]

function ClientCard({ client }) {
  return (
    <div className="client-logo-cell" style={{ background: client.bg, border: `1px solid ${client.accent}22` }}>
      {client.logo ? (
        <>
          <img
            src={client.logo}
            alt={client.name}
            className="client-logo-img"
            onError={e => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextSibling.style.display = 'flex'
            }}
          />
          <div className="client-text-fallback" style={{ display: 'none', flexDirection: 'column', alignItems: 'center' }}>
            <span className="client-logo-name" style={{ color: client.accent }}>{client.name}</span>
            <span className="client-logo-city">{client.city}</span>
          </div>
        </>
      ) : (
        <div className="client-text-card">
          <span className="client-logo-name" style={{ color: client.accent }}>{client.name}</span>
          <span className="client-logo-city">{client.city}</span>
          <span className="client-logo-category" style={{ color: client.accent }}>{client.category}</span>
        </div>
      )}
    </div>
  )
}

function ClientsSlider() {
  const [paused, setPaused] = useState(false)
  const items = [...CLIENTS, ...CLIENTS, ...CLIENTS]
  return (
    <div className="clients-track-wrap"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="clients-track"
        animate={{ x: paused ? undefined : ['0%', '-33.33%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {items.map((c, i) => (
          <ClientCard key={i} client={c} />
        ))}
      </motion.div>
    </div>
  )
}

/* ═══════════════ MAIN APP ════════════════════════ */
export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeProduct, setActiveProduct] = useState(null)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [legalModal, setLegalModal] = useState(null) // 'privacy' | 'sitemap' | null

  const { scrollYProgress } = useScroll()
  const heroParallax = useTransform(scrollYProgress, [0, 0.35], [0, -70])

  // API base URL: use env var if set, or '' for relative paths on Vercel
  // Development: set VITE_API_BASE_URL=http://localhost:5000
  // Production (Vercel): leave unset or set to '' for relative paths (/api/xyz)
  const API_BASE = import.meta.env.VITE_API_BASE_URL !== undefined ? import.meta.env.VITE_API_BASE_URL : (import.meta.env.DEV ? 'http://localhost:5000' : '')

  /* Fetch products */
  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(d => { setProducts(d); setLoading(false) })
      .catch(() => { setProducts(FALLBACK); setLoading(false) })
  }, [API_BASE])

  /* Header scroll */
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* Lock body when menu/modal open */
  useEffect(() => {
    document.body.style.overflow = (menuOpen || activeProduct) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, activeProduct])

  /* Form submit with full validation */
  async function handleSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target))
    const errors = {}

    // Name: letters, spaces, dots only, min 2 chars
    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Please enter your full name (min 2 characters).'
    } else if (!/^[a-zA-Z\s.'-]+$/.test(data.name.trim())) {
      errors.name = 'Name must contain only letters, spaces, or hyphens.'
    }

    // Phone: strip spaces/dashes, must be exactly 10 digits (Indian mobile), optionally prefixed with +91
    const rawPhone = data.phone ? data.phone.replace(/[\s\-().+]/g, '') : ''
    const phone10 = rawPhone.startsWith('91') && rawPhone.length === 12 ? rawPhone.slice(2) : rawPhone
    if (!phone10 || !/^[6-9]\d{9}$/.test(phone10)) {
      errors.phone = 'Enter a valid 10-digit Indian mobile number.'
    }

    // Email: standard regex
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) {
      errors.email = 'Enter a valid email address (e.g. you@company.com).'
    }

    // Inquiry type required
    if (!data.subject) {
      errors.subject = 'Please select an inquiry type.'
    }

    // Message: min 10 characters
    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters.'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setFormErrors({})

    // Normalize phone to +91XXXXXXXXXX
    const normalized = { ...data, phone: `+91 ${phone10.slice(0, 5)} ${phone10.slice(5)}` }
    setSubmitStatus('loading')
    try {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      })
      if (!res.ok) throw new Error()
      setSubmitStatus('success')
      e.target.reset()
    } catch {
      setSubmitStatus('error')
    } finally {
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  return (
    <div className="app">
      {/* Scroll progress */}
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />

      {/* WhatsApp */}
      <motion.a href="https://wa.me/916001460018" target="_blank" rel="noopener noreferrer"
        className="whatsapp-float"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 1.8, type: 'spring', stiffness: 220 }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </motion.a>

      {/* Product modal */}
      <AnimatePresence>
        {activeProduct && (
          <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
        )}
      </AnimatePresence>

      {/* ══════════ HEADER ══════════ */}
      <motion.header className={`header ${scrolled ? 'header--scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: easeExpo }}
      >
        <div className="header__inner">
          <a href="#home" className="logo" onClick={() => setMenuOpen(false)}>
            <img src="/images/logo.png" alt="BR Hygiene - NaturoWipe" className="logo__img" />
          </a>
          <nav className="nav">
            {[['#home', 'Home'], ['#about', 'About'], ['#oem', 'OEM'], ['#products', 'Products'], ['#clients', 'Clients']].map(([h, l]) => (
              <a key={h} href={h} className="nav__link">{l}</a>
            ))}
            <a href="#contact" className="nav__cta">Get a Quote</a>
          </nav>
          <button className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(m => !m)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav className="nav--mobile open"
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            >
              {[['#home', 'Home'], ['#about', 'About'], ['#oem', 'OEM'], ['#products', 'Products'], ['#clients', 'Clients']].map(([h, l]) => (
                <a key={h} href={h} className="nav__link" onClick={(e) => {
                  e.preventDefault();
                  document.body.style.overflow = ''; // Unlock body scroll immediately
                  setMenuOpen(false);
                  setTimeout(() => {
                    const target = document.querySelector(h);
                    if (target) {
                      const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 90;
                      const elementPosition = target.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }, 50);
                }}>{l}</a>
              ))}
              <a href="#contact" className="nav__cta" onClick={(e) => {
                e.preventDefault();
                document.body.style.overflow = ''; // Unlock body scroll immediately
                setMenuOpen(false);
                setTimeout(() => {
                  const target = document.querySelector('#contact');
                  if (target) {
                    const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 90;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }, 50);
              }}>Get a Quote</a>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ══════════ HERO ══════════ */}
      <section id="home" className="hero">
        <div className="hero__content">
          <motion.p className="hero__eyebrow"
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: easeExpo }}
          >
            India's Trusted Wet Wipe Manufacturer
          </motion.p>
          <motion.h1 className="hero__title"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: easeExpo }}
          >
            Where <em>Purity</em> Meets<br />
            Precision Manufacturing.
          </motion.h1>
          <motion.p className="hero__body"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: easeExpo }}
          >
            BR Hygiene crafts single-use premium wet wipes from a GMP-compliant facility in Rajkot, Gujarat — skin-safe formulations, tested to global hygiene standards, delivered to brands, distributors &amp; corporate clients across India.
          </motion.p>
          <motion.div className="hero__actions"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75, ease: easeExpo }}
          >
            <motion.a href="#products" className="btn btn-primary"
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >Explore Products <ChevronRight size={16} /></motion.a>
            <motion.a href="#contact" className="btn btn-outline"
              whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >Request a Sample</motion.a>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div className="hero__visual"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        >
          <div className="hero__visual-bg" />
          <motion.img
            className="hero__visual-image"
            src="/images/hero-bg.jpg"
            alt="Premium wet wipes - NaturoWipe hygiene products"
            style={{ y: heroParallax }}
          />
          <div className="hero__visual-overlay" />
        </motion.div>
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <Wave fill="var(--sage-light)" topFill="var(--cream)" />
      <section id="about" className="about section">
        <div className="container">
          <div className="about__grid">
            <Reveal y={50}>
              <div className="about__visual">
                <img
                  className="about__img-main"
                  src="/images/about-manufacturing.jpg"
                  alt="BR Hygiene manufacturing facility - production line"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <div>
              <Reveal delay={0.1}>
                <p className="label">Who We Are</p>
                <h2 className="section-title">Our <em>Story</em></h2>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="section-body" style={{ marginBottom: '1rem' }}>
                  BR Hygiene is a trusted manufacturer dedicated to delivering quality-driven hygiene solutions with consistency, safety, and care. We specialize in producing premium single-use wet wipes designed to meet modern hygiene standards.
                </p>
                <p className="section-body" style={{ marginBottom: '1rem' }}>
                  Our production facility is equipped with advanced machinery and controlled processes to ensure reliable manufacturing at scale. From sourcing certified raw materials to final packaging, every stage undergoes strict quality checks to maintain safety, formulation stability, and product performance.
                </p>
                <p className="section-body" style={{ marginBottom: '2rem' }}>
                  We focus on skin-friendly formulations, hygienic production practices, and timely delivery to support distributors, private-label brands, and corporate clients. At BR Hygiene, quality and customer trust remain at the core of everything we manufacture.
                </p>
              </Reveal>
              <Reveal delay={0.28}>
                <motion.div className="about__checks"
                  variants={staggerContainer} initial="hidden" whileInView="show"
                  viewport={{ once: true, margin: '-60px' }}
                >
                  {[
                    'Advanced Automated Machinery',
                    'Certified Raw Material Sourcing',
                    'Strict Multi-Stage Quality Checks',
                    'Skin-Friendly Formulations',
                    'Hygienic Controlled Production',
                    'Timely Delivery Guaranteed',
                  ].map((item, i) => (
                    <motion.div key={i} className="about__check" variants={staggerItem}>
                      <div className="about__check-icon"><CheckCircle2 size={12} color="var(--brand)" /></div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </Reveal>
              <Reveal delay={0.36}>
                <a href="#contact" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                  Partner With Us
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ OEM ══════════ */}
      <Wave fill="var(--navy)" topFill="var(--sage-light)" />
      <section id="oem" className="oem section">
        <div className="oem__bg-circle" />
        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
            <Reveal delay={0.05}>
              <p className="label">For Brands</p>
              <h2 className="section-title">OEM &amp; <em>Private Labelling</em></h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="section-body" style={{ marginBottom: '1rem' }}>
                BR Hygiene provides OEM and Private Labelling services for businesses looking to launch premium-quality wet wipes under their own brand name. We support startups, distributors, hospitality businesses, and corporate clients with customized hygiene products manufactured under strict quality standards.
              </p>
              <p className="section-body" style={{ marginBottom: '2rem' }}>
                From formulation to final packaging, we ensure consistent quality, safety, and market-ready solutions tailored to your business needs.
              </p>
            </Reveal>
            <motion.div className="oem__features oem__features--centered"
              variants={staggerContainer} initial="hidden" whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              {[
                { icon: <Settings2 size={20} />, title: 'Private Label Manufacturing', text: 'Launch your own branded wet wipes with our end-to-end OEM manufacturing.' },
                { icon: <FlaskConical size={20} />, title: 'Custom Formulation Support', text: 'Aloe, antibacterial, refreshing, moisturizing — we tailor every blend to your specifications.' },
                { icon: <Leaf size={20} />, title: 'Non-Woven Fabric Selection', text: 'We help you choose the right substrate material — softness, strength, and sustainability.' },
                { icon: <Package size={20} />, title: 'Custom Wipe Sizes', text: 'Standard: 170×200 mm, 150×200 mm. Custom dimensions available on request.' },
                { icon: <ShieldCheck size={20} />, title: 'Quality-Controlled Production', text: 'GMP-compliant processes with documented quality audits at every stage.' },
                { icon: <Award size={20} />, title: 'Market-Ready Solutions', text: 'Packaging, compliance, and documentation ready for domestic and export markets.' },
              ].map((f, i) => (
                <motion.div key={i} className="oem__feature" variants={staggerItem}
                  whileHover={{ x: 6, transition: { type: 'spring', stiffness: 400 } }}
                >
                  <div className="oem__feature-icon">{f.icon}</div>
                  <div>
                    <div className="oem__feature-title">{f.title}</div>
                    <div className="oem__feature-text">{f.text}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <Reveal delay={0.6}>
              <a href="#contact" className="btn btn-primary" style={{ marginTop: '2.5rem', display: 'inline-flex' }}>
                Start Your Partnership
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ PRODUCTS ══════════ */}
      <Wave fill="var(--cream-mid)" topFill="var(--navy)" />
      <section id="products" className="products section">
        <div className="container">
          <Reveal>
            <div className="products__header">
              <p className="label" style={{ justifyContent: 'center' }}>Our Catalog</p>
              <h2 className="section-title" style={{ textAlign: 'center' }}>
                Select Your <em>Freshness</em>
              </h2>
              <p className="section-body" style={{ margin: '0 auto', textAlign: 'center', maxWidth: '52ch' }}>
                Click on any product to explore ingredients, features, and order details.
              </p>
            </div>
          </Reveal>

          {loading ? (
            <div className="products__grid">
              {[1, 2].map(i => <div key={i} className="product-card skeleton-card"><div className="skeleton" style={{ height: 280 }} /></div>)}
            </div>
          ) : (
            <div className="products__grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onClick={setActiveProduct} />
              ))}

              {/* Coming Soon Card */}
              <Reveal delay={products.length * 0.1}>
                <div className="product-card product-card--coming-soon">
                  <div className="product-card__image-wrap coming-soon-visual">
                    <div className="coming-soon-inner">
                      <Zap size={40} strokeWidth={1.5} color="var(--brand)" />
                      <span>More Variants</span>
                      <span className="coming-soon-badge">Coming Soon</span>
                    </div>
                  </div>
                  <div className="product-card__body">
                    <h3 className="product-card__name">New Products Incoming</h3>
                    <p className="product-card__desc">We're constantly innovating — antibacterial, baby care, and travel-sized wipes are in development.</p>
                    <a href="#contact" className="btn btn-primary" style={{ marginTop: '1.2rem', display: 'inline-flex', fontSize: '0.88rem', padding: '0.7rem 1.5rem' }}>
                      Enquire About Custom Variants
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* ══════════ CLIENTS ══════════ */}
      <Wave fill="var(--sage-light)" topFill="var(--cream-mid)" />
      <section id="clients" className="clients section">
        <div className="container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <p className="label" style={{ justifyContent: 'center' }}>Trusted By</p>
              <h2 className="section-title">Our Valued <em>Clients</em></h2>
              <p className="section-body" style={{ margin: '0 auto', textAlign: 'center', maxWidth: '50ch' }}>
                From premium hospitality groups to national transport authorities — leading organizations rely on BR Hygiene for their hygiene needs.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="clients-scroller">
              <ClientsSlider />
            </div>
          </Reveal>


        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <Wave fill="var(--cream-mid)" topFill="var(--sage-light)" />
      <section id="contact" className="contact section">
        <div className="container">
          <div className="contact__grid">
            <div>
              <Reveal>
                <p className="label">Get In Touch</p>
                <h2 className="section-title">
                  Let's Build Your<br /><em>Hygiene Brand.</em>
                </h2>
                <p className="section-body">
                  Whether you're launching a private label, sourcing bulk hygiene products, or need custom formulations — our team is ready to help.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="contact__details">
                  {[
                    { icon: <MapPin size={18} />, label: 'Address', value: 'Survey No. 35-36, Madhapar Industrial Area, Opp. Madhapar Society, B/h Om Steel, Jamnagar Road, Rajkot, Gujarat, India.' },
                    { icon: <Phone size={18} />, label: 'Phone', value: '+91 60014 60018' },
                    { icon: <Mail size={18} />, label: 'Email', value: 'brhygiene23@gmail.com' },
                  ].map((item, i) => (
                    <div key={i} className="contact__item">
                      <div className="contact__item-icon">{item.icon}</div>
                      <div>
                        <div className="contact__item-label">{item.label}</div>
                        <div className="contact__item-value">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <div className="inquiry-form">
                <h3 className="inquiry-form__title">Send an Inquiry</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b8070', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                  We respond within 1–2 business days. You'll also receive a confirmation email.
                </p>
                <form className="form-grid" onSubmit={handleSubmit} noValidate>
                  <div className="form-field">
                    <label htmlFor="name">Full Name *</label>
                    <input id="name" name="name" type="text" placeholder="Your Name"
                      className={formErrors.name ? 'input-error' : ''} />
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone">Phone Number *</label>
                    <input id="phone" name="phone" type="tel" placeholder="9876543210" maxLength={13}
                      className={formErrors.phone ? 'input-error' : ''} />
                    {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" name="email" type="email" placeholder="you@company.com"
                      className={formErrors.email ? 'input-error' : ''} />
                    {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                  </div>
                  <div className="form-field">
                    <label htmlFor="subject">Inquiry Type *</label>
                    <select id="subject" name="subject"
                      className={formErrors.subject ? 'input-error' : ''}>
                      <option value="">Select…</option>
                      <option value="OEM / Private Label">OEM / Private Label</option>
                      <option value="Bulk Order">Bulk Order</option>
                      <option value="Sample Request">Sample Request</option>
                      <option value="Custom Formulation">Custom Formulation</option>
                      <option value="Pricing Inquiry">Pricing Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.subject && <span className="field-error">{formErrors.subject}</span>}
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="message">Message *</label>
                    <textarea id="message" name="message"
                      placeholder="Describe your requirements — product type, expected quantity, branding needs… (min 10 characters)"
                      className={formErrors.message ? 'input-error' : ''} />
                    {formErrors.message && <span className="field-error">{formErrors.message}</span>}
                  </div>
                  <div className="form-field--full">
                    <button type="submit" className="form-submit"
                      disabled={submitStatus === 'loading'}>
                      {submitStatus === 'loading' ? 'Sending…'
                        : submitStatus === 'success' ? '✓ Inquiry Sent Successfully!'
                          : 'Send Inquiry'}
                    </button>
                    {submitStatus === 'error' && (
                      <p style={{ color: '#c0392b', fontSize: '0.85rem', marginTop: '0.6rem' }}>
                        Something went wrong. Please email us at brhygiene23@gmail.com
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <Wave fill="var(--navy)" topFill="var(--cream-mid)" />
      <footer className="footer">
        <div className="container">
          <div className="footer__main">
            <div className="footer__brand">
              <div className="logo">
                <img src="/images/logo.png" alt="BR Hygiene" className="logo__img"
                  style={{ opacity: 0.9, height: 54, filter: 'brightness(0) invert(1)' }} />
              </div>
              <p className="footer__desc">
                India's trusted manufacturer of premium single-piece wet wipes. GMP certified, ISO aligned, export-ready. Rajkot, Gujarat.
              </p>
            </div>
            <div>
              <h4 className="footer__head">Quick Links</h4>
              <div className="footer__links">
                {[['Home', '#home'], ['About Us', '#about'], ['OEM Services', '#oem'], ['Products', '#products'], ['Our Clients', '#clients'], ['Contact', '#contact']].map(([l, h]) => (
                  <a key={l} href={h} className="footer__link">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="footer__head">Contact</h4>
              <div className="footer__contact-item">
                <strong>Address</strong>
                Survey No. 35-36, Madhapar Industrial Area, Jamnagar Road, Rajkot, Gujarat
              </div>
              <div className="footer__contact-item">
                <strong>Phone</strong>
                +91 60014 60018
              </div>
              <div className="footer__contact-item">
                <strong>Email</strong>
                brhygiene23@gmail.com
              </div>
              <div className="footer__contact-item">
                <strong>Hours</strong>
                Mon – Sat, 9 AM – 6 PM IST
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <span style={{ textAlign: 'center', width: '100%', display: 'block', marginBottom: '0.5rem' }}>
              © {new Date().getFullYear()} BR Hygiene. All rights reserved.
            </span>
            <div className="footer__bottom-links" style={{ justifyContent: 'center' }}>
              <button className="footer__legal-btn" onClick={() => setLegalModal('privacy')}>Privacy Policy</button>
              <button className="footer__legal-btn" onClick={() => setLegalModal('sitemap')}>Sitemap</button>
            </div>
          </div>

          {/* Legal Modals */}
          <AnimatePresence>
            {legalModal && (
              <motion.div className="modal-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setLegalModal(null)}
              >
                <motion.div className="modal-card legal-modal"
                  initial={{ scale: 0.9, opacity: 0, y: 30 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  onClick={e => e.stopPropagation()}
                >
                  <button className="modal-close" onClick={() => setLegalModal(null)}><X size={20} /></button>
                  {legalModal === 'privacy' ? (
                    <>
                      <h2 style={{ marginBottom: '1rem' }}>Privacy Policy</h2>
                      <p style={{ color: '#666', fontSize: '0.82rem', marginBottom: '1.2rem' }}>Last updated: February 2026</p>
                      {[
                        { title: '1. Information We Collect', text: 'When you submit an inquiry through our website, we collect your name, email address, phone number, and message content to respond to your business request.' },
                        { title: '2. How We Use Your Information', text: 'Your information is used solely to respond to your inquiry and communicate with you about BR Hygiene products and services. We do not sell or share your data with third parties.' },
                        { title: '3. Data Storage', text: 'Inquiry data is securely stored in our database. We retain records for up to 2 years for business correspondence purposes.' },
                        { title: '4. Cookies', text: 'Our website does not currently use any tracking or advertising cookies. We may use minimal session cookies for website functionality only.' },
                        { title: '5. Your Rights', text: 'You may request deletion or access to your personal data at any time by emailing us at brhygiene23@gmail.com.' },
                        { title: '6. Contact', text: 'For privacy-related queries, contact us at brhygiene23@gmail.com or call +91 60014 60018.' },
                      ].map((s, i) => (
                        <div key={i} style={{ marginBottom: '1rem' }}>
                          <strong style={{ color: 'var(--brand)', display: 'block', marginBottom: '0.3rem' }}>{s.title}</strong>
                          <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.6 }}>{s.text}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <h2 style={{ marginBottom: '1.4rem' }}>Sitemap</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        {[
                          { section: 'Main Pages', links: [['Home', '#home'], ['About Us', '#about'], ['OEM & Private Label', '#oem'], ['Products', '#products'], ['Our Clients', '#clients'], ['Contact Us', '#contact']] },
                          { section: 'Products', links: [['Aloe Vera & Cucumber Wipe', '#products'], ['Lemon Fresh Wipe', '#products'], ['Custom / OEM Wipes', '#oem']] },
                          { section: 'Services', links: [['OEM Manufacturing', '#oem'], ['Private Label', '#oem'], ['Custom Formulation', '#oem'], ['Bulk Supply', '#contact']] },
                          { section: 'Company', links: [['Our Story', '#about'], ['Manufacturing', '#about'], ['Quality Standards', '#about'], ['Get a Quote', '#contact']] },
                        ].map((group, i) => (
                          <div key={i}>
                            <strong style={{ color: 'var(--brand)', display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{group.section}</strong>
                            {group.links.map(([label, href], j) => (
                              <a key={j} href={href} onClick={() => setLegalModal(null)}
                                style={{ display: 'block', fontSize: '0.9rem', color: '#555', marginBottom: '0.35rem', textDecoration: 'none' }}
                                onMouseEnter={e => e.target.style.color = 'var(--brand)'}
                                onMouseLeave={e => e.target.style.color = '#555'}
                              >{label}</a>
                            ))}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </footer>
    </div>
  )
}

/* Fallback products */
const FALLBACK = [
  {
    id: 1, name: 'Aloe Vera & Cucumber Wipe',
    description: 'Infused with aloe vera and cooling cucumber for deep hydration and gentle skin care.',
    features: ['Alcohol Free', 'Skin Friendly', 'Moisturizing'],
    usage_text: 'Ideal for face, neck, and hands for a gentle cleanse anytime.',
    image_path: '/images/alovera mockup.jpeg',
  },
  {
    id: 2, name: 'Lemon Wipe',
    description: 'Zesty lemon scent delivers an instant burst of energy while effectively cleansing skin.',
    features: ['Citrus Freshness', 'pH Balanced', 'Individually Sealed'],
    usage_text: 'Perfect for post-meal cleanup or quick refreshment during travel.',
    image_path: '/images/lemon mockup.jpeg',
  }
]
