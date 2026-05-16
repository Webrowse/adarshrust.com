'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/lib/scroll-store';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES } from '@/lib/themes';

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

  const { scene } = useGLTF(GLB_MAP[size]);
  const [normal, roughness, metallic] = useTexture([
    '/textures/gear_normal.webp',
    '/textures/gear_roughness.webp',
    '/textures/gear_metallic.webp',
  ]);

  useEffect(() => {
    [normal, roughness, metallic].forEach((t) => (t.colorSpace = THREE.NoColorSpace));
  }, [normal, roughness, metallic]);

  const themeId = useThemeStore((s) => s.themeId);
  const theme = THEMES[themeId] ?? THEMES.workshop;

  // Build a single shared material — basecolor texture removed so theme color drives the tint
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      normalMap: normal,
      roughnessMap: roughness,
      metalnessMap: metallic,
      metalness: 1.0,
      roughness: 1.0,
      envMapIntensity: theme.lightIntensity.envMap,
    });
    m.color = new THREE.Color(theme.gearBase);
    m.emissive = new THREE.Color(theme.gearShadow);
    m.emissiveIntensity = 0.15;
    m.normalScale.set(0.9, 0.9);
    return m;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normal, roughness, metallic, themeId]);

  // Apply material to every mesh in the glb scene.
  // The exported GLB nodes carry residual translation/rotation from the
  // Blender staging scene (e.g. the large gear node has translation
  // [-2.4, 0, -1.3] + a 90° rotation baked in). If we don't strip these,
  // the outer group's rotation.z makes the mesh ORBIT around an offset
  // pivot instead of spinning on its own axis — the "gears flying everywhere"
  // bug. Mesh vertices are already centered on origin in the GLB, so
  // zeroing every node's transform is safe.
  const gearScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((c) => {
      c.position.set(0, 0, 0);
      c.quaternion.identity();
      c.scale.set(1, 1, 1);
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
    const progress = useScrollStore.getState().progress;
    // RIGID 1:1 coupling — every increment of scroll progress maps directly to rotation.
    // BASE_REVS = how many full revolutions the LARGE gear makes from top to bottom of page.
    const BASE_REVS = 3.5;
    ref.current.rotation.z = progress * Math.PI * 2 * BASE_REVS * speed + phase;
  });

  return (
    <group ref={ref} position={position}>
      {/* Inner group reorients the gear face from glTF's XZ plane to the XY
          plane so it faces the +Z camera. The outer group's rotation.z then
          spins the gear cleanly around its own axle. */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={gearScene} />
      </group>
    </group>
  );
}
