import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const ParticleConstellation = () => {
  const pointsRef = useRef();
  const { viewport, pointer } = useThree();

  const numParticles = 5000;
  
  // Generate random particle positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < numParticles; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const x = (Math.random() - 0.5) * factor;
      const y = (Math.random() - 0.5) * factor;
      const z = (Math.random() - 0.5) * factor;
      temp.push(x, y, z);
    }
    return new Float32Array(temp);
  }, []);

  // Per-particle colors
  const colors = useMemo(() => {
    const temp = [];
    const colorA = new THREE.Color('#06B6D4'); // Primary Cyan
    const colorB = new THREE.Color('#EC4899'); // Secondary Magenta
    for (let i = 0; i < numParticles; i++) {
      const color = Math.random() > 0.3 ? colorA : colorB;
      temp.push(color.r, color.g, color.b);
    }
    return new Float32Array(temp);
  }, []);

  useFrame((state, delta) => {
    // Slowly rotate the whole constellation
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.01;
      pointsRef.current.rotation.y += delta * 0.02;
    }

    // Mouse interaction (TODO: Implement repulsion)
    // This is a complex effect, for now, we'll keep the rotation.
    // A full repulsion/glow effect would involve shaders or GPGPU.
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      >
        <bufferAttribute
            attach="color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
      </PointMaterial>
    </Points>
  );
};

const LandingScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: '#0B0F19' }}
      >
        <ambientLight intensity={0.1} />
        <ParticleConstellation />
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.9} 
            height={300} 
            intensity={1.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default LandingScene;