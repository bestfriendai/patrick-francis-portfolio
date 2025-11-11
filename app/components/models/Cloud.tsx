'use client';

import { Cloud, Clouds } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

const CloudContainer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <Clouds material={THREE.MeshBasicMaterial}
      position={[0, -5, 0]}
      frustumCulled={true}>
      {/* Primary cloud - optimized for mobile */}
      <Cloud seed={1}
        segments={1}
        concentrate="inside"
        bounds={isMobile ? [8, 8, 8] : [10, 10, 10]}
        growth={isMobile ? 2.5 : 3}
        position={isMobile ? [-0.5, 0, 0] : [-1, 0, 0]}
        smallestVolume={isMobile ? 1.5 : 2}
        scale={isMobile ? 1.4 : 1.9}
        volume={isMobile ? 1.5 : 2}
        speed={0.2}
        fade={isMobile ? 8 : 5}
        />

      {/* Secondary cloud - reduced on mobile */}
      <Cloud
        seed={3}
        segments={1}
        concentrate="outside"
        bounds={isMobile ? [8, 8, 8] : [10, 10, 10]}
        growth={2}
        position={isMobile ? [1.5, 0, 1.5] : [2, 0, 2]}
        smallestVolume={isMobile ? 1.5 : 2}
        scale={isMobile ? 0.8 : 1}
        volume={isMobile ? 1.5 : 2}
        fade={isMobile ? 5 : 3}
        speed={0.1}/>

      {/* Additional clouds - only render on desktop for performance */}
      {!isMobile && (
        <>
          <Cloud
            seed={4}
            segments={1}
            concentrate="outside"
            bounds={[10, 20, 15]}
            growth={4}
            position={[-10, -10, 4]}
            smallestVolume={2}
            scale={2}
            speed={0.2}
            volume={3}/>

          <Cloud
            seed={5}
            segments={1}
            concentrate="outside"
            bounds={[5, 5, 5]}
            growth={2}
            position={[6, -3, 8]}
            smallestVolume={2}
            scale={2}
            volume={2}
            fade={0.1}
            speed={0.1}/>

          <Cloud
            seed={6}
            segments={1}
            concentrate="outside"
            bounds={[5, 5, 5]}
            growth={2}
            position={[0, -20, 20]}
            smallestVolume={2}
            scale={4}
            volume={3}
            fade={0.1}
            speed={0.1}/>

          <Cloud
            seed={7}
            segments={1}
            concentrate="outside"
            bounds={[5, 5, 5]}
            growth={2}
            position={[10, -15, -5]}
            smallestVolume={2}
            scale={3}
            volume={3}
            fade={0.1}
            speed={0.1}/>
        </>
      )}
    </Clouds>);
}

export default CloudContainer;