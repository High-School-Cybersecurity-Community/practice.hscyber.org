import { $ } from './dom.js';
import { groupByDifficulty } from './group.js';
import { checkFlag } from './verify.js';
import { loadSolved, saveSolved } from './storage.js';

const solved = loadSolved();
let total = 0;

function updateProgress() {
  const p = document.getElementById('prog');
  if (p) p.textContent = document.querySelectorAll('.ch.solved').length + ' of ' + total + ' solved';
}

function buildChallenge(c, cfg) {
  const d = $('details', 'ch'); d.dataset.cat = c.category.toLowerCase();
  if (solved.has(c.name)) d.classList.add('solved');
  const s = $('summary');
  s.append($('span', 'nm', c.name), $('span', 'cat', c.category));
  if (c.author) s.append($('span', 'au', 'by ' + c.author));
  s.append($('span', 'ok', 'Solved'));
  const b = $('div', 'body');

  if (c.description) {
    const md = $('div', 'md');
    md.innerHTML = DOMPurify.sanitize(marked.parse(c.description));
    b.append(md);
  }
  if (c.conn) {
    const w = $('div', 'conn'), code = $('code', null, c.conn), cp = $('button', 's', 'Copy');
    cp.type = 'button';
    cp.onclick = async () => {
      try { await navigator.clipboard.writeText(c.conn); cp.textContent = 'Copied'; setTimeout(() => cp.textContent = 'Copy', 1500); }
      catch (e) { cp.textContent = 'Copy failed'; }
    };
    w.append(code, cp); b.append(w);
  }
  if (c.files.length) {
    const f = $('div', 'files');
    c.files.forEach(u => { const a = $('a', null, u.split('/').pop()); a.href = u; a.setAttribute('download', ''); f.append(a); });
    b.append(f);
  }
  c.hints.forEach((h, i) => {
    const hd = $('details', 'hint'); hd.append($('summary', null, 'Hint ' + (i + 1)), $('div', null, h)); b.append(hd);
  });
  if (c.tags.length) b.append($('div', 'tags', 'Tags: ' + c.tags.join(', ')));

  const form = $('form', 'flag'), inp = $('input'), btn = $('button', null, 'Check flag'), msg = $('p', 'msg');
  inp.type = 'text'; inp.placeholder = 'oo{...}'; inp.autocomplete = 'off'; inp.spellcheck = false;
  inp.setAttribute('aria-label', 'Flag for ' + c.name);
  btn.type = 'submit'; msg.setAttribute('aria-live', 'polite');
  form.onsubmit = async e => {
    e.preventDefault();
    const v = inp.value.trim(); if (!v) return;
    btn.disabled = true; btn.textContent = 'Checking…'; msg.className = 'msg'; msg.textContent = '';
    try {
      if (await checkFlag(c, v, cfg)) {
        msg.className = 'msg good'; msg.textContent = 'Correct. Nice work.';
        d.classList.add('solved'); solved.add(c.name); saveSolved(solved); updateProgress();
      } else { msg.className = 'msg bad'; msg.textContent = 'Not the flag. Check the format and try again.'; }
    } catch (err) {
      msg.className = 'msg bad'; msg.textContent = 'Couldn’t check this flag: the challenge’s salt or hash is not valid base64.';
    }
    btn.disabled = false; btn.textContent = 'Check flag';
  };
  form.append(inp, btn);
  b.append(form, msg);
  d.append(s, b);
  return d;
}

function applyFilter(cat, buttons) {
  buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
  document.querySelectorAll('.ch').forEach(r => r.hidden = cat !== 'all' && r.dataset.cat !== cat);
  document.querySelectorAll('#main section').forEach(sec => sec.hidden = ![...sec.querySelectorAll('.ch')].some(r => !r.hidden));
}

export function render(list, cfg) {
  const main = document.getElementById('main'); main.textContent = '';
  total = list.length;
  groupByDifficulty(list).forEach(g => {
    const sec = $('section'); sec.style.setProperty('--d', g.color);
    const h = $('h2', null, g.name);
    h.append($('small', null, g.items.length + (g.items.length === 1 ? ' challenge' : ' challenges')));
    sec.append(h); g.items.forEach(c => sec.append(buildChallenge(c, cfg))); main.append(sec);
  });
  const bar = document.getElementById('bar'); bar.hidden = false;
  const cats = ['all', ...new Set(list.map(c => c.category.toLowerCase()))];
  const buttons = cats.map(k => {
    const b = $('button', null, k === 'all' ? 'All' : k); b.type = 'button'; b.dataset.cat = k;
    b.onclick = () => applyFilter(k, buttons); return b;
  });
  const prog = $('span'); prog.id = 'prog';
  bar.append(...buttons, prog);
  applyFilter('all', buttons); updateProgress();
}
