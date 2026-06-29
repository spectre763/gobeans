"use client";

import React, { useState, useEffect, useCallback } from "react";

interface Booking {
  id: string;
  locationName: string;
  date: string;
  time: string;
  partySize: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  confirmationSent: boolean;
  createdAt: string;
}

function formatTimeSlot(slot: string): string {
  const [h, m] = slot.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export default function AdminBookingsPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch("/api/admin/bookings");
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(data.bookings);
      setAuthed(true);
    } catch {
      setFetchError("Could not load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Invalid password.");
      return;
    }
    setAuthed(true);
    setPassword("");
    fetchBookings();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setBookings([]);
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <form onSubmit={handleLogin} className="admin-login-form">
          <h1 className="admin-login-title">Owner Login</h1>
          <p className="admin-login-subtitle">
            Sign in to view table reservations.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter owner password"
            className="appointment-input"
            required
          />
          {loginError && <p className="admin-error">{loginError}</p>}
          <button type="submit" className="appointment-submit-btn">
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <div>
          <p className="section-label">Owner Dashboard</p>
          <h1 className="section-title">
            Table <span className="gold-text">Bookings</span>
          </h1>
          <p className="section-subtitle">
            {bookings.length} reservation{bookings.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="admin-panel-actions">
          <button
            type="button"
            className="appointment-reset-btn"
            onClick={fetchBookings}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      {fetchError && <p className="admin-error">{fetchError}</p>}

      {bookings.length === 0 && !loading ? (
        <div className="admin-empty">
          <p>No bookings yet. New reservations will appear here.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Guest</th>
                <th>Guests</th>
                <th>Contact</th>
                <th>Notes</th>
                <th>Confirmed</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    {new Date(b.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{formatTimeSlot(b.time)}</td>
                  <td>{b.locationName}</td>
                  <td>{b.name}</td>
                  <td>{b.partySize}</td>
                  <td>
                    <a href={`tel:${b.phone.replace(/\s/g, "")}`}>{b.phone}</a>
                    <br />
                    <a href={`mailto:${b.email}`}>{b.email}</a>
                  </td>
                  <td>{b.notes || "—"}</td>
                  <td>
                    <span className={`admin-badge${b.confirmationSent ? " admin-badge--yes" : " admin-badge--no"}`}>
                      {b.confirmationSent ? "Sent" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
