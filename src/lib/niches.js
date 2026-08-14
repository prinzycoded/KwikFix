// Single source of truth for handyman niches and how customer services
// map to them. All comparisons happen on normalized lowercase snake_case
// keys so legacy values ("Generator Repair", "generator repair", "mechanic")
// always match the same canonical key.

export const NICHES = [
  { key: 'plumbing', label: 'Plumbing' },
  { key: 'electrical', label: 'Electrical' },
  { key: 'carpentry', label: 'Carpentry' },
  { key: 'mechanic', label: 'Mechanic' },
];

export const SERVICE_LABELS = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  generator_repair: 'Generator Repair',
  carpentry: 'Carpentry',
};

// Which handyman niches can serve each customer service.
export const SERVICE_TO_NICHES = {
  plumbing: ['plumbing'],
  electrical: ['electrical'],
  generator_repair: ['mechanic', 'electrical'],
  carpentry: ['carpentry'],
};

export const normalizeNiche = (value) =>
  String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, '_');

// A handyman's niches: the new array field (`niches`) or the legacy single
// `niche` string. Returns a normalized, de-duplicated list.
export const getHandymanNiches = (handyman) => {
  const raw = Array.isArray(handyman?.niches) && handyman.niches.length
    ? handyman.niches
    : handyman?.niche
      ? [handyman.niche]
      : [];
  return [...new Set(raw.map(normalizeNiche).filter(Boolean))];
};

// Whether a registered handyman's profile covers the requested service.
// A handyman with no niche selected is never matchable.
export const handymanMatchesService = (handyman, service) => {
  const required = SERVICE_TO_NICHES[String(service || '').toLowerCase()];
  if (!required || !handyman) return false;
  const niches = getHandymanNiches(handyman);
  if (niches.length === 0) return false;
  return niches.some((n) => required.includes(n));
};

export const nicheLabel = (key) =>
  NICHES.find((n) => n.key === normalizeNiche(key))?.label || key;

export const nichesLabel = (niches) =>
  (niches || []).map(nicheLabel).filter(Boolean).join(', ');