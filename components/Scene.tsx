'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Gear } from './Gear';
import { Sparks } from './Sparks';
import { Embers } from './Embers';
import { PostFX } from './PostFX';

function SceneContents() {
  return (
    <>
      {/* fog → depth atmosphere */}
      <fog attach="fog" args={['#0a0807', 6, 22]} />
      <color attach="background" args={['#0a0807']} />

      {/* lighting matching v7 forge ambience */}
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

      {/* LEFT COLUMN — Image 2 reference layout */}
      <Gear size="large" position={[-3.0, 1.4, -0.6]} speed={1.0} phase={0} />
      <Gear size="medium" position={[-2.5, -0.3, 0.2]} speed={-1.35} phase={0.4} />
      <Gear size="small" position={[-2.0, -1.6, 0.5]} speed={2.1} phase={-0.7} />

      {/* RIGHT COLUMN — mirrored */}
      <Gear size="large" position={[3.0, 1.4, -0.6]} speed={-1.0} phase={0.2} />
      <Gear size="medium" position={[2.5, -0.3, 0.2]} speed={1.35} phase={-0.5} />
      <Gear size="small" position={[2.0, -1.6, 0.5]} speed={-2.1} phase={0.9} />

      {/* particles */}
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
