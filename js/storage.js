import { SOLVED_KEY } from './config.js';

export function loadSolved() {
  try { return new Set(JSON.parse(localStorage.getItem(SOLVED_KEY) || '[]')); } catch (e) { return new Set(); }
}
export function saveSolved(set) {
  try { localStorage.setItem(SOLVED_KEY, JSON.stringify([...set])); } catch (e) { /* storage unavailable */ }
}
