
import { Edges, MeshPortalMaterial, Text, TextProps, useScroll, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { usePortalStore } from '@stores';
import gsap from "gsap";
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface GridTileProps {
  id: string;
  title: string;
  textAlign: TextProps['textAlign'];
  children?: React.ReactNode;
  color: string;
  position: THREE.Vector3;
  imageUrl?: string;
  link?: string;
}

// TODO: Rename this
const GridTile = (props: GridTileProps) => {
  const titleRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  const hoverBoxRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef(null);
  const { title, textAlign, color, position, id, imageUrl, link } = props;
  const { camera } = useThree();
  const setActivePortal = usePortalStore((state) => state.setActivePortal);
  const isActive = usePortalStore((state) => state.activePortalId === id);
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const data = useScroll();
  // Create a dummy 1x1 transparent texture for tiles without images
  const dummyCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (dummyCanvas) {
    dummyCanvas.width = 1;
    dummyCanvas.height = 1;
  }
  const texture = useTexture(imageUrl || (dummyCanvas ? dummyCanvas.toDataURL() : ''));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Hanlde the hover box and title animation for mobile.
    if (isMobile && titleRef.current) {
      // Show titles on mobile with better visibility
      gsap.to(titleRef.current, {
        fillOpacity: 1,
        duration: 0.5,
      });
    }
  }, [isMobile]);

  useFrame(() => {
    const d = data.range(0.95, 0.05);
    if (isMobile && titleRef.current) {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      (titleRef.current as any).fillOpacity = d;
    }
  });

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      exitPortal(true);
    }
  };

  const portalInto = (e: React.MouseEvent) => {
    // If this tile has a link, open it instead of portal
    if (link) {
      e.stopPropagation();
      window.open(link, '_blank');
      return;
    }

    // Don't allow portal if no link (coming soon tiles)
    if (!link) {
      return;
    }

    if (isActive || activePortalId) return;
    e.stopPropagation();
    setActivePortal(id);
    document.body.style.cursor = 'auto';
    const div = document.createElement('div');

    div.className = 'fixed close';
    div.style.transform = 'rotateX(90deg)';
    div.onclick = () => exitPortal(true);

    if (!document.querySelector('.close')) {
      document.body.appendChild(div);

      gsap.fromTo(div, {
        scale: 0,
        rotate: '-180deg',
      },{
        opacity: 1,
        zIndex: 10,
        transform: 'rotateX(0deg)',
        scale: 1,
        duration: 1,
      })
    }
    document.body.addEventListener('keydown', handleEscape);
    gsap.to(portalRef.current, {
      blend: 1,
      duration: 0.5,
    });
  };

  const exitPortal = (force = false) => {
    if (!force && !activePortalId) return;
    setActivePortal(null)

    gsap.to(camera.position, {
      x: 0,
      duration: 1,
    });

    gsap.to(camera.rotation, {
      x: -Math.PI / 2,
      y: 0,
      duration: 1,
    });

    gsap.to(portalRef.current, {
      blend: 0,
      duration: 1,
    });

    // Remove the div from the dom
    gsap.to(document.querySelector('.close'), {
      scale: 0,
      duration: 0.5,
      onComplete: () => {
        document.querySelectorAll('.close').forEach((el) => {
          el.remove();
        });
      }
    })
    document.body.removeEventListener('keydown', handleEscape);
  }

  const fontProps: Partial<TextProps> = {
    font: "./soria-font.ttf",
    maxWidth: 2,
    anchorX: 'center',
    anchorY: 'bottom',
    fontSize: 0.7,
    color: 'white',
    textAlign: textAlign,
    fillOpacity: 0,
  };

  const onPointerOver = () => {
    if (isActive || isMobile) return;
    // Only show pointer if there's a link
    if (link) {
      document.body.style.cursor = 'pointer';
    }
    gsap.to(titleRef.current, {
      fillOpacity: 1
    });
    if (gridRef.current && hoverBoxRef.current && link) {
      gsap.to(gridRef.current.position, { z: 0.5, duration: 0.4});
      gsap.to(hoverBoxRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
    }
  };

  const onPointerOut = () => {
    if (isMobile) return;
    document.body.style.cursor = 'auto';
    gsap.to(titleRef.current, {
      fillOpacity: 0
    });
    if (gridRef.current && hoverBoxRef.current) {
      gsap.to(gridRef.current.position, { z: 0, duration: 0.4});
      gsap.to(hoverBoxRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.4 });
    }
  };

  const getGeometry = () => {
    // Square tiles - much smaller on mobile for 2x2 grid that fits screen
    const size = isMobile ? 1.5 : 4;
    return <planeGeometry args={[size, size, 1]} />
  };

  const imageSize: [number, number] = isMobile ? [1.3, 2.6] : [3, 6];

  return (
    <mesh ref={gridRef}
      position={position}
      onClick={portalInto}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}>
      { getGeometry() }
      <group>
        <mesh position={[0, 0, -0.01]} ref={hoverBoxRef} scale={[0, 0, 0]}>
          <boxGeometry args={isMobile ? [1.5, 1.5, 0.5] : [4, 4, 0.5]}/>
          <meshPhysicalMaterial
            color="#444"
            transparent={true}
            opacity={0.3}
          />
          <Edges color="white" lineWidth={3}/>
        </mesh>
        <Text position={[0, isMobile ? -0.65 : -1.8, 0.4]} fontSize={isMobile ? 0.12 : 0.7} {...fontProps} ref={titleRef}>
          {title}
        </Text>
      </group>
      <MeshPortalMaterial ref={portalRef} blend={0} resolution={0} blur={0}>
        <color attach="background" args={[color]} />
        {imageUrl ? (
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={imageSize} />
            <meshBasicMaterial map={texture} />
          </mesh>
        ) : (
          // Show "COMING SOON" text centered for tiles without images
          <Text
            position={[0, 0, 0]}
            fontSize={isMobile ? 0.15 : 0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="./soria-font.ttf"
          >
            {title}
          </Text>
        )}
      </MeshPortalMaterial>
    </mesh>
  );
}

export default GridTile;