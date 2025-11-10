'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState, memo } from 'react';
import * as THREE from 'three';

export const Porsche = memo(function Porsche() {
  const gltf = useGLTF('/models/porsche.glb');
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

    console.log('Porsche model loaded successfully');

    // Count meshes in the scene
    let meshCount = 0;
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshCount++;
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.side = THREE.DoubleSide;
          mat.needsUpdate = true;
        }
      }
    });
    console.log('Porsche mesh count:', meshCount);

    if (meshCount === 0) {
      console.warn('⚠️ Porsche model has no meshes! Model might be empty or improperly formatted.');
    }

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

      // EXACT same as BMW - closer to camera (less negative Z start)
      const yPos = 6 - (easeProgress * 52);
      const zPos = -15 + (scrollOffset * 45); // Start 5 units closer than -20

      // Same spiral motion as BMW but offset MORE to right (closer on mobile)
      const xPos = isMobile ? 3 : (10 + 3 * Math.sin(scrollOffset * Math.PI * 1.5) - scrollOffset * 1.5);

      groupRef.current.position.set(xPos, yPos, zPos);

      // Porsche: Elegant spinning motion - mostly Y axis with gentle wobble
      carRef.current.rotation.y += delta * (1.2 + scrollOffset * 3.0); // Fast Y spin
      carRef.current.rotation.z += delta * (0.2 + Math.sin(state.clock.elapsedTime) * 0.1); // Gentle wobble
      carRef.current.rotation.x += delta * (0.3 + scrollOffset * 0.5); // Slow X tumble

      // Mobile-friendly sizing
      const baseScale = isMobile ? 6 : 9;

      if (scrollOffset < 0.25) {
        // Float at normal size
        const floatScale = baseScale + Math.sin(state.clock.elapsedTime * 2) * 0.04;
        carRef.current.scale.set(floatScale, floatScale, floatScale);
      } else if (scrollOffset < 0.65) {
        // Gradual shrink as it approaches door
        const shrinkProgress = (scrollOffset - 0.25) / 0.4;
        const easeInOut = shrinkProgress < 0.5
          ? 2 * shrinkProgress * shrinkProgress
          : 1 - Math.pow(-2 * shrinkProgress + 2, 2) / 2;
        const midScale = isMobile ? 0.08 : 0.13;
        const scale = baseScale - (easeInOut * (baseScale - midScale));
        carRef.current.scale.set(scale, scale, scale);
      } else {
        // Rapid final shrink as it goes through door
        const finalProgress = (scrollOffset - 0.65) / 0.1;
        const minScale = isMobile ? 0.008 : 0.017;
        const midScale = isMobile ? 0.08 : 0.13;
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
        {/* Porsche model - mobile optimized */}
        <primitive
          object={gltf.scene}
          scale={isMobile ? 6 : 12}
          rotation={[-Math.PI / 6, Math.PI / 4, 0]}
        />

        {/* Lighting */}
        <pointLight position={[3, 3, 3]} intensity={300} distance={40} color="#ffffff" />
        <pointLight position={[-3, 3, 3]} intensity={300} distance={40} color="#ffffff" />
      </group>
    </group>
  );
});

useGLTF.preload('/models/porsche.glb');
