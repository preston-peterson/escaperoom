/**
 * Renders the app icons from the same SVG mark used as the favicon, so the
 * only binary assets in the repo are generated from our own vector art.
 *
 *   node scripts/make-icons.mjs
 *
 * Needs a Chromium binary (Playwright's cache, or CHROME env var). Icons are
 * committed, so this only reruns when the mark itself changes.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readdirSync, copyFileSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const OUT = 'public/icons';

/** The labyrinth mark: hex frame, ember at the centre. `pad` leaves safe area
 *  for maskable icons, whose corners get cropped by the OS. */
const mark = (size, pad) => {
  const c = size / 2;
  const r = (size / 2) * (1 - pad);
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
  }).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0d0a08"/>
  <polygon points="${hex}" fill="none" stroke="#e0a458" stroke-width="${size * 0.055}"/>
  <polygon points="${hex}" fill="none" stroke="#e0a458" stroke-width="${size * 0.03}" opacity="0.35"
           transform="scale(0.62) translate(${c * 0.61} ${c * 0.61})"/>
  <circle cx="${c}" cy="${c}" r="${size * 0.11}" fill="#f5c97b"/>
  <circle cx="${c}" cy="${c}" r="${size * 0.2}" fill="#e0a458" opacity="0.28"/>
</svg>`;
};

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const base = join(homedir(), '.cache/ms-playwright');
  for (const dir of readdirSync(base)) {
    if (!dir.startsWith('chromium-')) continue;
    for (const sub of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
      const p = join(base, dir, sub);
      try {
        execFileSync('test', ['-x', p]);
        return p;
      } catch {
        /* keep looking */
      }
    }
  }
  throw new Error('No Chromium found; set CHROME=/path/to/chrome');
}

mkdirSync(OUT, { recursive: true });
const chrome = findChrome();
const tmp = join(process.env.TMPDIR ?? '/tmp', `icon-${process.pid}`);
mkdirSync(tmp, { recursive: true });

for (const { name, size, pad } of [
  { name: 'icon-192.png', size: 192, pad: 0.08 },
  { name: 'icon-512.png', size: 512, pad: 0.08 },
  { name: 'icon-maskable-512.png', size: 512, pad: 0.22 },
]) {
  const svgPath = join(tmp, 'mark.svg');
  writeFileSync(svgPath, mark(size, pad));
  execFileSync(chrome, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--default-background-color=00000000',
    `--screenshot=${join(tmp, name)}`,
    `--window-size=${size},${size}`,
    `file://${svgPath}`,
  ]);
  // copy, not rename: /tmp is often a different filesystem
  copyFileSync(join(tmp, name), join(OUT, name));
  console.log(`wrote ${OUT}/${name}`);
}
rmSync(tmp, { recursive: true, force: true });
