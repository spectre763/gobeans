import dynamic from "next/dynamic";
import {
  CollectionSection,
  AboutSection,
  ProcessSection,
  PressSection,
  LocationsSection,
  NewsletterSection,
  SiteFooter,
} from "@/components/PageSections";

const GoBeansStory = dynamic(() => import("@/components/GoBeansStory"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main>
      {/* ── Scroll Story (canvas image sequence) ── */}
      <GoBeansStory />

      {/* ── Menu ── */}
      <CollectionSection />

      {/* ── About / Brand Story ── */}
      <AboutSection />

      {/* ── Process ── */}
      <ProcessSection />

      {/* ── Press & Testimonials ── */}
      <PressSection />

      {/* ── Locations ── */}
      <LocationsSection />

      {/* ── Newsletter ── */}
      <NewsletterSection />

      {/* ── Full Footer ── */}
      <SiteFooter />
    </main>
  );
}
