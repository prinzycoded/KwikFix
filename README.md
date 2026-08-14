# KwikFix

Connect with trusted, vetted handymen in Abia State.

Real-time customer ↔ handyman platform: bookings appear live for handymans,
acceptance pings the customer instantly, and jobs/chat/notifications/presence
all sync in real time through Firebase Realtime Database.

## Setup

```bash
npm install
npm run dev
```

## Firebase Configuration

KwikFix uses **Firebase Authentication** (email/password) and the
**Realtime Database** for all shared, real-time data.

### 1. Create a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a project.
2. **Authentication** → Get started → enable the **Email/Password** provider.
3. (Optional) Enable **Google** or **Phone** providers — the app supports whichever
   providers you enable, but the UI currently only wires up Email/Password.
4. **Realtime Database** → Create database → production mode → copy the
   `https://<project>-default-rtdb.firebaseio.com` URL.
5. **Realtime Database → Rules** — paste the rules from `database.rules.json`
   (in this repo). **Important: the app reads the rules from your Firebase
   project, not from the repo — if you get `permission_denied` in the app, the
   console rules are stale or incomplete.** To publish the repo rules straight
   from the CLI:
   ```bash
   npx firebase login
   npx firebase use <your-project-id>
   npm run deploy:rules
   ```
   Or manually: Console → Realtime Database → Rules → replace with the file's
   content → **Publish**. You can verify a rule with the console's **Rules
   Playground** (simulate a write as "Authenticated user").
6. **Project settings** → Your apps → Web app (`</>`) → register the app and copy the SDK config values.

### 2. Add your config to `.env`

```bash
cp .env.example .env
```

Then fill in the values from your Firebase console app settings:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Restart `npm run dev` after adding the values.

## Real-time data model

| Node | Who can read | Who can write | Purpose |
| --- | --- | --- | --- |
| `users/{uid}` | Self + handymans | Self | Profile (name, email, phone, role, niche) |
| `handymanProfiles/{uid}` | Self, handymans, admins | Self | Full handyman registration data (incl. verified NIN) |
| `registeredHandymen/{uid}` | All authenticated | Self | Public directory of handymen with a Firebase account — the only handymen a customer can be matched with |
| `bookings/{customerUid}/{bookingId}` | Customer + handymans | Customer creates; assigned handyman updates | The booking record + live status (`pending` → `accepted` → `active` → `completed`) + `tracking` (simulated journey) |
| `availableJobs/{bookingId}` | Handymans only | Customer creates; handyman removes on claim | The live "job feed" handymans watch |
| `jobs/{handymanUid}/{bookingId}` | Handyman (self) | Handyman; customer writes end-state | The handyman's active/past job mirror |
| `notifications/{uid}/{notifId}` | Self | Self + counterparty (`fromUid`) | In-app real-time alerts |
| `messages/{convoId}/{msgId}` | Conversation participants | Conversation participants | Real-time chat |
| `presence/{uid}` | All authenticated | Self (+ auto-offline on disconnect) | Online/working/offline status |
| `withdrawals/{uid}/{id}` | Self | Self | Withdrawal requests |

## Real-time flows (how it works end to end)

1. **Customer books** → `HandymanProfile.jsx` writes `bookings/{customerUid}/...`
   and mirrors it to `availableJobs/`. The success screen listens live and shows
   *"Waiting for a KWIKFIXER…"*
2. **Handyman accepts** → `HandymanDashboard.jsx` **Accept Job** writes
   `jobs/{handymanUid}/...`, updates the booking to `accepted`, removes the job
   from `availableJobs/`, pushes a notification to the customer, and **auto-starts
   a live ETA journey** (`tracking` on the booking).
3. **Customer sees it live** → `SuccessScreen` / `CustomerDashboard` re-render
   instantly via their `bookings/{uid}` listener → *"Adebayo accepted — on the way"* + Track button.
4. **Live ETA** → the customer's screens tick down the simulated journey live
   (`~X min until arrival` → progress bar → *arrived*) in `ActiveJobScreen`,
   `SuccessScreen` and the dashboard card. The journey is deterministic
   (`startedAt` + `totalMinutes`), so both parties recompute it with zero extra writes.
5. **Job in progress** → both parties watch the same `endState` field;
   ending requires both confirmations (`customer_ended` + `handyman_ended` = `completed`).
6. **Chat** → both sides open the conversation `{customerUid}_{handymanUid}` and
   messages stream in real time. Typing is disabled until the job is accepted.
7. **Presence** → handymans toggle **Available / Working**; customers instantly
   see the status, and when a user disconnects, presence flips to `offline` automatically.
8. **Withdrawals** → requests are persisted under `withdrawals/{uid}` instead of being lost in memory.

## Authentication & verification

- Email/password sign-in + sign-up (customer and handyman flows).
- **Email verification** — sent automatically at sign-up; status visible in
  Settings with a "Send Link" button.
- Route guards: every shared-data page requires an authenticated account
  (`RequireAuth`), role-specific pages require the matching role, and authenticated
  users are redirected away from login pages.
- **Only registered handymen are connectable** — handymen register with a real
  Firebase Auth account (via the app or the Firebase console); registration
  writes `handymanProfiles/{uid}` and publishes them in `registeredHandymen/{uid}`.
  Customers are only ever matched with handymen from that directory. Accounts
  created directly in the Firebase console are bootstrapped on their first
  sign-in through the app.
- **NIN verification (mock data)** — the "Verify NIN" step checks the number
  against a mock NIMC database in `src/lib/mockData.js` (10 sample records).
  A NIN only passes if it exists there; the returned identity is stored in
  `handymanProfiles/{uid}/ninVerified` + `verifiedNinName` for future admin
  verification of `users/{uid}/isVerified`. Sample NINs: `12345678901`
  (ADEBayo OLAMIDE), `23456789012` (CHINWE OKAFOR), `34567890123` (EMEKA
  NWACHUKWU), `45678901234` (FATIMA BELLO), `56789012345` (JOHN IHEANACHO).

## What is stored where

| Data | Location |
| --- | --- |
| Email / password accounts | Firebase Authentication |
| User profiles (`users/{uid}`) | Firebase Realtime Database |
| Handyman directory (`registeredHandymen/{uid}`) | Firebase Realtime Database |
| Bookings, jobs, notifications, chat, presence, withdrawals | Firebase Realtime Database |
| NIN (verified via mock NIMC data) | `handymanProfiles/{uid}` (mock verification in `src/lib/mockData.js`) |
| Live ETA journey (`tracking` on bookings) | Firebase Realtime Database (simulated from `src/lib/mockData.js`) |

## Running without Firebase (demo mode)

If `.env` is empty, the app runs in demo mode: auth and real-time sync are
disabled, and data falls back to in-memory state so the UI stays browsable.