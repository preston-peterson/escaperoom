import { describe, expect, it } from 'vitest';
import {
  gateReason,
  isDismissable,
  MIN_PLAYABLE_WIDTH,
  MIN_TOUCH_WIDTH,
} from './mobileGate.ts';

const touch = (width: number, height: number) => ({ coarsePointer: true, width, height });
const mouse = (width: number, height: number) => ({ coarsePointer: false, width, height });

describe('gateReason', () => {
  it('asks any upright touch device to turn — portrait is out of scope', () => {
    expect(gateReason(touch(390, 844))).toBe('rotate');
    expect(gateReason(touch(768, 1024))).toBe('rotate'); // tablets included
    expect(gateReason(touch(1024, 1366))).toBe('rotate'); // even a big one
  });

  it('offers no way past the rotate prompt, since turning always works', () => {
    expect(isDismissable('rotate')).toBe(false);
    // the others may be the best the user's hardware can do
    expect(isDismissable('small')).toBe(true);
    expect(isDismissable('narrow')).toBe(true);
  });

  it('lets a landscape phone or tablet play', () => {
    expect(gateReason(touch(844, 390))).toBeNull();
    expect(gateReason(touch(1024, 768))).toBeNull();
    expect(gateReason(touch(MIN_TOUCH_WIDTH, 400))).toBeNull();
  });

  it('turns away a landscape screen too small to lay out', () => {
    expect(gateReason(touch(MIN_TOUCH_WIDTH - 1, 400))).toBe('small');
  });

  it('asks a cramped pointer window to widen, and never calls it a phone', () => {
    expect(gateReason(mouse(MIN_PLAYABLE_WIDTH - 1, 800))).toBe('narrow');
    // a tall narrow desktop window is 'narrow', not 'rotate'
    expect(gateReason(mouse(700, 1200))).toBe('narrow');
  });

  it('lets a wide pointer window through', () => {
    expect(gateReason(mouse(MIN_PLAYABLE_WIDTH, 800))).toBeNull();
    expect(gateReason(mouse(2560, 1440))).toBeNull();
  });
});
