import { DEFAULT_ARGON } from './config.js';

const kids = (el, n) => [...el.children].filter(c => c.localName === n);
const txt = (el, n) => { const c = kids(el, n)[0]; return c ? c.textContent.trim() : ''; };

/* Parses challenges.xml. Returns { cfg, list }.
   The file is wrapped in a root element first, so it works with or without its own root. */
export function parseXML(src) {
  const doc = new DOMParser().parseFromString('<root>' + src.replace(/<\?xml[^>]*\?>/, '') + '</root>', 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('challenges.xml is not valid XML.');
  const all = [...doc.getElementsByTagName('*')];

  // Top-level argon2 config is the <hash> that has a <t> child (not <flag><hash>).
  const c = all.find(e => e.localName === 'hash' && kids(e, 't').length);
  const cfg = c
    ? { t: +txt(c, 't') || DEFAULT_ARGON.t, m: +txt(c, 'm') || DEFAULT_ARGON.m, p: +txt(c, 'p') || DEFAULT_ARGON.p }
    : { ...DEFAULT_ARGON };

  const list = all.filter(e => e.localName === 'challenges').map(ch => {
    const flag = kids(ch, 'flag')[0];
    return {
      name: txt(ch, 'name'), author: txt(ch, 'author'), difficulty: txt(ch, 'difficulty'),
      category: txt(ch, 'category') || 'misc', description: txt(ch, 'description'),
      conn: txt(ch, 'connection_info'),
      salt: flag ? txt(flag, 'salt') : '', hash: flag ? txt(flag, 'hash') : '',
      files: kids(ch, 'files').map(f => f.textContent.trim()).filter(Boolean),
      hints: kids(ch, 'hints').map(h => txt(h, 'content')).filter(Boolean),
      tags: kids(ch, 'tags').map(t => t.textContent.trim()).filter(Boolean),
      state: (txt(ch, 'state') || 'visible').toLowerCase()
    };
  }).filter(ch => ch.state === 'visible' && ch.name);

  return { cfg, list };
}
