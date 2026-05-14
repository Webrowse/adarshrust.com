'use client';

import { useThree } from '@react-three/fiber';
import { Gear } from './Gear';

/**
 * Strict vertical gear column at each viewport edge.
 *
 * All three gears in a column share the same X coordinate (just inside the
 * viewport edge). They stack purely vertically, meshing tooth-on-tooth.
 * The outer-facing teeth protrude past the screen edge for a
 * "machinery continues offscreen" feel.
 *
 * Meshing distances (center-to-center, all vertical):
 *   Large (R=1.30) ─ Medium (R=0.75) = 2.05
 *   Medium (R=0.75) ─ Small  (R=0.45) = 1.20
 *
 * Gear ratios (rim velocity matches at contact):
 *   ω_L =  1.000
 *   ω_M = −1.733   (opposite direction of L; 1.30/0.75)
 *   ω_S = +2.889   (same direction as L; 1.733 × 0.75/0.45)
 *
 * Right column mirrors all signs so the columns sweep outward symmetrically.
 */
export function GearColumns() {
  const { viewport } = useThree();

  // Bring the gear column INWARD so it fills the side third of the viewport.
  // On wide screens, inset is ~1.1 (gear bodies clearly on-screen, only outer
  // teeth clip past the edge). On narrow viewports, inset clamps down so the
  // gears don't smash into the center content.
  const inset = Math.min(1.25, Math.max(0.45, viewport.width * 0.15));
  const xEdge = viewport.width / 2 - inset;

  // Vertical chain, centered slightly above middle so the chain feels
  // weighted to the upper portion of the viewport (large gear up high).
  const yLarge = 1.4;
  const yMedium = yLarge - 2.05; // -0.65
  const ySmall = yMedium - 1.2; // -1.85

  const renderSide = (side: 'left' | 'right') => {
    const sign = side === 'left' ? -1 : 1;
    const x = sign * xEdge;
    return (
      <group key={side}>
        <Gear
          size="large"
          position={[x, yLarge, 0]}
          speed={sign * 1.0}
          phase={0}
        />
        <Gear
          size="medium"
          position={[x, yMedium, 0]}
          speed={sign * -1.733}
          phase={0.157} // half-tooth-pitch offset for visual interlock
        />
        <Gear
          size="small"
          position={[x, ySmall, 0]}
          speed={sign * 2.889}
          phase={0}
        />
      </group>
    );
  };

  return (
    <>
      {renderSide('left')}
      {renderSide('right')}
    </>
  );
}
