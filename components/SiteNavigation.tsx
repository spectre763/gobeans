"use client";

import Link from "next/link";
import { motion, MotionValue } from "framer-motion";

interface SiteNavigationProps {
  scrollProgress?: MotionValue<number>;
  variant?: "hero" | "static";
}

const NAV_LINKS = [
  { href: "/#collection", id: "nav-menu", label: "Menu" },
  { href: "/#story", id: "nav-story", label: "Story" },
  { href: "/#craft", id: "nav-craft", label: "Process" },
  { href: "/#press", id: "nav-press", label: "Press" },
  { href: "/#visit", id: "nav-visit", label: "Locations" },
  { href: "/#journal", id: "nav-journal", label: "Journal" },
];

export default function SiteNavigation({
  scrollProgress,
  variant = "static",
}: SiteNavigationProps) {
  const isHero = variant === "hero" && scrollProgress;

  return (
    <nav
      className={`gobeans-nav${variant === "static" ? " gobeans-nav--static" : ""}`}
      aria-label="GoBeans main navigation"
    >
      <Link href="/" className="nav-logo" id="nav-logo">
        Go<span>Beans</span>
      </Link>

      <ul className="nav-links">
        {NAV_LINKS.map((link) => (
          <li key={link.id}>
            <Link href={link.href} id={link.id}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/appointments" className="nav-cta" id="nav-book">
        Book a Table
      </Link>

      {isHero ? (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.9) 0%, transparent 100%)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            opacity: scrollProgress,
            zIndex: -1,
            pointerEvents: "none",
          }}
        />
      ) : (
        <div className="gobeans-nav-bg" aria-hidden="true" />
      )}
    </nav>
  );
}
