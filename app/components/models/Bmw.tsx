'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export function Bmw() {
  const gltf = useGLTF('/models/bmw.glb');
  const groupRef = useRef<THREE.Group>(null);
  const carRef = useRef<THREE.Group>(null);
  const data = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    console.log('BMW model loaded successfully');

    // Ensure materials are visible
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.side = THREE.DoubleSide;
          mat.needsUpdate = true;
        }
      }
    });

    return () => window.removeEventListener('resize', checkMobile);
  }, [gltf]);

  useFrame((state, delta) => {
    if (!groupRef.current || !carRef.current) return;

    const scrollOffset = data.offset;

    // Visible from 0% to 75% scroll
    if (scrollOffset < 0.75) {
      groupRef.current.visible = true;

      // Enhanced falling path with easing
      const easeProgress = 1 - Math.pow(1 - scrollOffset, 2); // Ease out quad

      // Fall from Y=6 down to Y=-32 with acceleration
      const yPos = 6 - (easeProgress * 52);

      // Move forward with depth - starts far back, comes through door
      const zPos = -20 + (scrollOffset * 45);

      // Spiral/arc motion for more dynamic fall
      const xPos = isMobile ? 0 : (3 * Math.sin(scrollOffset * Math.PI * 1.5) - scrollOffset * 1.5);

      groupRef.current.position.set(xPos, yPos, zPos);

      // BMW: Balanced rotation - smooth tumbling on all axes
      carRef.current.rotation.x += delta * (0.6 + scrollOffset * 1.5); // Medium X flip
      carRef.current.rotation.z += delta * (0.7 + scrollOffset * 1.8); // Medium Z barrel roll
      carRef.current.rotation.y += delta * (0.5 + scrollOffset * 1.2); // Slow Y spin

      // Improved scaling with smoother transition
      const baseScale = isMobile ? 1.2 : 1.5;

      if (scrollOffset < 0.25) {
        // Float at normal size
        const floatScale = baseScale + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        carRef.current.scale.set(floatScale, floatScale, floatScale);
      } else if (scrollOffset < 0.65) {
        // Gradual shrink as it approaches door
        const shrinkProgress = (scrollOffset - 0.25) / 0.4;
        const easeInOut = shrinkProgress < 0.5
          ? 2 * shrinkProgress * shrinkProgress
          : 1 - Math.pow(-2 * shrinkProgress + 2, 2) / 2;
        const midScale = isMobile ? 0.1 : 0.2;
        const scale = baseScale - (easeInOut * (baseScale - midScale));
        carRef.current.scale.set(scale, scale, scale);
      } else {
        // Rapid final shrink as it goes through door
        const finalProgress = (scrollOffset - 0.65) / 0.1;
        const minScale = isMobile ? 0.01 : 0.025;
        const midScale = isMobile ? 0.1 : 0.2;
        const scale = midScale - (finalProgress * (midScale - minScale));
        carRef.current.scale.set(scale, scale, scale);
      }
    } else {
      groupRef.current.visible = false;
    }
  });

  return (
    <group ref={groupRef}>
      <group ref={carRef}>
        {/* BMW model - positioned off to the side to avoid text */}
        <primitive
          object={gltf.scene}
          scale={isMobile ? 1.2 : 2}
          rotation={[-Math.PI / 6, Math.PI / 4, 0]}
        />

        {/* Enhanced lighting for visibility */}
        <hemisphereLight intensity={1} groundColor="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={500} distance={50} color="#ffffff" />
        <pointLight position={[-5, 5, 5]} intensity={500} distance={50} color="#ffffff" />
        <pointLight position={[0, 5, -5]} intensity={500} distance={50} color="#ffffff" />
        <pointLight position={[0, -5, 0]} intensity={400} distance={50} color="#4da6ff" />
        <directionalLight position={[0, 10, 0]} intensity={3} />
      </group>
    </group>
  );
}

useGLTF.preload('/models/bmw.glb');
