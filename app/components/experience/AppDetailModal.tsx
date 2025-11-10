import { Text, useTexture } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { App } from '../../types/app';
import { trackAppDetailOpen, trackAppDetailClose } from '../../utils/analytics';
import ScreenshotCarousel from './ScreenshotCarousel';

interface AppDetailModalProps {
  app: App | null;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const AppDetailModal = ({ app, isOpen, onClose, isMobile = false }: AppDetailModalProps) => {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  useEffect(() => {
    if (isOpen && app) {
      trackAppDetailOpen(app);
    }
  }, [isOpen, app]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (app) trackAppDetailClose(app);
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, app]);

  const handleClose = () => {
    if (app) trackAppDetailClose(app);
    onClose();
  };

  if (!isOpen || !app) return null;

  const icon = useTexture(app.icon);

  return (
    <group position={[0, 0, 10]}>
      {/* Background Overlay */}
      <mesh onClick={handleClose} position={[0, 0, -0.1]}>
        <planeGeometry args={[30, 30]} />
        <meshBasicMaterial color="#000" transparent opacity={0.85} />
      </mesh>

      {/* Modal Container */}
      <group position={[0, 0, 0]}>
        {/* App Icon */}
        <mesh position={isMobile ? [0, 4, 0] : [-5, 3.5, 0]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshBasicMaterial map={icon} />
        </mesh>

        {/* App Name */}
        <Text
          position={isMobile ? [0, 3, 0] : [-3.3, 3.8, 0]}
          fontSize={0.5}
          color="white"
          anchorX={isMobile ? 'center' : 'left'}
          font="./soria-font.ttf"
        >
          {app.name}
        </Text>

        {/* Tagline */}
        <Text
          position={isMobile ? [0, 2.5, 0] : [-3.3, 3.2, 0]}
          fontSize={0.2}
          color="#aaa"
          anchorX={isMobile ? 'center' : 'left'}
          font="./Vercetti-Regular.woff"
        >
          {app.tagline}
        </Text>

        {/* Description */}
        <Text
          position={isMobile ? [0, 1.8, 0] : [-3.3, 2.6, 0]}
          fontSize={0.15}
          color="white"
          anchorX={isMobile ? 'center' : 'left'}
          maxWidth={isMobile ? 4 : 4.5}
          lineHeight={1.4}
        >
          {app.description}
        </Text>

        {/* Screenshot Carousel */}
        <group position={isMobile ? [0, -0.5, 0] : [2, 0, 0]}>
          <ScreenshotCarousel
            screenshots={app.screenshots}
            activeIndex={currentScreenshot}
            isMobile={isMobile}
            spacing={2.8}
          />
        </group>

        {/* Features List */}
        <group position={isMobile ? [0, -3.5, 0] : [-5, 0.5, 0]}>
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.2}
            color="white"
            anchorX={isMobile ? 'center' : 'left'}
            font="./soria-font.ttf"
          >
            FEATURES
          </Text>
          {app.features.slice(0, 5).map((feature, i) => (
            <Text
              key={i}
              position={[0, -i * 0.35, 0]}
              fontSize={0.14}
              color="#ddd"
              anchorX={isMobile ? 'center' : 'left'}
              maxWidth={4}
            >
              • {feature}
            </Text>
          ))}
        </group>

        {/* Stats */}
        <group position={isMobile ? [0, -5.5, 0] : [2, -2.5, 0]}>
          <Text
            position={isMobile ? [-1.5, 0, 0] : [-1, 0, 0]}
            fontSize={0.18}
            color="white"
            anchorX="center"
          >
            {app.stats.downloads}
          </Text>
          <Text
            position={isMobile ? [-1.5, -0.3, 0] : [-1, -0.3, 0]}
            fontSize={0.12}
            color="#aaa"
            anchorX="center"
          >
            Downloads
          </Text>

          <Text
            position={isMobile ? [0, 0, 0] : [1, 0, 0]}
            fontSize={0.18}
            color="white"
            anchorX="center"
          >
            {app.stats.rating}⭐
          </Text>
          <Text
            position={isMobile ? [0, -0.3, 0] : [1, -0.3, 0]}
            fontSize={0.12}
            color="#aaa"
            anchorX="center"
          >
            Rating
          </Text>

          <Text
            position={isMobile ? [1.5, 0, 0] : [3, 0, 0]}
            fontSize={0.18}
            color="white"
            anchorX="center"
          >
            {app.stats.reviews}
          </Text>
          <Text
            position={isMobile ? [1.5, -0.3, 0] : [3, -0.3, 0]}
            fontSize={0.12}
            color="#aaa"
            anchorX="center"
          >
            Reviews
          </Text>
        </group>

        {/* Close hint */}
        <Text
          position={[0, -6.5, 0]}
          fontSize={0.12}
          color="#666"
          anchorX="center"
        >
          Click outside or press ESC to close
        </Text>
      </group>
    </group>
  );
};

export default AppDetailModal;
