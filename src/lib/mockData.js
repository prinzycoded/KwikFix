// ---------------------------------------------------------------------------
// KwikFix mock data (demo / simulation layer)
//
// These are stand-ins for real external integrations:
//  - NIN verification    -> a mock "National Identification Database"
//  - Live location       -> simulated handyman journeys across Umuahia
//
// A handyman is ALWAYS a real Firebase Auth account. This module never
// fabricates accounts — it only supplies the data those accounts verify
// against and the coordinates used to simulate a journey.
// ---------------------------------------------------------------------------

// ---------- mock NIN database ----------
// Simulates the NIMC national database. In production this would be an API
// call (e.g. VerifyMe / NIMC integration). A NIN only passes verification
// if it exists here — anything else is treated as "not found".
export const MOCK_NIN_RECORDS = [
  { nin: '12345678901', fullName: 'ADEBayo OLAMIDE', dateOfBirth: '1994-05-14' },
  { nin: '23456789012', fullName: 'CHINWE OKAFOR', dateOfBirth: '1991-11-02' },
  { nin: '34567890123', fullName: 'EMEKA NWACHUKWU', dateOfBirth: '1989-02-27' },
  { nin: '45678901234', fullName: 'FATIMA BELLO', dateOfBirth: '1996-08-19' },
  { nin: '56789012345', fullName: 'JOHN IHEANACHO', dateOfBirth: '1992-12-05' },
  { nin: '67890123456', fullName: 'GRACE ADELEKE', dateOfBirth: '1995-03-30' },
  { nin: '78901234567', fullName: 'CHUKWUEMEKA EBERE', dateOfBirth: '1990-07-22' },
  { nin: '89012345678', fullName: 'IBRAHIM MUSA', dateOfBirth: '1988-09-11' },
  { nin: '90123456789', fullName: 'NGOZI UMEH', dateOfBirth: '1993-01-17' },
  { nin: '01234567890', fullName: 'TOCHUKWU ONYEKA', dateOfBirth: '1997-04-08' },
];

const NIN_LOOKUP = new Map(MOCK_NIN_RECORDS.map((r) => [r.nin, r]));

/**
 * Checks a NIN against the mock national database.
 * TEST MODE: any valid 11-digit NIN passes verification — nothing is
 * actually looked up. The caller's name is echoed back as the NIMC record.
 * @param {string} nin - 11-digit National Identification Number
 * @param {string} [name] - fallback name to echo back (e.g. the applicant's name)
 * @returns {{ nin: string, fullName: string, dateOfBirth: string } | null}
 */
export function verifyNinWithMockData(nin, name = '') {
  const cleaned = String(nin || '').replace(/\D/g, '');
  if (cleaned.length !== 11) return null;
  return {
    nin: cleaned,
    fullName: (name || 'KwikFix Test User').toUpperCase(),
    dateOfBirth: '1990-01-01',
  };
}

// ---------- mock map: areas of Umuahia (Abia State) ----------
// Used to simulate a handyman's journey to the customer's location.
export const UMUAHIA_AREAS = [
  { name: 'Azikiwe Road', lat: 5.5244, lng: 7.4912 },
  { name: 'World Bank Housing Estate', lat: 5.5149, lng: 7.5004 },
  { name: 'Agbama Housing Estate', lat: 5.5147, lng: 7.4804 },
  { name: 'Umuahia Central Market', lat: 5.5294, lng: 7.4951 },
  { name: 'Umudike', lat: 5.4813, lng: 7.5402 },
  { name: 'Nkata Street', lat: 5.5321, lng: 7.5062 },
  { name: 'UBA Road', lat: 5.5277, lng: 7.4868 },
  { name: 'Ohanku Road', lat: 5.5211, lng: 7.5129 },
  { name: 'Ihiagwa Road', lat: 5.5398, lng: 7.4684 },
  { name: 'Bende Road', lat: 5.5482, lng: 7.5236 },
];

export function getAreaByName(customerAddress = '') {
  const haystack = String(customerAddress || '').toLowerCase();
  return (
    UMUAHIA_AREAS.find((a) => haystack.includes(a.name.toLowerCase())) ||
    null
  );
}

// ---------- journey simulation ----------
const MOCK_TRAVEL_SPEED_KMH = 24; // city traffic

const haversineKm = (a, b) => {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Builds the initial tracking state for a simulated handyman journey.
 *
 * Deterministic: both parties recompute progress/ETA from `startedAt` +
 * `totalMinutes`, so no periodic writes are needed — the customer's screen
 * ticks down live even if the handyman closes the app.
 *
 * @param {string} customerArea - the customer's area (e.g. "Azikiwe Road")
 * @returns {{ status: 'enroute', fromArea: string, toArea: string, distanceKm: number, totalMinutes: number, startedAt: string }}
 */
export function buildMockJourney(customerArea) {
  const to = getAreaByName(customerArea) || pick(UMUAHIA_AREAS);
  let from = pick(UMUAHIA_AREAS);
  if (from.name === to.name) from = UMUAHIA_AREAS[(UMUAHIA_AREAS.indexOf(from) + 3) % UMUAHIA_AREAS.length];
  const distanceKm = Math.max(1, Math.round(haversineKm(from, to) * 10) / 10);
  const totalMinutes = Math.max(2, Math.ceil((distanceKm / MOCK_TRAVEL_SPEED_KMH) * 60));
  return {
    status: 'enroute',
    fromArea: from.name,
    toArea: to.name,
    distanceKm,
    totalMinutes,
    startedAt: new Date().toISOString(),
  };
}

/**
 * Computes the current live state of a journey at time `now`.
 * @param {object} tracking - the tracking object stored on the booking
 * @param {number} [now] - epoch ms override (for tests/demo)
 */
export function getLiveTracking(tracking, now = Date.now()) {
  if (!tracking) {
    return { status: 'none', progress: 0, etaMinutes: 0, distanceKm: 0 };
  }
  if (tracking.status === 'completed') {
    return { ...tracking, progress: 1, etaMinutes: 0 };
  }
  if (!tracking.startedAt) {
    return { status: 'none', progress: 0, etaMinutes: 0, distanceKm: 0 };
  }
  const totalMinutes = Number(tracking.totalMinutes || 0);
  const elapsed = Math.max(0, (now - new Date(tracking.startedAt).getTime()) / 60000);
  const progress = totalMinutes > 0 ? Math.min(elapsed / totalMinutes, 1) : 1;
  const etaMinutes = Math.max(0, Math.ceil(totalMinutes - elapsed));
  return {
    ...tracking,
    progress,
    etaMinutes,
    status: progress >= 1 ? 'arrived' : tracking.status,
  };
}
