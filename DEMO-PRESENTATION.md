# KwikFix — Demo Day Presentation Guide (5–7 min)

A real-time marketplace that connects customers in Umuahia, Abia State with
**registered, vetted handymen** — bookings, acceptance, live ETA tracking,
chat, notifications, and presence all sync in real time via Firebase.

---

## 1. Introduction (30 seconds)

> "Hi everyone, I'm [Your Name], a frontend web developer. Today I'm excited
> to show you **KwikFix** — a platform I built that connects homeowners with
> verified handymen in Abia State, in real time. I designed it, built it,
> and wired up the live data layer myself — so I'll walk you through the
> product, a live end-to-end demo, and the thinking behind the architecture."

*Tip: keep it to 3 sentences. Then jump straight into the problem.*

---

## 2. The Problem (30–45 seconds)

> "Finding a reliable handyman in Nigeria is painfully manual. You ask friends
> for recommendations, call around, get ghosted, never know who's actually
> qualified or if they'll even show up. There's no visibility and no trust.
> And for handymen — who are mostly skilled, hardworking people — there's no
> steady pipeline of customers and no professional way to build a reputation."

**Key point to land:** the problem is two-sided — *customers can't find trusted
help quickly*, and *handymen can't find steady work or build trust*.

---

## 3. The Solution (30 seconds)

> "KwikFix solves this with a two-sided real-time marketplace. A customer picks
> a service, gets matched with a registered handyman, and books them in
> minutes. A handyman sees new job requests **appear live** on their dashboard,
> accepts with one tap, and the customer instantly sees who's coming and their
> live ETA. Every handyman is registered with real credentials and identity
> verification — so customers always know who's at their door."

---

## 4. Demo Flow (4–5 minutes)

**Setup ahead of time:** two browser windows logged in — one customer, one
handyman (or use `npm run dev` with demo mode, or two real accounts).
Prepare two accounts in advance so you don't sign up live.

### Stop 1 — Landing page (15 sec)
> "The landing page is the front door — services offered, how it works, why
> trust us. Two clear entry points: 'Book a handyman' for customers, and
> 'I offer services' for handymen."

### Stop 2 — Customer books a job (45 sec)
Click **Book a handyman** → pick a service (e.g. Plumbing) →
Booking form: address, task description, date, time preference.
> "Notice the validation — the form won't let you book without an address,
> description, date, and time. Customers can also choose 'Use My Live
> Location'."

Submit → matching screen.
> "This is the fun part — KwikFix scans the **registered handymen directory**,
> prioritizes handymen whose niche covers the service, and prefers someone
> who's online right now."

→ Handyman profile (show rating, **NIN Verified** badge, online status,
portfolio, experience).
> "Every handyman shown here has a real account. We never fabricate handymen —
> customers can only ever connect to someone who actually registered."

Set/confirm price → confirm booking → success screen.
> "Booking confirmed. It's live in the database right now."

### Stop 3 — The real-time moment (45 sec — the wow moment)
Switch to the handyman window.
> "And watch this — the job just appeared on the handyman's dashboard **live**,
> with the price and what they earn after the 2% platform commission."

Tap **Accept Job** → switch back to the customer window.
> "Instantly, the customer sees the acceptance, who accepted, and a **live ETA
> countdown** — the handyman is 'on the way', with minutes and a progress bar
> ticking down."

*Explain briefly:* the ETA is a simulated journey across Umuahia — computed
from distance (Haversine math) and a travel speed, and **recomputed on both
sides with zero extra database writes**. That's why it ticks live for everyone.

### Stop 4 — Active job + chat + completion (45 sec)
Open the active job screen (show both sides).
> "Both sides see the same job: provider, client, address, agreed price, and
> the live ETA tracker — 'arrived' when the journey completes."

Show **Chat** (customer ↔ handyman, real-time).
> "Chat is real-time too, and it's smartly locked — it only unlocks once the
> handyman accepts the job, so customers are never spammed before they have a
> professional."

**End Job** on one side.
> "Ending a job requires **both parties to confirm** — the customer ends it,
> the handyman gets a notification to confirm, and only then does the job
> become 'completed'. No one can unilaterally close a job."

### Stop 5 — Handyman dashboard, earnings & withdrawals (30 sec)
> "Back on the handyman side — a wallet balance, active jobs, past jobs with
> earnings and the 2% commission shown transparently, and a notifications
> feed. Withdrawal requests are persisted to the database with proper
> validation and a confirmation step — this isn't a demo-only flow."

