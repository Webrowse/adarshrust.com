'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GearColumns } from './GearColumns';
import { Sparks } from './Sparks';
import { Embers } from './Embers';
import { PostFX } from './PostFX';

function SceneContents() {
  return (
    <>
      <fog attach="fog" args={['#0a0807', 6, 22]} />
      <color attach="background" args={['#0a0807']} />

      <ambientLight intensity={0.06} color={'#ff8033'} />
      <directionalLight
        position={[5, 6, 3]}
        intensity={0.6}
        color={'#ffb070'}
      />
      <pointLight
        position={[-5, -1, 2]}
        intensity={2.4}
        color={'#ff5a14'}
        distance={9}
        decay={2}
      />
      <pointLight
        position={[5, -1, 2]}
        intensity={2.4}
        color={'#ff5a14'}
        distance={9}
        decay={2}
      />
      <directionalLight
        position={[-4, 3, 5]}
        intensity={0.18}
        color={'#9aa0a8'}
      />

      <Environment preset="warehouse" environmentIntensity={0.18} />

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
