// Site settings. Edit here.
// The year comes from the URL: /2026/... -> 2026 ('26), /2027/... -> 2027 ('27).
// Outside a year folder it falls back to the current year.
const m = location.pathname.match(/\/(20\d{2})(?=\/|$)/);
export const YEAR = m ? m[1] : String(new Date().getFullYear());
export const YY = YEAR.slice(2);
export const CHALLENGES_URL = `/${YEAR}/challenges.xml`;
export const SOLVED_KEY = `oo${YY}-practice-solved`;
export const DEFAULT_ARGON = { t: 5, m: 1024, p: 1 };   // used only if <hash> is missing from the XML

// Display order and colour of each difficulty group.
export const DIFFICULTIES = [
  { name: 'Beginners', color: '#e8c9a0' },
  { name: 'Easy',      color: '#e3a857' },
  { name: 'Medium',    color: '#e07b3c' },
  { name: 'Hard',      color: '#d2452f' },
  { name: 'Insane',    color: '#b0264a' }
];
