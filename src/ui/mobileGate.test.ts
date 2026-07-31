import { describe, expect, it } from 'vitest';
import { gateReason, MIN_PLAYABLE_WIDTH, MIN_TOUCH_WIDTH } from './mobileGate.ts';

const touch = (width: number, height: number) => ({ coarsePointer: true, width, height });
const mouse = (width: number, height: number) => ({ coarsePointer: false, width, height });

describe('gateReason', () => {
  it('asks a phone held upright to turn', () => {
    expect(gateReason(touch(390, 844))).toBe('rotate');
    expect(gateReason(touch(768, 1024))).toBe('rotate'); // tablet portrait too
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
