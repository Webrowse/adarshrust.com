'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/scroll-store';

type GearSize = 'large' | 'medium' | 'small';

const GLB_MAP: Record<GearSize, string> = {
  large: '/models/gear_large.glb',
  medium: '/models/gear_medium.glb',
  small: '/models/gear_small.glb',
};

// Preload everything once
Object.values(GLB_MAP).forEach((p) => useGLTF.preload(p));

type Props = {
  size: GearSize;
  position: [number, number, number];
  /** rotation multiplier; sign sets direction, magnitude scales speed */
  speed?: number;
  /** small phase offset so adjacent gears don't all spin in sync */
  phase?: number;
};

export function Gear({ size, position, speed = 1, phase = 0 }: Props) {
  const ref = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);

  const { scene } = useGLTF(GLB_MAP[size]);
  const [basecolor, normal, roughness, metallic] = useTexture([
    '/textures/gear_basecolor.webp',
    '/textures/gear_normal.webp',
    '/textures/gear_roughness.webp',
    '/textures/gear_metallic.webp',
  ]);

  useEffect(() => {
    [basecolor].forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
    [normal, roughness, metallic].forEach((t) => (t.colorSpace = THREE.NoColorSpace));
  }, [basecolor, normal, roughness, metallic]);

  // Build a single shared material with the baked maps
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      map: basecolor,
      normalMap: normal,
      roughnessMap: roughness,
      metalnessMap: metallic,
      metalness: 1.0, // multiplied by metallic map
      roughness: 1.0, // multiplied by roughness map
      envMapIntensity: 0.9,
    });
    m.normalScale.set(0.9, 0.9);
    return m;
  }, [basecolor, normal, roughness, metallic]);

  // Apply material to every mesh in the glb scene
  const gearScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const mesh = c as THREE.Mesh;
        mesh.material = material;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
    return clone;
  }, [scene, material]);

  useFrame(() => {
    if (!ref.current) return;
    const scroll = useScrollStore.getState().scroll;
    // 8 full rotations across an entire scroll height of 4000px feels right
    targetRotation.current = (scroll / 4000) * Math.PI * 8 * speed + phase;
    const current = ref.current.rotation.z;
    // heavy inertia — gear "catches up" to target with damping
    ref.current.rotation.z = current + (targetRotation.current - current) * 0.07;
  });

  return (
    <group ref={ref} position={position}>
      <primitive object={gearScene} />
    </group>
  );
}
