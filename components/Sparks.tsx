'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/scroll-store';

const MAX_SPARKS = 220;

type SparkData = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number; // 0..1
  size: number;
};

/** Emit positions in world-space where gear meshing happens */
const EMIT_POINTS: [number, number, number][] = [
  // Left column meshing points (between consecutive gears)
  [-2.7, 0.45, 0.1],
  [-2.4, -0.95, 0.25],
  // Right column
  [2.7, 0.45, 0.1],
  [2.4, -0.95, 0.25],
];

export function Sparks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
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
      color: new THREE.Color('#ffaa44'),
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    return m;
  }, []);

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
            EMIT_POINTS[Math.floor(Math.random() * EMIT_POINTS.length)];
          sparks[i].position.set(
            ep[0] + (Math.random() - 0.5) * 0.12,
            ep[1] + (Math.random() - 0.5) * 0.08,
            ep[2] + (Math.random() - 0.5) * 0.05,
          );
          // outward-ish initial velocity
          const dir = ep[0] < 0 ? -1 : 1; // sparks fly toward outside
          sparks[i].velocity.set(
            dir * (Math.random() * 1.4 + 0.4),
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
