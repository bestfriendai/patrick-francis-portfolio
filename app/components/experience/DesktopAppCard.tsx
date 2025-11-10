import { Edges, RoundedBox, Text, useTexture } from '@react-three/drei';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { App } from '../../types/app';

interface DesktopAppCardProps {
  app: App;
  position: THREE.Vector3;
  onExpand?: () => void;
}

const DesktopAppCard = ({ app, position, onExpand }: DesktopAppCardProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(app.screenshots[0]);

  useEffect(() => {
    if (groupRef.current) {
      if (hovered) {
        gsap.to(groupRef.current.position, {
          z: 0.5,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(groupRef.current.scale, {
          x: 1.05,
          y: 1.05,
          z: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(groupRef.current.position, {
          z: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        gsap.to(groupRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, [hovered]);

  const cardWidth = 3.5;
  const cardHeight = 4.5;

  return (
    <group ref={groupRef} position={position}>
      {/* Card Background */}
      <RoundedBox
        args={[cardWidth, cardHeight, 0.1]}
        radius={0.1}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          if (onExpand) onExpand();
          if (app.links.website) {
            window.open(app.links.website, '_blank');
          }
        }}
      >
        <meshStandardMaterial
          color={hovered ? app.themeColor : '#2a2a2a'}
          metalness={0.3}
          roughness={0.7}
        />
        <Edges color="white" lineWidth={hovered ? 2 : 1} />
      </RoundedBox>

      {/* App Screenshot */}
      <mesh position={[0, 0.5, 0.06]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* App Name */}
      <Text
        position={[0, -1.5, 0.06]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        font="./soria-font.ttf"
        maxWidth={cardWidth - 0.5}
      >
        {app.name}
      </Text>

      {/* Tagline */}
      <Text
        position={[0, -1.9, 0.06]}
        fontSize={0.15}
        color="#aaa"
        anchorX="center"
        font="./Vercetti-Regular.woff"
        maxWidth={cardWidth - 0.5}
      >
        {app.tagline}
      </Text>

      {/* Hover Info Overlay */}
      {hovered && (
        <group position={[0, 0, 0.07]}>
          {/* Stats Badge */}
          <mesh position={[-1.3, 1.8, 0]}>
            <planeGeometry args={[0.8, 0.3]} />
            <meshBasicMaterial color="#000" transparent opacity={0.7} />
          </mesh>
          <Text
            position={[-1.3, 1.8, 0.01]}
            fontSize={0.12}
            color="white"
            anchorX="center"
          >
            {app.stats.rating}⭐
          </Text>

          {/* Platforms */}
          {app.platforms.map((platform, i) => (
            <Text
              key={i}
              position={[0.8 + i * 0.6, 1.8, 0.01]}
              fontSize={0.1}
              color="white"
              anchorX="left"
            >
              {platform}
            </Text>
          ))}
        </group>
      )}
    </group>
  );
};

export default DesktopAppCard;
