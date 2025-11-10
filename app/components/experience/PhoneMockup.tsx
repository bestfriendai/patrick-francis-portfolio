import { RoundedBox, Text } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { App } from '../../types/app';
import { trackAppView, trackAppClick } from '../../utils/analytics';
import ScreenshotCarousel from './ScreenshotCarousel';

interface PhoneMockupProps {
  app: App;
  position: THREE.Vector3;
  onClick?: () => void;
}

const PhoneMockup = ({ app, position, onClick }: PhoneMockupProps) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    trackAppView(app, 'mobile_mockup');
  }, [app]);

  const handleClick = () => {
    trackAppClick(app, 'phone_mockup');
    if (onClick) onClick();
  };

  const frameWidth = 2.7;
  const frameHeight = 5.2;
  const screenWidth = 2.5;
  const screenHeight = 4.8;
  const frameThickness = 0.1;
  const frameRadius = 0.2;

  return (
    <group position={position}>
      {/* Phone Frame */}
      <RoundedBox
        args={[frameWidth, frameHeight, frameThickness]}
        radius={frameRadius}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Screen Background */}
      <mesh position={[0, 0, frameThickness / 2 + 0.01]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshBasicMaterial color={app.themeColor} />
      </mesh>

      {/* Screenshot Carousel */}
      <group position={[0, 0, frameThickness / 2 + 0.02]}>
        <ScreenshotCarousel
          screenshots={app.screenshots}
          isMobile={true}
          autoPlay={false}
          spacing={2.6}
        />
      </group>

      {/* App Name Label */}
      <Text
        position={[0, -(frameHeight / 2) - 0.4, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="top"
        font="./soria-font.ttf"
        fillOpacity={hovered ? 1 : 0.8}
      >
        {app.name}
      </Text>

      {/* Hover indicator - subtle glow */}
      {hovered && (
        <pointLight
          position={[0, 0, 0.5]}
          intensity={0.5}
          distance={3}
          color={app.themeColor}
        />
      )}
    </group>
  );
};

export default PhoneMockup;
