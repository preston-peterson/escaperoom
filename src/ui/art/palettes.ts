import type { PaletteId } from '../../engine/types.ts';

/**
 * Named color themes applied to scenes as CSS custom properties, so the same
 * primitives recolor per room/world. Keys become `--p-*` vars on the scene svg.
 */
export interface Palette {
  skyTop: string; // upper background (cave dark)
  skyBottom: string; // lower background glow
  wallDark: string;
  wallMid: string;
  wallLight: string;
  floor: string;
  glow: string; // torch/ember light
  accent: string; // detail color (glyphs, mechanisms)
  water: string;
  fog: string;
}

export const palettes: Record<PaletteId, Palette> = {
  cavern: {
    skyTop: '#0a0705',
    skyBottom: '#241610',
    wallDark: '#171009',
    wallMid: '#2b1d12',
    wallLight: '#45301d',
    floor: '#1d130c',
    glow: '#e8963f',
    accent: '#c8a06a',
    water: '#3d6a78',
    fog: '#8a7358',
  },
  waterworks: {
    skyTop: '#060a0c',
    skyBottom: '#12242b',
    wallDark: '#0e1619',
    wallMid: '#1c2e33',
    wallLight: '#2f4a50',
    floor: '#121d20',
    glow: '#7fc4d8',
    accent: '#8fb5a0',
    water: '#3d7d94',
    fog: '#5c7d85',
  },
  gearworks: {
    skyTop: '#0b0805',
    skyBottom: '#2b1a0c',
    wallDark: '#1a1008',
    wallMid: '#332112',
    wallLight: '#54371c',
    floor: '#221509',
    glow: '#f0a548',
    accent: '#b87f33',
    water: '#4a5d3d',
    fog: '#7d6a4a',
  },
  crypt: {
    skyTop: '#070809',
    skyBottom: '#161d1a',
    wallDark: '#10140f',
    wallMid: '#1f2b22',
    wallLight: '#354538',
    floor: '#141c15',
    glow: '#9fd8a8',
    accent: '#7da885',
    water: '#2e5248',
    fog: '#5a7361',
  },
  heart: {
    skyTop: '#0c0505',
    skyBottom: '#361008',
    wallDark: '#1c0a06',
    wallMid: '#38150c',
    wallLight: '#5c2412',
    floor: '#260e07',
    glow: '#ff7b38',
    accent: '#e8963f',
    water: '#8c3d2a',
    fog: '#8a5540',
  },
};

export function paletteVars(id: PaletteId): Record<string, string> {
  const p = palettes[id] ?? palettes.cavern;
  return {
    '--p-sky-top': p.skyTop,
    '--p-sky-bottom': p.skyBottom,
    '--p-wall-dark': p.wallDark,
    '--p-wall-mid': p.wallMid,
    '--p-wall-light': p.wallLight,
    '--p-floor': p.floor,
    '--p-glow': p.glow,
    '--p-accent': p.accent,
    '--p-water': p.water,
    '--p-fog': p.fog,
  };
}
