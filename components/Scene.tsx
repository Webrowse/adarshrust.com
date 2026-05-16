'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GearColumns } from './GearColumns';
import { Sparks } from './Sparks';
import { Embers } from './Embers';
import { PostFX } from './PostFX';
import { useThemeStore } from '@/lib/theme-store';
import { THEMES } from '@/lib/themes';

function SceneContents() {
  const themeId = useThemeStore((s) => s.themeId);
  const theme = THEMES[themeId] ?? THEMES.workshop;

  return (
    <>
      <fog attach="fog" args={[theme.sceneFog, 8, 26]} />
      <color attach="background" args={[theme.sceneBackground]} />

      <ambientLight intensity={theme.lightIntensity.ambient} color={theme.lightAmbient} />
      <directionalLight
        position={[5, 6, 3]}
        intensity={theme.lightIntensity.key}
        color={theme.lightKey}
      />
      <pointLight
        position={[-5, -1, 2]}
        intensity={theme.lightIntensity.forge * 0.7}
        color={theme.lightForge}
        distance={9}
        decay={2}
      />
      <pointLight
        position={[5, -1, 2]}
        intensity={theme.lightIntensity.forge * 0.7}
        color={theme.lightForge}
        distance={9}
        decay={2}
      />
      <directionalLight
        position={[-4, 3, 5]}
        intensity={theme.lightIntensity.cool}
        color={theme.lightCool}
      />

      <Environment preset="warehouse" environmentIntensity={theme.lightIntensity.envMap * 0.4} />

      <GearColumns />

      <Sparks />
      <Embers />

      <PostFX />
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ position: [0, 0, 6], fov: 38, near: 0.1, far: 60 }}
      dpr={[1, 1.6]}
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    >
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