### Stop 6 — Handyman registration (60 sec, only if time allows)
Show **I offer services** → the 5-step onboarding: personal info →
qualifications & past work → **identity verification (NIN)** → account/email
verification → final setup with permissions.
> "This is the trust layer. The NIN is checked against a national ID-style
> lookup, and the verified identity is stored with the profile. Handymen also
> get an email verification link on sign-up, and their status (Available /
> Working / Offline) is broadcast live so customers see it everywhere."

### Bonus stops (if time): 
- **Presence**: log out / close the window → handyman flips to offline
  automatically (Firebase `onDisconnect`).
- **DIY SOS Emergency**: an urgent-care chat/call screen with a premium
  paywall — shows product-thinking for monetization.

---

## 5. Technologies (45 seconds — one line each)

| Tech | What it does here |
|---|---|
| **React 19** | UI — components, hooks, context for global state |
| **Vite 8** | Dev server & build tool; **lazy-loaded routes + vendor code-splitting** for fast loading |
| **Tailwind CSS v4** | Styling — the dark navy/orange design system, fully responsive, mobile-first |
| **React Router 7** | Routing + **role-based route guards** (customers can't open handyman pages and vice versa) |
| **Firebase Authentication** | Email/password accounts, email verification |
| **Firebase Realtime Database** | The live data layer — bookings, job feed, chat, notifications, presence sync instantly |
| **Firebase security rules** | Server-side rules: only participants can read a chat or job; customers can't write the handyman's job record |
| **lucide-react** | Icon set (fast, tree-shakeable) |
| **Mock data layer** (`src/lib/mockData.js`) | Simulates NIN verification and the live journey, so the demo works without external APIs |

---

## 6. Challenges I solved (45 seconds)

- **Two-sided real-time sync.** A booking is mirrored across multiple nodes —
  `bookings`, `availableJobs`, `jobs` — and kept consistent. One acceptance
  atomically updates all of them and notifies the customer.
- **Security boundaries.** The database rules are carefully written so a
  handyman can't write the customer's booking record, chat is only readable
  by conversation participants, and only the owner can modify their profile.
- **A live ETA without a live backend.** Instead of writing GPS data every
  second, the journey is **deterministic** — both sides recompute progress
  from the start time and duration locally. Live countdown, zero writes.
- **No fabricated handymen.** The customer can only ever be matched with a
  handyman who has a real Firebase account — even accounts created in the
  Firebase console are auto-bootstrapped into the directory on first login.
- **Resilience.** Permission-denied listeners are caught and logged without
  crashing the app, and if Firebase isn't configured, the whole app falls back
  to **demo mode** so the UI stays fully browsable.
- **Performance.** Route-level code splitting with grouped vendor bundles
  keeps first load fast.

---

## 7. What I learned

> "Building KwikFix taught me to think in **real-time state**, not just
> request/response: how to design data models that multiple users read and
> write simultaneously, how to secure shared data, and how to make
> asynchronous UX feel instant — the acceptance moment, the live countdown,
> the presence dots. I also got much better at translating a real-world
> problem — trust in the informal sector — into concrete product decisions."

---

## 8. Future improvements (30 seconds — be honest)

- Real GPS location instead of the simulated journey (currently mock data)
- Real NIN/BVN verification via a provider like VerifyMe (currently mock)
- Ratings & reviews that actually persist to each handyman's profile
- Admin dashboard to verify handymen and review withdrawals
- In-app payments (Paystack/Flutterwave) instead of bank-transfer-style
  withdrawals
- Push notifications (FCM) so acceptance pings work outside the app

---

## 9. Closing (30 seconds)

> "KwikFix is my take on a problem everyone in this room knows: finding
> someone you can trust to fix your home. What started as a frontend project
> became a full real-time product — two-sided dashboards, live job matching,
> live tracking, chat, and a security model that keeps it honest. It taught me
> that great frontend work isn't just about pixels — it's about building
> interfaces that make distributed systems feel effortless for real people.
> Thank you — I'd love to hear your questions."

---

## Pro tips

- **Rehearse the window switches.** The wow moment is the job appearing live —
  practice the handyman/customer switch so it looks effortless.
- **Have accounts ready.** Log both in before you start; don't sign up live.
- **Keep it conversational.** The talking points above are a script to memorize
  the *order*, not word-for-word. Speak naturally.
- **If the live demo breaks** — never panic. Say: "That's exactly why I built
  a demo mode — let me show you the flow regardless," and reload in demo mode.