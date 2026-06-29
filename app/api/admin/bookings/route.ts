import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { getBookings } from "@/lib/bookings";

export async function GET() {
  const authed = await checkAdminAuth();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const bookings = await getBookings();
  return NextResponse.json({ bookings });
}
