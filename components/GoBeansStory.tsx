"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import SiteNavigation from "@/components/SiteNavigation";
import CustomCursor from "@/components/CustomCursor";

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const FRAME_COUNT = 232;
const SEQUENCE_DIR = "/sequence/";

// Beat definitions — scroll progress ranges [start, end]
const BEATS = {
  A: { start: 0.0, end: 0.2 },
  B: { start: 0.25, end: 0.45 },
  C: { start: 0.5, end: 0.7 },
  D: { start: 0.75, end: 0.95 },
  CTA: { start: 0.88, end: 1.0 },
};

/* ─────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────── */
interface BeatTextProps {
  scrollProgress: ReturnType<typeof useSpring>;
  beatStart: number;
  beatEnd: number;
  align?: "left" | "right" | "center";
  label: string;
  title: string | React.ReactNode;
  subtitle: string;
  index?: string;
  startsVisible?: boolean; // if true, opacity begins at 1 (no scroll needed)
  children?: React.ReactNode;
}

/* ─────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────── */
function padFrame(n: number): string {
  // frames are named ezgif-frame-001.jpg … ezgif-frame-232.jpg
  return String(n).padStart(3, "0");
}

function frameUrl(index: number): string {
  // index 0 → frame 1, etc.
  return `${SEQUENCE_DIR}ezgif-frame-${padFrame(index + 1)}.jpg`;
}

