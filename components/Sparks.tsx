'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/scroll-store';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES } from '@/lib/themes';

const MAX_SPARKS = 220;

type SparkData = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number; // 0..1
  size: number;
};

export function Sparks() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const themeId = useThemeStore((s) => s.themeId);
  const theme = THEMES[themeId] ?? THEMES.workshop;

  // Meshing contact points line up with where adjacent gears touch in
  // GearColumns.tsx (vertical column, all gears at same x).
  const emitPoints = useMemo(() => {
    const inset = Math.min(1.25, Math.max(0.45, viewport.width * 0.15));
    const xEdge = viewport.width / 2 - inset;
    const yLarge = 1.4;
    const yMedium = -0.65;
    const ySmall = -1.85;
    // Contact: y_A - R_A = y_B + R_B (lies between gear centers)
    const yContactLM = (yLarge + yMedium) / 2; // = 0.375  (R_L=1.3, R_M=0.75 → on rim)
    const yContactMS = (yMedium + ySmall) / 2; // = -1.25

    const points: { pos: [number, number, number]; outSignX: number }[] = [];
    [-1, 1].forEach((sign) => {
      const x = sign * xEdge;
      // outSignX = +1 means sparks fly toward screen center (positive x for left
      // column where sign=-1, negative x for right column where sign=+1).
      points.push({ pos: [x, yContactLM, 0.1], outSignX: -sign });
      points.push({ pos: [x, yContactMS, 0.1], outSignX: -sign });
    });
    return points;
  }, [viewport.width]);

  const sparks = useMemo<SparkData[]>(
    () =>
      Array.from({ length: MAX_SPARKS }, () => ({
        position: new THREE.Vector3(0, -1000, 0),
        velocity: new THREE.Vector3(),
        life: 0,
        size: 0,
      })),
    [],
  );
  const emitCooldown = useRef(0);

  const material = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      color: new THREE.Color(theme.sparkColor),
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    return m;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId]);

  const geometry = useMemo(() => new THREE.TetrahedronGeometry(0.018, 0), []);

  // Pre-allocate color buffer for per-instance fade
  const colors = useMemo(() => new Float32Array(MAX_SPARKS * 3), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const activity = useScrollStore.getState().activity;

    emitCooldown.current -= delta;
    // Emit rate ramps with activity: idle → ~1 spark/sec; max → ~60/sec
    const emitInterval = 1 / (1 + activity * 80);

    while (emitCooldown.current <= 0 && activity > 0.04) {
      emitCooldown.current += emitInterval;
      // Find a dead spark slot
      for (let i = 0; i < MAX_SPARKS; i++) {
        if (sparks[i].life <= 0) {
          const ep =
            emitPoints[Math.floor(Math.random() * emitPoints.length)];
          const [ex, ey, ez] = ep.pos;
          sparks[i].position.set(
            ex + (Math.random() - 0.5) * 0.12,
            ey + (Math.random() - 0.5) * 0.08,
            ez + (Math.random() - 0.5) * 0.05,
          );
          // sparks fly inward (toward screen center, away from off-screen edge)
          sparks[i].velocity.set(
            ep.outSignX * (Math.random() * 1.4 + 0.4),
            (Math.random() - 0.3) * 1.6,
            (Math.random() - 0.5) * 0.5,
          );
          sparks[i].life = 1.0;
          sparks[i].size = 0.6 + Math.random() * 1.1;
          break;
        }
      }
    }

    // Update + write to instance matrix
    for (let i = 0; i < MAX_SPARKS; i++) {
      const s = sparks[i];
      if (s.life > 0) {
        // gravity
        s.velocity.y -= 4.5 * delta;
        s.position.addScaledVector(s.velocity, delta);
        s.life -= delta * 0.95;
      }
      if (s.life > 0) {
        dummy.position.copy(s.position);
        const sc = s.size * Math.max(0.05, s.life);
        dummy.scale.setScalar(sc);
        dummy.rotation.set(
          s.life * 6,
          s.life * 4,
          s.life * 8,
        );
      } else {
        dummy.position.set(0, -1000, 0);
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      // color: hot white-yellow at birth → orange → dim red
      const t = s.life;
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.5 + 0.4 * t;
      colors[i * 3 + 2] = 0.05 + 0.2 * t;
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    } else {
      meshRef.current.instanceColor = new THREE.InstancedBufferAttribute(
        colors,
        3,
      );
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX_SPARKS]}
      frustumCulled={false}
    />
  );
}
