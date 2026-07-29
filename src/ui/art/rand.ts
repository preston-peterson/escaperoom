/** Deterministic PRNG for art variation — same seed, same stones. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function num(
  props: Record<string, string | number | boolean> | undefined,
  key: string,
  fallback: number,
): number {
  const v = props?.[key];
  return typeof v === 'number' ? v : fallback;
}

export function bool(
  props: Record<string, string | number | boolean> | undefined,
  key: string,
  fallback: boolean,
): boolean {
  const v = props?.[key];
  return typeof v === 'boolean' ? v : fallback;
}

export function str(
  props: Record<string, string | number | boolean> | undefined,
  key: string,
  fallback: string,
): string {
  const v = props?.[key];
  return typeof v === 'string' ? v : fallback;
}