/* ─────────────────────────────────────────────────────────
   BEAT TEXT OVERLAY
───────────────────────────────────────────────────────── */
function BeatText({
  scrollProgress,
  beatStart,
  beatEnd,
  align = "left",
  label,
  title,
  subtitle,
  index,
  startsVisible = false,
  children,
}: BeatTextProps) {
  const fadeRange: [number, number, number, number] = startsVisible
    ? [0, 0, beatEnd - 0.07, beatEnd]   // visible immediately, only fades out
    : [beatStart, beatStart + 0.07, beatEnd - 0.07, beatEnd];

  const opacityValues = startsVisible ? [1, 1, 1, 0] : [0, 1, 1, 0];

  const opacity = useTransform(scrollProgress, fadeRange, opacityValues);
  // No enter-animation for Beat A (it's already there)
  const yEnter = useTransform(
    scrollProgress,
    [beatStart, beatStart + 0.1],
    startsVisible ? [0, 0] : [24, 0]
  );
  const yExit = useTransform(scrollProgress, [beatEnd - 0.1, beatEnd], [0, -24]);

  const alignClass =
    align === "right"
      ? "story-text-right"
      : align === "center"
      ? "story-text-center"
      : "story-text-left";

  const beatLabelClass = `beat-label${align === "right" ? " justify-end" : align === "center" ? " justify-center" : ""}`;

  return (
    <motion.div
      style={{ opacity, y: yEnter }}
      className={`story-overlay`}
    >
      <motion.div style={{ y: yExit }} className={alignClass}>
        {index && <p className="section-index mb-3">{index}</p>}
        <div className={beatLabelClass}>{label}</div>
        <h2 className="text-headline">{title}</h2>
        <div className="gold-divider" style={align === "right" ? { marginLeft: "auto" } : align === "center" ? { margin: "1.5rem auto" } : {}} />
        <p className="text-subtitle">{subtitle}</p>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   LOADING SCREEN
───────────────────────────────────────────────────────── */
interface LoadingScreenProps {
  progress: number;
  visible: boolean;
}

function LoadingScreen({ progress, visible }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0, 0.1, 1] }}
        >
          {/* Logo */}
          <motion.div
            className="loading-logo"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: "easeOut" }}
          >
            Go<span>Beans</span>
          </motion.div>

          {/* Spinner */}
          <motion.div
            className="loading-spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />

          {/* Progress */}
          <motion.div
            style={{ width: "min(320px, 80vw)", display: "flex", flexDirection: "column", gap: "0.625rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="loading-bar-container">
              <div
                className="loading-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="loading-percent">Loading frames</span>
              <span className="loading-percent">{Math.round(progress)}%</span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginTop: "1rem",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            From bean to brew
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   SCROLL INDICATOR
───────────────────────────────────────────────────────── */
function ScrollIndicator({ scrollProgress }: { scrollProgress: ReturnType<typeof useSpring> }) {
  const opacity = useTransform(scrollProgress, [0, 0.1], [1, 0]);

  return (
    <motion.div className="scroll-indicator" style={{ opacity }}>
      <span className="scroll-indicator-text">Scroll to Explore</span>
      <div className="scroll-mouse">
        <div className="scroll-mouse-dot" />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────── */
function Navigation({ scrollProgress }: { scrollProgress: ReturnType<typeof useSpring> }) {
  const bgOpacity = useTransform(scrollProgress, [0, 0.05], [0, 1]);

  return <SiteNavigation scrollProgress={bgOpacity} variant="hero" />;
}

/* ─────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────────────────── */
function GlobalProgressBar({ scrollProgress }: { scrollProgress: ReturnType<typeof useSpring> }) {
  const scaleX = useTransform(scrollProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX, width: "100%" }}
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */
export default function GoBeansStory() {
  /* refs */
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isMounted = useRef(true);

  /* state */
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  /* scroll */
  const { scrollYProgress } = useScroll({ target: wrapperRef });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0001,
  });

  /* ── Canvas sizing ── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
    // Redraw current frame after resize
    renderFrame(currentFrameRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Draw frame ── */
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    const cw = canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
    const ch = canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

    ctx.clearRect(0, 0, cw, ch);

    // Fill background
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);

    // Contain-fit scaling
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = cw / ch;

    let drawW: number, drawH: number, drawX: number, drawY: number;

    if (imgAspect > canvasAspect) {
      // Image is wider — fit height
      drawH = ch;
      drawW = ch * imgAspect;
    } else {
      // Image is taller — fit width
      drawW = cw;
      drawH = cw / imgAspect;
    }

    drawX = (cw - drawW) / 2;
    drawY = (ch - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /* ── Preload all frames ── */
  useEffect(() => {
    isMounted.current = true;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    let loaded = 0;

    // Preload in batches to avoid overwhelming the browser
    const BATCH = 20;
    let batchStart = 0;

    const loadBatch = () => {
      const end = Math.min(batchStart + BATCH, FRAME_COUNT);
      for (let i = batchStart; i < end; i++) {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          loaded++;
          if (!isMounted.current) return;
          const pct = (loaded / FRAME_COUNT) * 100;
          setLoadProgress(pct);

          // Show first frame as soon as first image loads
          if (loaded === 1) {
            resizeCanvas();
            renderFrame(0);
          }

          if (loaded === FRAME_COUNT) {
            setIsLoaded(true);
            // Fade out loading screen after a brief pause
            setTimeout(() => {
              if (isMounted.current) setShowLoading(false);
            }, 600);
          }
        };
        img.onerror = () => {
          loaded++;
          if (!isMounted.current) return;
          setLoadProgress((loaded / FRAME_COUNT) * 100);
          if (loaded === FRAME_COUNT) {
            setIsLoaded(true);
            setTimeout(() => {
              if (isMounted.current) setShowLoading(false);
            }, 600);
          }
        };
        img.src = frameUrl(i);
        images[i] = img;
      }
      batchStart = end;
      if (batchStart < FRAME_COUNT) {
        // Small delay between batches
        setTimeout(loadBatch, 50);
      }
    };

    loadBatch();

    return () => {
      isMounted.current = false;
    };
  }, [renderFrame, resizeCanvas]);

  /* ── Resize listener ── */
  useEffect(() => {
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  /* ── Subscribe to smooth scroll progress & drive canvas ── */
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v: number) => {
      const frameIndex = Math.min(
        Math.max(0, Math.round(v * (FRAME_COUNT - 1))),
        FRAME_COUNT - 1
      );
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => renderFrame(frameIndex));
      }
    });

    return () => {
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [smoothProgress, renderFrame]);

  /* ── Scroll progress for UI transforms ── */
  const scrollProgressValue = smoothProgress;

  /* ── CTA opacity ── */
  const ctaOpacity = useTransform(
    scrollProgressValue,
    [BEATS.CTA.start, BEATS.CTA.start + 0.05, 1],
    [0, 1, 1]
  );
  const ctaY = useTransform(
    scrollProgressValue,
    [BEATS.CTA.start, BEATS.CTA.start + 0.08],
    [20, 0]
  );

  return (
    <>
      {/* ── Film Grain ── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ── Custom Cursor (desktop only) ── */}
      <CustomCursor />

      {/* ── Loading Screen ── */}
      <LoadingScreen progress={loadProgress} visible={showLoading} />

      {/* ── Global Scroll Progress Bar ── */}
      <GlobalProgressBar scrollProgress={scrollProgressValue} />

      {/* ── Navigation ── */}
      <Navigation scrollProgress={scrollProgressValue} />

      {/* ── Story Wrapper (5× viewport height for scroll travel) ── */}
      <div
        ref={wrapperRef}
        style={{ height: "500vh" }}
        aria-label="GoBeans scrollytelling experience"
      >
        {/* ── Sticky Canvas Stage ── */}
        <div className="canvas-wrapper">
          {/* The Canvas */}
          <canvas
            ref={canvasRef}
            className="story-canvas"
            aria-label="GoBeans coffee image sequence animation"
          />

          {/* ── Beat A: GoBeans — starts visible immediately ── */}
          <BeatText
            scrollProgress={scrollProgressValue}
            beatStart={BEATS.A.start}
            beatEnd={BEATS.A.end}
            align="left"
            label="Luxury Specialty Coffee"
            index="01 —"
            startsVisible={true}
            title={
              <>
                Go<span style={{ color: "var(--accent)" }}>Beans</span>
              </>
            }
            subtitle="Crafted for those who appreciate every detail. A pristine Americano begins its journey."
          />

          {/* ── Beat B: From Bean ── */}
          <BeatText
            scrollProgress={scrollProgressValue}
            beatStart={BEATS.B.start}
            beatEnd={BEATS.B.end}
            align="right"
            label="Origin & Selection"
            index="02 —"
            title="From Bean"
            subtitle="Carefully selected beans, roasted to unlock character and depth. The beans begin to reveal themselves."
          />

          {/* ── Beat C: To Experience ── */}
          <BeatText
            scrollProgress={scrollProgressValue}
            beatStart={BEATS.C.start}
            beatEnd={BEATS.C.end}
            align="left"
            label="Sensory Journey"
            index="03 —"
            title={
              <>
                To{" "}
                <span style={{ color: "var(--accent)" }}>Experience</span>
              </>
            }
            subtitle="A symphony of aroma, texture, heat, and movement. Coffee transforms into suspended droplets."
          />

          {/* ── Beat D: Every Detail ── */}
          <BeatText
            scrollProgress={scrollProgressValue}
            beatStart={BEATS.D.start}
            beatEnd={BEATS.D.end}
            align="right"
            label="Craftsmanship"
            index="04 —"
            title={
              <>
                Every Detail{" "}
                <br />
                <span style={{ color: "var(--accent)" }}>Matters</span>
              </>
            }
            subtitle="Discover the craftsmanship behind every sip. Cup, saucer, beans, and steam in perfect harmony."
          />

          {/* ── CTA ── */}
          <motion.div
            className="story-overlay"
            style={{ opacity: ctaOpacity, y: ctaY, alignItems: "flex-end", paddingBottom: "10vh" }}
          >
            <div className="story-text-center">
              <div className="beat-label justify-center" style={{ justifyContent: "center" }}>
                The GoBeans Experience
              </div>
              <h2 className="text-headline">
                Taste the{" "}
                <span style={{ color: "var(--accent)" }}>Extraordinary</span>
              </h2>
              <p className="text-subtitle" style={{ marginTop: "1rem" }}>
                Experience GoBeans. Where every sip tells a story.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ display: "inline-block", marginTop: "2rem" }}
              >
                <a
                  href="#collection"
                  className="cta-button"
                  id="cta-explore-collection"
                >
                  Explore Collection
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M1 7h12M7 1l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* ── Scroll Indicator ── */}
          <ScrollIndicator scrollProgress={scrollProgressValue} />

          {/* ── Vignette edges ── */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 45%, rgba(5,5,5,0.6) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

    </>
  );
}
