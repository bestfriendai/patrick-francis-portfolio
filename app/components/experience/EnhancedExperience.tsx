import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { APPS } from '../../constants/apps';
import { App } from '../../types/app';
import PhoneMockup from "./PhoneMockup";
import DesktopAppCard from "./DesktopAppCard";
import AppDetailModal from "./AppDetailModal";

const EnhancedExperience = () => {
  const titleRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const data = useScroll();
  const isActive = usePortalStore((state) => !!state.activePortalId);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: 0.4,
    color: 'white',
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useFrame((state, delta) => {
    const d = data.range(0.8, 0.2);
    const e = data.range(0.7, 0.2);

    if (groupRef.current && !isActive) {
      groupRef.current.position.y = d > 0 ? -1 : -30;
      groupRef.current.visible = d > 0;
    }

    if (titleRef.current) {
      titleRef.current.children.forEach((text, i) => {
        const y = Math.max(Math.min((1 - d) * (10 - i), 10), 0.5);
        text.position.y = THREE.MathUtils.damp(text.position.y, y, 7, delta);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (text as any).fillOpacity = e;
      });
    }
  });

  const getTitle = () => {
    const title = 'PATS APPS';
    return title.split('').map((char, i) => {
      const diff = isMobile ? 0.25 : 0.8;
      const fontSize = isMobile ? 0.25 : 0.4;
      return (
        <Text key={i} {...fontProps} fontSize={fontSize} position={[i * diff, 2, 1]}>{char}</Text>
      );
    });
  };

  const getApps = () => {
    if (isMobile) {
      // Mobile: Vertical stack with phone mockups
      return APPS.map((app, i) => (
        <PhoneMockup
          key={app.id}
          app={app}
          position={new THREE.Vector3(0, (i - (APPS.length - 1) / 2) * -5.8, 0)}
          onClick={() => setSelectedApp(app)}
        />
      ));
    }

    // Desktop: Grid layout with interactive cards
    const columns = 3;
    return APPS.map((app, i) => {
      const row = Math.floor(i / columns);
      const col = i % columns;
      const xOffset = (col - (columns - 1) / 2) * 4;
      const yOffset = -row * 5;

      return (
        <DesktopAppCard
          key={app.id}
          app={app}
          position={new THREE.Vector3(xOffset, yOffset, 0)}
          onExpand={() => setSelectedApp(app)}
        />
      );
    });
  };

  return (
    <>
      <group position={[0, -41.5, 12]} rotation={[-Math.PI / 2, 0, -Math.PI / 2]}>
        <group rotation={[0, 0, Math.PI / 2]}>
          <group ref={titleRef} position={[isMobile ? -1.0 : -3.6, 2, -2]}>
            {getTitle()}
          </group>

          <group position={[0, isMobile ? 0 : -1, 0]} ref={groupRef}>
            {getApps()}
          </group>
        </group>
      </group>

      {/* App Detail Modal */}
      <AppDetailModal
        app={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        isMobile={isMobile}
      />
    </>
  );
};

export default EnhancedExperience;
