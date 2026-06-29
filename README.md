# GoBeans: Comprehensive Project Documentation

> [!NOTE]
> GoBeans is a sophisticated, highly-polished web application designed for a premium specialty coffee chain based in Bhavnagar, Gujarat. Built with modern web technologies, it provides a seamless booking experience for customers and a secure management dashboard for café administrators.

---

## 1. Business Context & Features
GoBeans operates multiple café locations. To manage foot traffic and provide a premium experience, the café requires a reservation system that is both beautiful and reliable. 

### Key Customer Features:
- **Location Discovery:** Users can view multiple café branches (e.g., Ring Road, Waghawadi Road) and see their specific opening hours.
- **Smart Reservations:** 
  - The booking system automatically restricts past dates.
  - Time slots are dynamically filtered based on the user's local timezone to prevent booking slots that have already passed on the current day, enforcing a 30-minute safety buffer.
- **Robust Validation:** Customer data is strictly validated (Name length, international Phone formatting via regex, Email formatting) both on the client and server sides to prevent spam or bad data.
- **Automated Communication:** Upon successful booking, an HTML-formatted, branded confirmation email is sent directly to the customer's inbox.

### Key Admin Features:
- **Secure Dashboard:** An authenticated `/admin/bookings` route allows staff to view all reservations.
- **Session Management:** Admin access is secured using HTTP-only cookies and a session secret.

---

## 2. Technical Architecture

The application is built on a highly modern, edge-ready JavaScript stack:

### Frontend
- **Framework:** Next.js 14 (using the App Router for server-rendered and statically generated pages).
- **Library:** React 18 (utilizing hooks like `useState`, `useEffect`, and `useMemo` for complex client-side state).
- **Styling:** A hybrid approach using **Tailwind CSS** for layout utilities and **Vanilla CSS** (`globals.css`) for complex design tokens, CSS variables, custom scrollbars, and premium glassmorphic effects.
- **Animations:** **Framer Motion** powers smooth, sequenced fade-up animations on page load.
- **Custom UI:** Features a custom cursor component (`CustomCursor.tsx`) that tracks mouse movement to enhance the high-end aesthetic.

### Backend (Next.js Route Handlers)
- **API Routes:** Built inside the `app/api/` directory (e.g., `/api/appointments/route.ts`).
- **Data Validation:** Incoming JSON payloads are intercepted, sanitized, and validated against strict regex rules before processing.
- **Email Delivery (`lib/notifications.ts`):** 
  - Built to be environment-agnostic. 
  - If `RESEND_API_KEY` is present, it uses the **Resend API** for high-deliverability transactional emails.
  - If `SMTP_HOST` is present, it uses **Nodemailer** to route emails through standard SMTP providers (like Gmail or Outlook).
  - If no keys are present, it falls back to a development mode, saving the raw email payloads to a local `data/email-outbox.json` file.

### Database / Storage (`lib/bookings.ts`)
The storage layer is designed to work seamlessly both locally and on edge deployments (like Vercel).
- **Primary (Upstash Redis):** For serverless deployments, it connects to an Upstash Redis database using `@upstash/redis`.
- **Secondary (Standard Redis):** Can connect to a standard Redis instance using the `redis` client.
- **Fallback (File System):** For local development without databases, it safely reads and writes to `data/bookings.json`.

---

## 3. Deep Dive: File & Folder Structure

```text
gobeans/
├── app/
│   ├── admin/
│   │   └── bookings/page.tsx      # Secure admin dashboard UI
│   ├── api/
│   │   ├── admin/                 # API routes for admin login/logout
│   │   └── appointments/route.ts  # API route handling booking submissions
│   ├── appointments/
│   │   └── page.tsx               # The main public booking page
│   ├── globals.css                # CSS variables, premium styling, dark mode rules
│   └── layout.tsx                 # Root layout defining HTML structure and fonts
├── components/
│   ├── AdminBookingsPanel.tsx     # The admin table showing customer reservations
│   ├── AppointmentForm.tsx        # The complex client-side React form logic
│   ├── CustomCursor.tsx           # The animated custom mouse pointer
│   ├── PageSections.tsx           # Shared UI sections (e.g., Footer)
│   └── SiteNavigation.tsx         # The main navigation header
├── data/
│   └── locations.ts               # Static data for café branches and addresses
├── lib/
│   ├── bookings.ts                # Database adapter (Redis vs Local JSON)
│   └── notifications.ts           # Email compilation and sending logic
├── package.json                   # Dependencies
└── tailwind.config.js             # Tailwind theme configuration
```

---

## 4. Environment Variables Configuration

The application's behavior completely changes based on the `.env.local` file:

- `OWNER_PASSWORD` / `ADMIN_SECRET`: Secures the admin dashboard.
- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`: Triggers the serverless Redis storage engine.
- `RESEND_API_KEY`: Triggers the Resend email engine.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: Triggers the Nodemailer SMTP engine (perfect for using standard `@gmail.com` accounts via Google App Passwords).

---

## 5. Design System & Aesthetics

> [!TIP]
> The design system is crafted to feel like a high-end luxury brand rather than a standard web app.

- **Color Palette:** Dominated by a deep, true black (`#050505`) with crisp white primary text (`rgba(255, 255, 255, 0.92)`). Accents use a specialized gold/bronze hue (`#C58B45`) and an espresso brown (`#6F4E37`).
- **Typography:** Relies heavily on the **Inter** font family, utilizing extreme weights (from ultra-light `200` to bold `700`) and tight letter-spacing to create a highly editorial look.
- **Micro-interactions:** Interactive elements use `transition` and `hover` states to add glowing shadows (`box-shadow: 0 0 40px var(--accent-glow-strong)`), making the interface feel alive and tactile.
