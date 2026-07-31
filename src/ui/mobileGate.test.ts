import { describe, expect, it } from 'vitest';
import { gateReason, MIN_PLAYABLE_WIDTH } from './mobileGate.ts';

describe('gateReason', () => {
  it('gates touch devices regardless of width', () => {
    expect(gateReason({ coarsePointer: true, width: 390 })).toBe('touch');
    // a big tablet is still a tablet — no hover means no hotspot discovery
    expect(gateReason({ coarsePointer: true, width: 1366 })).toBe('touch');
  });

  it('gates a too-narrow window on a real pointer device as "narrow", not "touch"', () => {
    expect(gateReason({ coarsePointer: false, width: MIN_PLAYABLE_WIDTH - 1 })).toBe('narrow');
  });

  it('lets a wide pointer-driven window through', () => {
    expect(gateReason({ coarsePointer: false, width: MIN_PLAYABLE_WIDTH })).toBeNull();
    expect(gateReason({ coarsePointer: false, width: 2560 })).toBeNull();
  });
});
