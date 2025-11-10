import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ScreenshotCarouselProps {
  screenshots: string[];
  activeIndex?: number;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  spacing?: number;
  isMobile?: boolean;
}

const ScreenshotCarousel = ({
  screenshots,
  activeIndex = 0,
  autoPlay = false,
  autoPlayDelay = 3000,
  spacing = 2.8,
  isMobile = false
}: ScreenshotCarouselProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [currentIndex, setCurrentIndex] = useState(activeIndex);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || screenshots.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, screenshots.length]);

  // Smooth scroll animation
  useFrame(() => {
    if (groupRef.current) {
      const targetX = -currentIndex * spacing;
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.1
      );
    }
  });

  const imageSize: [number, number] = isMobile ? [2.2, 4.5] : [2.5, 5];

  return (
    <group ref={groupRef}>
      {screenshots.map((screenshot, i) => {
        const texture = useTexture(screenshot);
        const isActive = i === currentIndex;
        const opacity = isActive ? 1 : 0.5;

        return (
          <mesh
            key={i}
            position={[i * spacing, 0, isActive ? 0.1 : 0]}
            onClick={() => setCurrentIndex(i)}
          >
            <planeGeometry args={imageSize} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={opacity}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default ScreenshotCarousel;
