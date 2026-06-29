import type { Metadata } from "next";
import { Suspense } from "react";
import SiteNavigation from "@/components/SiteNavigation";
import CustomCursor from "@/components/CustomCursor";
import AppointmentForm from "@/components/AppointmentForm";
import { SiteFooter } from "@/components/PageSections";

export const metadata: Metadata = {
  title: "Book a Table — GoBeans Specialty Coffee, Bhavnagar",
  description:
    "Reserve your table at GoBeans. Choose your location, date, and time across our Bhavnagar cafés. Open 11 AM – 11 PM.",
  openGraph: {
    title: "Book a Table — GoBeans",
    description:
      "Reserve your table at GoBeans — choose a location, date, and time. Open 11 AM – 11 PM.",
    type: "website",
  },
};

export default function AppointmentsPage() {
  return (
    <main>
      <CustomCursor />
      <SiteNavigation variant="static" />

      <section className="appointment-page">
        <div className="appointment-page-inner">
          <div className="appointment-page-header">
            <p className="section-label">Reservations</p>
            <h1 className="section-title">
              Book a <span className="gold-text">Table</span>
            </h1>
            <p className="section-subtitle">
              Reserve your table at any GoBeans café. We&apos;re open daily from
              11:00 AM to 11:00 PM — pick a location and time, and we&apos;ll
              have everything ready when you arrive.
            </p>
          </div>

          <Suspense fallback={<div className="appointment-loading">Loading…</div>}>
            <AppointmentForm />
          </Suspense>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
