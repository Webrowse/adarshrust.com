'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const EMBER_COUNT = 80;

type Ember = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
};

function spawn(): Ember {
  return {
    pos: new THREE.Vector3(
      (Math.random() - 0.5) * 10,
      -3 - Math.random() * 1,
      (Math.random() - 0.5) * 2,
    ),
    vel: new THREE.Vector3(
      (Math.random() - 0.5) * 0.1,
      0.25 + Math.random() * 0.45,
      (Math.random() - 0.5) * 0.06,
    ),
    life: 0,
    maxLife: 6 + Math.random() * 4,
    size: 0.4 + Math.random() * 0.7,
  };
}

export function Embers() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const embers = useMemo<Ember[]>(
    () => Array.from({ length: EMBER_COUNT }, spawn),
    [],
  );

  // Stagger initial lives so they don't all start at the same time
  useMemo(() => {
    embers.forEach((e) => {
      e.life = Math.random() * e.maxLife;
    });
  }, [embers]);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ff7022'),
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );
  const geometry = useMemo(() => new THREE.SphereGeometry(0.015, 6, 6), []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < EMBER_COUNT; i++) {
      const e = embers[i];
      e.life += delta;
      if (e.life > e.maxLife) {
        Object.assign(e, spawn());
        e.life = 0;
      }
      e.pos.addScaledVector(e.vel, delta);
      // slight horizontal drift wave
      e.pos.x += Math.sin((e.life + i) * 1.3) * delta * 0.08;

      // fade in for first 15%, out for last 30%
      const t = e.life / e.maxLife;
      let alphaScale = 1;
      if (t < 0.15) alphaScale = t / 0.15;
      else if (t > 0.7) alphaScale = (1 - t) / 0.3;
      const sc = e.size * 0.06 * alphaScale;

      dummy.position.copy(e.pos);
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, EMBER_COUNT]}
      frustumCulled={false}
    />
  );
}
