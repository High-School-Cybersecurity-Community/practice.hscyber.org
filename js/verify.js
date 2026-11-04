const b64 = s => Uint8Array.from(atob(s.trim()), ch => ch.charCodeAt(0));

/* Argon2id check. `argon2` is a global from argon2-browser.
   Salt and expected hash are base64; output length matches the stored hash. */
export async function checkFlag(c, flag, cfg) {
  const want = b64(c.hash);
  const r = await argon2.hash({
    pass: flag, salt: b64(c.salt), time: cfg.t, mem: cfg.m, parallelism: cfg.p,
    hashLen: want.length, type: argon2.ArgonType.Argon2id
  });
  if (r.hash.length !== want.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i++) diff |= want[i] ^ r.hash[i];
  return diff === 0;
}
