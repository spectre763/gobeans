import { NextResponse } from "next/server";
import { addBooking, markConfirmationSent } from "@/lib/bookings";
import { sendBookingConfirmation } from "@/lib/notifications";
import { BOOKABLE_LOCATIONS } from "@/data/locations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locationId, date, time, partySize, name, phone, email, notes } = body;

    if (!locationId || !date || !time || !name || !phone || !email) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: "Name must be between 2 and 50 characters." }, { status: 400 });
    }

    const phoneRegex = /^\+?[0-9\s\-\(\)]{10,20}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: "Please provide a valid phone number." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 100) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (notes && notes.length > 500) {
      return NextResponse.json({ error: "Notes cannot exceed 500 characters." }, { status: 400 });
    }

    const location = BOOKABLE_LOCATIONS.find((loc) => loc.id === locationId);
    if (!location) {
      return NextResponse.json({ error: "Invalid location." }, { status: 400 });
    }

    const booking = await addBooking({
      locationId,
      locationName: location.name,
      date,
      time,
      partySize: Number(partySize) || 1,
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).trim(),
      notes: String(notes || "").trim(),
    });

    let confirmationSent = false;
    try {
      confirmationSent = await sendBookingConfirmation(booking);
      if (confirmationSent) {
        await markConfirmationSent(booking.id);
      }
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }

    return NextResponse.json({
      success: true,
      booking: { ...booking, confirmationSent },
      confirmationSent,
    });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
