"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BOOKABLE_LOCATIONS } from "@/data/locations";

const TIME_SLOTS = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00",
];

const PARTY_SIZES = Array.from({ length: 12 }, (_, i) => i + 1);

function formatTimeSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function getLocalTodayDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMinDate(): string {
  return getLocalTodayDate();
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.25, 0, 0.1, 1] },
  }),
};

export default function AppointmentForm() {
  const searchParams = useSearchParams();
  const preselectedLocation = searchParams.get("location") ?? "";

  const [locationId, setLocationId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState("2");

  const todayStr = getLocalTodayDate();
  const availableTimeSlots = React.useMemo(() => {
    if (date !== todayStr) return TIME_SLOTS;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    return TIME_SLOTS.filter((slot) => {
      const [h, m] = slot.split(":").map(Number);
      const slotTimeInMinutes = h * 60 + m;
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      return slotTimeInMinutes > currentTimeInMinutes + 30; // 30 min buffer
    });
  }, [date, todayStr]);
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      preselectedLocation &&
      BOOKABLE_LOCATIONS.some((loc) => loc.id === preselectedLocation)
    ) {
      setLocationId(preselectedLocation);
    }
  }, [preselectedLocation]);

  const selectedLocation = BOOKABLE_LOCATIONS.find((loc) => loc.id === locationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId,
          date,
          time,
          partySize,
          name,
          phone: `${countryCode} ${phone}`,
          email,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setConfirmationSent(data.confirmationSent);
      setSubmitted(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && selectedLocation) {
    return (
      <motion.div
        className="appointment-success"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="appointment-success-icon">✦</div>
        <h2 className="appointment-success-title">
          You&apos;re <span className="gold-text">Booked</span>
        </h2>
        <p className="appointment-success-body">
          Your reservation at <strong>{selectedLocation.name}</strong> is confirmed
          for {new Date(date).toLocaleDateString("en-IN", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}{" "}
          at {formatTimeSlot(time)} for {partySize}{" "}
          {Number(partySize) === 1 ? "guest" : "guests"}.
        </p>
        <p className="appointment-success-note">
          {confirmationSent
            ? `A confirmation email has been sent to ${email}.`
            : `Your booking is saved. We could not send the email — please contact us to confirm.`}
        </p>
        <button
          type="button"
          className="appointment-reset-btn"
          onClick={() => {
            setSubmitted(false);
            setConfirmationSent(false);
            setDate("");
            setTime("");
            setNotes("");
          }}
        >
          Book Another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="appointment-form" id="appointment-form">
      <motion.fieldset
        className="appointment-fieldset"
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <legend className="appointment-legend">Location</legend>
        <div className="appointment-location-grid">
          {BOOKABLE_LOCATIONS.map((loc) => (
            <label
              key={loc.id}
              className={`appointment-location-card${locationId === loc.id ? " appointment-location-card--active" : ""}`}
            >
              <input
                type="radio"
                name="location"
                value={loc.id}
                checked={locationId === loc.id}
                onChange={() => setLocationId(loc.id)}
                className="appointment-radio"
                required
              />
              <span className="appointment-location-tag">{loc.tag}</span>
              <span className="appointment-location-name">{loc.name}</span>
              <span className="appointment-location-address">
                {loc.address}, {loc.city}
              </span>
              <span className="appointment-location-hours">Open 11:00 AM – 11:00 PM</span>
            </label>
          ))}
        </div>
      </motion.fieldset>

      <motion.div
        className="appointment-row"
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="visible"
      >
        <div className="appointment-field">
          <label htmlFor="appointment-date" className="appointment-label">
            Date
          </label>
          <input
            id="appointment-date"
            type="date"
            value={date}
            min={getMinDate()}
            onChange={(e) => setDate(e.target.value)}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              if ('showPicker' in target) {
                try { target.showPicker(); } catch {}
              }
            }}
            className="appointment-input"
            required
          />
        </div>

        <div className="appointment-field">
          <label htmlFor="appointment-time" className="appointment-label">
            Time
          </label>
          <select
            id="appointment-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="appointment-select"
            required
          >
            {availableTimeSlots.length === 0 ? (
              <option value="" disabled>
                No slots available
              </option>
            ) : (
              <option value="" disabled>
                Select a time
              </option>
            )}
            {availableTimeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {formatTimeSlot(slot)}
              </option>
            ))}
          </select>
        </div>

        <div className="appointment-field">
          <label htmlFor="appointment-party" className="appointment-label">
            Guests
          </label>
          <select
            id="appointment-party"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            className="appointment-select"
          >
            {PARTY_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div
        className="appointment-row"
        variants={fadeUp}
        custom={2}
        initial="hidden"
        animate="visible"
      >
        <div className="appointment-field">
          <label htmlFor="appointment-name" className="appointment-label">
            Full Name
          </label>
            <input
              id="appointment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="appointment-input"
              minLength={2}
              maxLength={50}
              required
            />
        </div>

        <div className="appointment-field">
          <label htmlFor="appointment-phone" className="appointment-label">
            Phone
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="appointment-select"
              style={{ width: "auto", flexShrink: 0, paddingRight: "1.5rem" }}
            >
              <option value="+91">IN (+91)</option>
              <option value="+1">US (+1)</option>
              <option value="+44">UK (+44)</option>
              <option value="+61">AU (+61)</option>
              <option value="+971">UAE (+971)</option>
              <option value="+65">SG (+65)</option>
            </select>
            <input
              id="appointment-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              className="appointment-input"
              pattern="^[0-9\s\-\(\)]{10,15}$"
              title="Please enter a valid phone number (10-15 digits)"
              required
              style={{ flexGrow: 1 }}
            />
          </div>
        </div>

        <div className="appointment-field">
          <label htmlFor="appointment-email" className="appointment-label">
            Email
          </label>
            <input
              id="appointment-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="appointment-input"
              maxLength={100}
              required
            />
        </div>
      </motion.div>

      <motion.div
        className="appointment-field appointment-field--full"
        variants={fadeUp}
        custom={3}
        initial="hidden"
        animate="visible"
      >
        <label htmlFor="appointment-notes" className="appointment-label">
          Special Requests <span className="appointment-optional">(optional)</span>
        </label>
          <textarea
            id="appointment-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dietary needs, occasion, seating preference…"
            className="appointment-textarea"
            rows={3}
            maxLength={500}
          />
      </motion.div>

      <motion.div
        variants={fadeUp}
        custom={4}
        initial="hidden"
        animate="visible"
      >
        {error && <p className="appointment-error">{error}</p>}
        <button
          type="submit"
          className="appointment-submit-btn"
          id="appointment-submit"
          disabled={submitting}
        >
          {submitting ? "Booking…" : "Confirm Reservation"}
          {!submitting && (
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M1 6h10M6 1l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <p className="appointment-disclaimer">
          Café hours: 11:00 AM – 11:00 PM daily. Reservations held for 15 minutes.
          For groups of 8+, please call us directly.
        </p>
      </motion.div>
    </form>
  );
}
