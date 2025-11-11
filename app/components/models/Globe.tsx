'use client';

import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export function Globe() {
  const gltf = useGLTF('/models/globe.glb');
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
          mat.emissiveIntensity = 0.3;
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

    // Debug: Log scroll progress every 100 frames to see what's happening
    if (Math.random() < 0.01) {
      console.log('Globe scroll progress:', scrollProgress.toFixed(3));
    }

    // Hide after 85% scroll (before apps section at 75%)
    if (scrollProgress >= 0.85) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    let scale = 2.0;
    let yPosition = isMobile ? 1 : 2;
    let opacity = 0.9;
    let rotateX = 0; // For the 720° flip when falling

    if (scrollProgress < 0.2) {
      // Phase 1: Big globe in hero - UPRIGHT, spinning left
      scale = 2.0;
      yPosition = isMobile ? -1.5 : -2; // Below hero text, centered
      opacity = 0.9;
    } else if (scrollProgress < 0.5) {
      // Phase 2: MASSIVE growing phase - stays UPRIGHT
      const growProgress = (scrollProgress - 0.2) / 0.3;
      scale = 2.0 + (5.0 * growProgress); // 2.0 → 7.0 (HUGE growth)
      yPosition = isMobile ? 0 : 1; // Moves to center
      opacity = 0.9 + (0.1 * growProgress);
    } else if (scrollProgress < 0.7) {
      // Phase 3: Maximum size - stays UPRIGHT
      scale = 7.0;
      yPosition = isMobile ? 0 : 1;
      opacity = 1;
    } else if (scrollProgress < 0.85) {
      // Phase 4: Falls DOWN with 720° X-axis rotation (flipping forward)
      const fallProgress = (scrollProgress - 0.7) / 0.15;

      scale = 7.0 + (5.0 * fallProgress); // Gets bigger as it falls (7 → 12)
      yPosition = (isMobile ? 0 : 1) - (fallProgress * 40); // Falls DOWN DRAMATICALLY

      // Keep opacity high until very end of fall
      if (fallProgress < 0.8) {
        opacity = 1.0; // Stay fully visible
      } else {
        opacity = 1.0 - ((fallProgress - 0.8) / 0.2) * 1.5; // Only fade at the very end
      }

      rotateX = fallProgress * 720; // 720° forward flip!

      // Also move slightly towards camera for more drama
      groupRef.current.position.z = -3 + (fallProgress * 5);
    }

    // Apply transformations
    groupRef.current.scale.setScalar(scale);
    groupRef.current.position.x = 0;
    groupRef.current.position.y = yPosition;

    // Z position is set in falling phase, otherwise default
    if (scrollProgress < 0.7) {
      groupRef.current.position.z = -3; // Fixed position in front of camera
    }

    // Apply X-axis rotation (for the 720° flip when falling)
    groupRef.current.rotation.x = (rotateX * Math.PI) / 180; // Convert to radians

    // Continuous gentle Y-axis rotation (spinning to the LEFT)
    groupRef.current.rotation.y += 0.005; // Gentle constant spin

    // Keep Z rotation at 0 (upright)
    groupRef.current.rotation.z = 0;

    // Update opacity on all materials
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.opacity = Math.max(0, opacity);
          mat.transparent = true;
          mat.visible = true; // Force visibility
        }
      }
    });

    // Debug falling phase
    if (scrollProgress >= 0.7 && scrollProgress < 0.85 && Math.random() < 0.05) {
      console.log('FALLING! Progress:', scrollProgress.toFixed(3), 'Y:', yPosition.toFixed(1), 'Opacity:', opacity.toFixed(2));
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/globe.glb');
