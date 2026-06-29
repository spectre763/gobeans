import type { Metadata } from "next";
import AdminBookingsPanel from "@/components/AdminBookingsPanel";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Bookings Dashboard — GoBeans",
  robots: { index: false, follow: false },
};

export default function AdminBookingsPage() {
  return (
    <main>
      <CustomCursor />
      <section className="appointment-page admin-page">
        <div className="appointment-page-inner admin-page-inner">
          <AdminBookingsPanel />
        </div>
      </section>
    </main>
  );
}
