"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { LOCATIONS } from "@/data/locations";

/* ─────────────────────────────────────────────────────────
   SHARED ANIMATION VARIANTS
───────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0, 0.1, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, delay: i * 0.08, ease: "easeOut" },
  }),
};

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  return { ref, inView };
}

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const MENU = [
  {
    id: "americano",
    category: "Espresso Bar",
    name: "The Americano",
    origin: "Yirgacheffe, Ethiopia",
    notes: "Dark chocolate · Cedar · Citrus zest",
    description:
      "Our flagship cup. A long pour over single-origin Ethiopian Yirgacheffe, coaxed into clarity by our in-house roasters. Bold without bitterness — perfect to start your morning.",
    price: "₹120",
    badge: "Signature",
  },
  {
    id: "flat-white",
    category: "Espresso Bar",
    name: "Flat White",
    origin: "Huila, Colombia",
    notes: "Caramel · Stone fruit · Milk chocolate",
    description:
      "Silky microfoam meets a double ristretto pulled from Colombian Huila. The perfect union of craft milk and precision extraction.",
    price: "₹150",
    badge: null,
  },
  {
    id: "cold-brew",
    category: "Cold Craft",
    name: "Signature Cold Brew",
    origin: "Chikmagalur, Karnataka",
    notes: "Brown sugar · Walnut · Vanilla",
    description:
      "24 hours of slow cold steeping with premium Chikmagalur beans — naturally sweet, smooth, and the perfect antidote to a Bhavnagar summer.",
    price: "₹180",
    badge: "Fan Favourite",
  },
  {
    id: "reserve",
    category: "Reserve",
    name: "Reserve Espresso",
    origin: "Kirinyaga, Kenya",
    notes: "Blackcurrant · Grapefruit · Jasmine",
    description:
      "From a micro-lot of just 400kg, this Kenyan AB is roasted light to preserve its wild, fruit-forward complexity. Available in limited rotation.",
    price: "₹170",
    badge: "Limited",
  },
  {
    id: "cortado",
    category: "Espresso Bar",
    name: "Cortado",
    origin: "Coorg, Karnataka",
    notes: "Rose · Caramel · Raw honey",
    description:
      "Equal parts espresso and warm milk. Our cortado lets the bean speak with just enough sweetness to round the edges — a local favourite.",
    price: "₹130",
    badge: null,
  },
  {
    id: "subscription",
    category: "At Home",
    name: "Bean Subscription",
    origin: "Rotating Single Origins",
    notes: "Monthly · Curated · Whole or Ground",
    description:
      "A new single origin delivered monthly to your door across Gujarat. Selected by our Head Roaster with tasting notes and brew guides included.",
    price: "₹599 / month",
    badge: "Popular",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Source",
    subtitle: "Direct Trade, Direct Care",
    body: "We work directly with smallholder farmers across Ethiopia, Colombia, Kenya, and Guatemala. Every relationship is built over years, not transactions. We pay above Fair Trade minimums as a starting point, not a ceiling.",
    icon: "🌍",
  },
  {
    step: "02",
    title: "Roast",
    subtitle: "Small Batch. High Precision.",
    body: "Our 10kg Probat roaster sits at the heart of our London micro-roastery. Each batch is profiled by hand and tasted blind before release. We roast to order — never more than 48 hours before it reaches you.",
    icon: "🔥",
  },
  {
    step: "03",
    title: "Brew",
    subtitle: "Dialled In, Every Time",
    body: "Our baristas dial in each espresso fresh each morning. Brew ratios, extraction time, and water temperature are logged and refined daily. Good coffee is never an accident.",
    icon: "☕",
  },
  {
    step: "04",
    title: "Serve",
    subtitle: "The Ritual of Receiving",
    body: "From the moment you walk in to the last note you taste, every detail is deliberate. The cup, the light, the quiet. We believe the experience of drinking coffee is as important as the coffee itself.",
    icon: "✦",
  },
];

const PRESS = [
  {
    id: "press-1",
    quote:
      "The most precise cup of coffee I've encountered in London. GoBeans has an obsessive attention to detail that borders on art.",
    author: "James Middleton",
    role: "Food Editor",
    publication: "Monocle Magazine",
  },
  {
    id: "press-2",
    quote:
      "GoBeans has quietly redefined what a specialty coffee shop can feel like — minimal, considered, and utterly without compromise.",
    author: "Priya Sharma",
    role: "Culture Correspondent",
    publication: "The Guardian",
  },
  {
    id: "press-3",
    quote:
      "Exceptional from bean to cup. Their Kenyan Reserve is the most complex espresso we tasted at the Expo.",
    author: "Marco Della Torre",
    role: "Head Judge",
    publication: "World Coffee Expo",
  },
];

/* ─────────────────────────────────────────────────────────
   COLLECTION SECTION
───────────────────────────────────────────────────────── */
export function CollectionSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { ref, inView } = useReveal();
  const categories = ["All", "Espresso Bar", "Cold Craft", "Reserve", "At Home"];

  const filtered =
    activeCategory === "All"
      ? MENU
      : MENU.filter((m) => m.category === activeCategory);

  return (
    <section id="collection" className="page-section" ref={ref}>
      <div className="section-inner">
        {/* Header */}
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="section-label">The Menu</p>
          <h2 className="section-title">
            Every Cup, <span className="gold-text">Considered</span>
          </h2>
          <p className="section-subtitle">
            Each drink is designed around a single origin. No blends, no compromise.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="filter-bar"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace(" ", "-")}`}
              className={`filter-pill${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              id={`menu-${item.id}`}
              className="menu-card"
              variants={fadeUp}
              custom={i * 0.5}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="menu-card-top">
                <span className="menu-category">{item.category}</span>
                {item.badge && (
                  <span className="menu-badge">{item.badge}</span>
                )}
              </div>

              <h3 className="menu-name">{item.name}</h3>
              <p className="menu-origin">{item.origin}</p>
              <p className="menu-notes">{item.notes}</p>

              <div className="menu-divider" />

              <p className="menu-description">{item.description}</p>

              <div className="menu-card-bottom">
                <span className="menu-price">{item.price}</span>
                <button className="menu-order-btn" id={`order-${item.id}`}>
                  Order
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   ABOUT SECTION
───────────────────────────────────────────────────────── */
export function AboutSection() {
  const { ref, inView } = useReveal();

  return (
    <section id="story" className="page-section about-section" ref={ref}>
      <div className="section-inner about-inner">
        {/* Left Column */}
        <motion.div
          className="about-text"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="section-label">Our Story</p>
          <h2 className="section-title" style={{ fontSize: "clamp(2.5rem, 4vw, 4.5rem)" }}>
            Born in <span className="gold-text">Bhavnagar</span>, Brewed for India
          </h2>
          <div className="about-copy">
            <p>
              GoBeans was founded in 2021 on Ring Road, Bhavnagar — in a city better known for its shipbreaking yards and diamond polishers than its specialty coffee. Our founder, Arjun Mehta, returned from Bengaluru with a simple belief: that Gujarat deserved a coffee shop that took quality seriously.
            </p>
            <p>
              He wanted a café that respected the whole journey — not just the espresso technique, but the farmer in Coorg or Chikmagalur, the soil, the altitude, the harvest, and finally the ritual of drinking. Every cup at GoBeans tells that story.
            </p>
            <p>
              Today, GoBeans operates two locations in Bhavnagar, a micro-roastery, and direct relationships with farms across Karnataka, Kerala, and East Africa. We still taste every batch blind before it leaves the roastery.
            </p>
          </div>

          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Farm Partners</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Origin Regions</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">48h</span>
              <span className="stat-label">Max Roast-to-Cup</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column — Founder Card */}
        <motion.div
          className="about-founder"
          variants={fadeIn}
          custom={2}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="founder-card">
            <div className="founder-avatar">
              <div className="founder-avatar-inner">AM</div>
            </div>
            <div className="founder-quote">
              <div className="quote-mark">"</div>
              <p>
                Bhavnagar has always had a rich culture of chai. I wanted to show that the same care, the same ritual, the same passion — it belongs to coffee too. Gujarat is ready.
              </p>
              <div className="founder-meta">
                <span className="founder-name">Arjun Mehta</span>
                <span className="founder-role">Founder & Head Roaster, Bhavnagar</span>
              </div>
            </div>
          </div>

          {/* Awards */}
          <div className="awards-row">
            {[
              { label: "Best Café in Saurashtra", year: "2022", org: "Gujarat Food Awards" },
              { label: "Top Specialty Roastery", year: "2024", org: "India Coffee Expo" },
            ].map((award) => (
              <div key={award.label} className="award-badge" id={`award-${award.year}`}>
                <span className="award-year">{award.year}</span>
                <span className="award-label">{award.label}</span>
                <span className="award-org">{award.org}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PROCESS SECTION
───────────────────────────────────────────────────────── */
export function ProcessSection() {
  const { ref, inView } = useReveal();

  return (
    <section id="craft" className="page-section process-section" ref={ref}>
      <div className="section-inner">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="section-label">The Process</p>
          <h2 className="section-title">
            From <span className="gold-text">Farm</span> to Cup
          </h2>
          <p className="section-subtitle">
            Four deliberate steps. Zero compromises.
          </p>
        </motion.div>

        <div className="process-grid">
          {PROCESS.map((step, i) => (
            <motion.div
              key={step.step}
              id={`process-step-${step.step}`}
              className="process-card"
              variants={fadeUp}
              custom={i * 0.8}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <div className="process-step-num">{step.step}</div>
              <div className="process-icon">{step.icon}</div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-subtitle">{step.subtitle}</p>
              <p className="process-body">{step.body}</p>
              {i < PROCESS.length - 1 && (
                <div className="process-connector" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PRESS / TESTIMONIALS SECTION
───────────────────────────────────────────────────────── */
export function PressSection() {
  const { ref, inView } = useReveal();

  return (
    <section id="press" className="page-section press-section" ref={ref}>
      <div className="section-inner">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="section-label">As Seen In</p>
          <h2 className="section-title">
            What People <span className="gold-text">Say</span>
          </h2>
        </motion.div>

        {/* Publication Logos (text-based) */}
        <motion.div
          className="pub-logos"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {["Times of India", "Gujarat Samachar", "India Coffee Expo", "Condé Nast Traveller India", "Hindustan Times"].map((pub) => (
            <span key={pub} className="pub-logo">{pub}</span>
          ))}
        </motion.div>

        {/* Quote Cards */}
        <div className="press-grid">
          {([
            {
              id: "press-1",
              quote: "In a city of chai lovers, GoBeans has quietly built something extraordinary. The most precise, passionate cup of coffee in Gujarat.",
              author: "Rajesh Patel",
              role: "Food & Lifestyle Editor",
              publication: "Times of India, Ahmedabad",
            },
            {
              id: "press-2",
              quote: "GoBeans on Ring Road is not just a café — it is an experience. The cold brew alone is worth the drive from Ahmedabad.",
              author: "Nisha Trivedi",
              role: "Travel & Culture Writer",
              publication: "Condé Nast Traveller India",
            },
            {
              id: "press-3",
              quote: "Exceptional sourcing, meticulous roasting, and a warm Gujarati welcome. GoBeans proves that world-class coffee can come from anywhere.",
              author: "Mihir Shah",
              role: "Head Judge",
              publication: "India Coffee Expo 2024",
            },
          ] as typeof PRESS).map((item, i) => (
            <motion.div
              key={item.id}
              id={item.id}
              className="press-card"
              variants={fadeUp}
              custom={i * 0.7}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <div className="press-quote-mark">"</div>
              <p className="press-quote">{item.quote}</p>
              <div className="press-author">
                <div className="press-author-avatar">
                  {item.author.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <p className="press-author-name">{item.author}</p>
                  <p className="press-author-role">
                    {item.role} · <span style={{ color: "var(--accent)" }}>{item.publication}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   LOCATIONS SECTION
───────────────────────────────────────────────────────── */
export function LocationsSection() {
  const { ref, inView } = useReveal();

  return (
    <section id="visit" className="page-section" ref={ref}>
      <div className="section-inner">
        <motion.div
          className="section-header"
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="section-label">Find Us</p>
          <h2 className="section-title">
            Our <span className="gold-text">Locations</span>
          </h2>
          <p className="section-subtitle">
            Two doors in Bhavnagar, one standard. Visit us on Ring Road or Waghawadi Road.
          </p>
        </motion.div>

        <div className="locations-grid">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.id}
              id={loc.id}
              className={`location-card${loc.tag === "Coming Soon" ? " location-card--soon" : ""}`}
              variants={fadeUp}
              custom={i * 0.6}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
            >
              <div className="location-card-top">
                <span className="location-tag">{loc.tag}</span>
                <h3 className="location-name">{loc.name}</h3>
                <p className="location-address">
                  {loc.address}<br />{loc.city}
                </p>
              </div>

              <div className="location-divider" />

              <div className="location-info">
                <div className="location-info-row">
                  <span className="location-info-icon">🕐</span>
                  <div>
                    <p className="location-hours">{loc.hours}</p>
                    {loc.weekend && <p className="location-hours">{loc.weekend}</p>}
                  </div>
                </div>
                <div className="location-info-row">
                  <span className="location-info-icon">📞</span>
                  <a href={`tel:${loc.phone.replace(/\s/g, "")}`} className="location-phone">
                    {loc.phone}
                  </a>
                </div>
              </div>

              {loc.tag !== "Coming Soon" && (
                <div className="location-card-actions">
                  <Link
                    href={`/appointments?location=${loc.id}`}
                    className="location-book-btn"
                    id={`book-${loc.id}`}
                  >
                    Book a Table
                  </Link>
                  <a href="#" className="location-map-btn" id={`map-${loc.id}`}>
                    Get Directions
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   NEWSLETTER SECTION
───────────────────────────────────────────────────────── */
export function NewsletterSection() {
  const { ref, inView } = useReveal();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="journal" className="page-section newsletter-section" ref={ref}>
      <div className="newsletter-inner">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="newsletter-content"
        >
          <p className="section-label" style={{ textAlign: "center" }}>The GoBeans Journal</p>
          <h2 className="section-title" style={{ textAlign: "center", fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Stay in the <span className="gold-text">Loop</span>
          </h2>
          <p className="section-subtitle" style={{ textAlign: "center", maxWidth: "440px", margin: "1rem auto 0" }}>
            Monthly tasting notes, origin stories, brew guides, and early access to limited micro-lots. No noise. Just coffee.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="newsletter-form" id="newsletter-form">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn" id="newsletter-submit">
                Subscribe
              </button>
            </form>
          ) : (
            <motion.div
              className="newsletter-success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✦ &nbsp; Thank you — your first journal arrives this week.
            </motion.div>
          )}

          <p className="newsletter-disclaimer">
            No spam. Unsubscribe anytime. Your details are never shared.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SITE FOOTER
───────────────────────────────────────────────────────── */
export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand-col">
          <div className="footer-logo">
            Go<span>Beans</span>
          </div>
          <p className="footer-tagline-text">
            Specialty coffee, roasted in Bhavnagar.<br />
            From bean to brew — for Gujarat &amp; beyond.
          </p>
          <div className="footer-socials">
            {[
              { id: "social-instagram", label: "Instagram", href: "#" },
              { id: "social-facebook", label: "Facebook", href: "#" },
              { id: "social-whatsapp", label: "WhatsApp Orders", href: "#" },
            ].map((s) => (
              <a key={s.id} id={s.id} href={s.href} className="social-link">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="footer-col">
          <h4 className="footer-col-title">Explore</h4>
          <ul className="footer-nav">
            <li><Link href="/#collection" id="fnav-menu">Menu</Link></li>
            <li><Link href="/#story"      id="fnav-story">Our Story</Link></li>
            <li><Link href="/#craft"      id="fnav-craft">Process</Link></li>
            <li><Link href="/#press"      id="fnav-press">Press</Link></li>
            <li><Link href="/#visit"      id="fnav-visit">Locations</Link></li>
            <li><Link href="/appointments" id="fnav-appointments">Book a Table</Link></li>
            <li><Link href="/#journal"    id="fnav-journal">Journal</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <ul className="footer-nav">
            <li>
              <a href="mailto:hello@gobeans.in" id="fnav-email">
                hello@gobeans.in
              </a>
            </li>
            <li>
              <a href="tel:+919876543210" id="fnav-phone">
                +91 98765 43210
              </a>
            </li>
            <li style={{ color: "var(--text-muted)", fontSize: "0.8125rem", lineHeight: 1.6, marginTop: "0.5rem" }}>
              Shop No. 12, Shyam Plaza<br />
              Ring Road, Bhavnagar<br />
              Gujarat 364001, India
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom-bar">
        <span className="footer-legal">
          © {new Date().getFullYear()} GoBeans Café Pvt. Ltd. · Bhavnagar, Gujarat, India · All rights reserved.
        </span>
        <div className="footer-legal-links">
          <a href="#" id="fnav-privacy">Privacy Policy</a>
          <a href="#" id="fnav-terms">Terms of Use</a>
          <a href="#" id="fnav-cookies">Cookie Preferences</a>
        </div>
        <span className="footer-craft-tag">
          Crafted with precision ✦
        </span>
      </div>
    </footer>
  );
}
