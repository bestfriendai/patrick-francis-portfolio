'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export function SmallGlobe() {
  const gltf = useGLTF('/models/smallglobe.glb');
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Ensure materials are visible and set up glow
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.emissive = new THREE.Color(0x64c8ff); // Blue glow
          mat.emissiveIntensity = 0.4;
          mat.side = THREE.DoubleSide;
          mat.needsUpdate = true;
        }
      }
    });

    return () => window.removeEventListener('resize', checkMobile);
  }, [gltf]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const scrollProgress = data.offset; // 0 to 1

    // Visible from 75% onwards (after Pat's Apps section starts)
    if (scrollProgress >= 0.75) {
      groupRef.current.visible = true;

      // Position: between Pat's Apps and Apple Glass menu
      // Y position: centered vertically in that space
      const yPosition = isMobile ? -27 : -28;
      const xPosition = 0; // Centered horizontally
      const zPosition = 0; // Same plane as other elements

      groupRef.current.position.set(xPosition, yPosition, zPosition);

      // Constant spinning (gentle Y-axis rotation)
      groupRef.current.rotation.y += 0.008; // Gentle constant spin

      // Keep it upright (no X or Z rotation)
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.z = 0;

      // Scale: VERY small - just a little decorative element
      const scale = isMobile ? 0.15 : 0.2;
      groupRef.current.scale.setScalar(scale);

      // Full opacity
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.opacity = 1;
            mat.transparent = true;
            mat.visible = true;
          }
        }
      });
    } else {
      groupRef.current.visible = false;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/smallglobe.glb');
