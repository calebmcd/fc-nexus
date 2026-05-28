// Shared stateless utilities extracted from the Tampermonkey userscript.
// Note: The userscript does not import these yet (no build pipeline).

export const formatMmDdYyyy = (date) =>
  `${(`0${date.getMonth() + 1}`).slice(-2)}/${(`0${date.getDate()}`).slice(-2)}/${date.getFullYear()}`;

export const buildFilterDateRange = (lookbackDays, now = new Date()) => {
  const d = new Date(now);
  const end = formatMmDdYyyy(d);
  d.setDate(d.getDate() - lookbackDays);
  return `${formatMmDdYyyy(d)} - ${end}`;
};

// Regex sanitization helper (safe for building dynamic RegExp patterns).
export const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// String normalization helper extracted from `Utils.suggestClinicAcronym` (kept identical).
export const normalizeClinicNameForMatch = (str) => {
  return String(str || '')
    .replace(/[.,\-\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (w) =>
        ![
          'veterinary',
          'vet',
          'animal',
          'anim',
          'hospital',
          'hosp',
          'clinic',
          'center',
          'ctr',
          'care',
          'services',
          'inc',
          'llc',
          'of',
        ].includes(w),
    )
    .join(' ')
    .trim();
};

// Stateless versions of the userscript’s formatting helpers.
export const toTitleCase = (str, acronyms = []) => {
  return String(str || '').replace(/\w\S*/g, (txt) => {
    const upper = txt.toUpperCase();
    if (acronyms.includes(upper)) return upper;
    if (!/[aeiouy]/i.test(txt)) return upper;
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const formatPet = (name, acronyms = []) => toTitleCase(name, acronyms);

export const suggestClinicAcronym = (userInput, clinicMap) => {
  if (!userInput) return null;
  const inputClean = normalizeClinicNameForMatch(userInput);
  if (!inputClean) return null;

  for (const [fullName, acronym] of Object.entries(clinicMap || {})) {
    if (userInput.toUpperCase().trim() === String(acronym).toUpperCase()) return null;
    if (normalizeClinicNameForMatch(fullName) === inputClean) {
      return { original: fullName, acronym };
    }
  }
  return null;
};

export const formatFamily = (name, { acronyms = [], clinicMap = {} } = {}) => {
  if (!name) return '';

  const upperInput = String(name).toUpperCase().trim();
  const mapValues = Object.values(clinicMap);

  if (acronyms.includes(upperInput) || mapValues.includes(upperInput)) {
    return upperInput;
  }

  const match = suggestClinicAcronym(name, clinicMap);
  if (match) return match.acronym;

  const lower = String(name).toLowerCase();

  if (/(clinic|hospital|veterinary|vet)/.test(lower)) {
    return formatClinic(name, { acronyms, clinicMap });
  }

  if (/(rescue|society|animal|fund|county|shelter|sanctuary|foundation|league|project|trust|network)/.test(lower)) {
    return toTitleCase(name, acronyms);
  }

  const parts = String(name).trim().split(' ');
  return toTitleCase(parts[parts.length - 1], acronyms);
};

export const formatClinic = (name, { acronyms = [], clinicMap = {}, clinics = {} } = {}) => {
  if (!name) return '';

  const upperInput = String(name).toUpperCase().trim();
  const mapValues = Object.values(clinicMap);

  if (acronyms.includes(upperInput) || mapValues.includes(upperInput)) {
    return upperInput;
  }

  const match = suggestClinicAcronym(name, clinicMap);
  if (match) return match.acronym;

  if (clinics && clinics[upperInput]) return clinics[upperInput];
  const n = toTitleCase(name, acronyms);
  return n.replace(/Veterinary/g, 'Vet').replace(/Hospital/g, 'Hosp.').replace(/Animal/g, 'Anim.').replace(/Center/g, 'Ctr.');
};

