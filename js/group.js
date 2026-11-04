import { DIFFICULTIES } from './config.js';

// Order of categories inside each difficulty group (same order as the generator's menu).
// Categories not listed here go after these, in the order they first appear in challenges.xml.
export const CATEGORY_ORDER = ['crypto', 'web', 'pwn', 'rev', 'forensics', 'osint', 'misc'];

/* Sorts one difficulty group so each category sits together.
   The sort is stable, so challenges keep their challenges.xml order within a category. */
function sortByCategory(items) {
  const rank = new Map(CATEGORY_ORDER.map((c, i) => [c, i]));
  for (const c of items) {
    const k = c.category.toLowerCase();
    if (!rank.has(k)) rank.set(k, rank.size);
  }
  return items.sort((a, b) => rank.get(a.category.toLowerCase()) - rank.get(b.category.toLowerCase()));
}

/* Groups challenges by difficulty in the fixed order from config.js, then by category.
   "Beginner" is accepted for "Beginners". Unknown difficulties are appended last. */
export function groupByDifficulty(list) {
  const norm = s => (s || '').trim().toLowerCase();
  const known = d => DIFFICULTIES.find(o => norm(o.name) === norm(d) || norm(o.name) === norm(d) + 's');
  const groups = DIFFICULTIES.map(o => ({ name: o.name, color: o.color, items: [] }));
  const extra = {};
  for (const c of list) {
    const k = known(c.difficulty);
    if (k) groups.find(g => g.name === k.name).items.push(c);
    else (extra[c.difficulty || 'Other'] ||= { name: c.difficulty || 'Other', color: '#a3a7c2', items: [] }).items.push(c);
  }
  return groups.concat(Object.values(extra))
    .filter(g => g.items.length)
    .map(g => ({ ...g, items: sortByCategory(g.items) }));
}
