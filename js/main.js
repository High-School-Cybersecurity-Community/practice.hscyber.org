import { CHALLENGES_URL, YY } from './config.js';
import { parseXML } from './parser.js';
import { render } from './ui.js';

// Year-specific header text, taken from the URL (see config.js).
const set = (id, fn) => { const e = document.getElementById(id); if (e) fn(e); };
document.title = `Practice · Outback Overflow ’${YY}`;
set('title', e => e.textContent = `Outback Overflow ’${YY} practice`);
set('home',  e => e.href = `https://oo${YY}.hscyber.org/`);
set('logo',  e => { e.onerror = () => { e.hidden = true; }; e.src = `https://outbackoverflow${YY}.hscyber.org/media/logo.png`; });

const status = document.getElementById('status');
try {
  const res = await fetch(CHALLENGES_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Server returned ' + res.status + ' for ' + CHALLENGES_URL + '.');
  const { cfg, list } = parseXML(await res.text());
  if (!list.length) status.textContent = 'No visible challenges yet. Check back soon.';
  else render(list, cfg);
} catch (err) {
  status.textContent = 'Couldn’t load challenges. ' + err.message;
}
