// import { useScroll } from "@react-three/drei";
// import { useFrame } from "@react-three/fiber";
// import { usePortalStore } from "@stores";
// import { useRef } from "react";
// import * as THREE from 'three';
// import GridTile from "./GridTile";

const Experience = () => {
  // Removed unused refs and animation code since apps section is now 2D HTML overlay
  // const titleRef = useRef<THREE.Group>(null);
  // const groupRef = useRef<THREE.Group>(null);
  // const data = useScroll();
  // const isActive = usePortalStore((state) => !!state.activePortalId);

  // const fontProps = {
  //   font: "./soria-font.ttf",
  //   fontSize: 0.4,
  //   color: 'white',
  // };

  // useFrame((sate, delta) => {
  //   const d = data.range(0.8, 0.2);
  //   const e = data.range(0.7, 0.2);

  //   // Animation code removed - now using 2D HTML overlay for apps section
  //   // if (groupRef.current && !isActive) {
  //   //   groupRef.current.position.y = d > 0 ? -1 : -30;
  //   //   groupRef.current.visible = d > 0;
  //   // }

  //   // if (titleRef.current) {
  //   //   titleRef.current.children.forEach((text, i) => {
  //   //     const y =  Math.max(Math.min((1 - d) * (10 - i), 10), 0.5);
  //   //     text.position.y = THREE.MathUtils.damp(text.position.y, y, 7, delta);
  //   //     /* eslint-disable  @typescript-eslint/no-explicit-any */
  //   //     (text as any).fillOpacity = e;
  //   //   });
  //   // }
  // });

  // 3D Apps code commented out - now using 2D HTML overlay (AppsGrid component)
  // const getTitle = () => {
  //   const title = 'PATS APPS';
  //   const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
  //   return title.split('').map((char, i) => {
  //     const diff = isSmallScreen ? 0.25 : 0.8;
  //     const fontSize = isSmallScreen ? 0.25 : 0.4;
  //     return (
  //       <Text key={i} {...fontProps} fontSize={fontSize} position={[i * diff, 2, 1]}>{char}</Text>
  //     );
  //   });
  // };

  // const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;

  // const apps = [
  //   {
  //     title: 'PRAYAI',
  //     id: 'prayai',
  //     color: '#b9c6d6',
  //     imageUrl: '/apps/prayai.png',
  //     link: 'https://prayai.org'
  //   },
  //   {
  //     title: 'FAKEFLEX',
  //     id: 'fakeflex',
  //     color: '#bdd1e3',
  //     imageUrl: '/apps/fakeflex.png',
  //     link: 'https://fakeflex.app'
  //   },
  //   {
  //     title: 'COMING SOON',
  //     id: 'app3',
  //     color: '#c6d6e3',
  //     imageUrl: undefined,
  //     link: undefined
  //   },
  //   {
  //     title: 'COMING SOON',
  //     id: 'app4',
  //     color: '#d1e3f0',
  //     imageUrl: undefined,
  //     link: undefined
  //   }
  // ];

  // const getApps = () => {
  //   if (isSmallScreen) {
  //     // Mobile: 2x2 grid layout with smaller tiles that fit on screen
  //     const gap = 1.8; // Smaller gap between tiles

  //     return apps.map((app, i) => {
  //       const row = Math.floor(i / 2); // 0 or 1
  //       const col = i % 2; // 0 or 1
  //       const x = (col - 0.5) * gap; // -0.9 or 0.9
  //       const y = (row - 0.5) * -gap; // 0.9 or -0.9

  //       return (
  //         <GridTile
  //           key={app.id}
  //           title={app.title}
  //           id={app.id}
  //           color={app.color}
  //           textAlign='center'
  //           position={new THREE.Vector3(x, y, 0)}
  //           imageUrl={app.imageUrl}
  //           link={app.link}
  //         />
  //       );
  //     });
  //   }

  //   // Desktop: Show all 4 in a row
  //   return apps.map((app, i) => (
  //     <GridTile
  //       key={app.id}
  //       title={app.title}
  //       id={app.id}
  //       color={app.color}
  //       textAlign='center'
  //       position={new THREE.Vector3((i - (apps.length - 1) / 2) * 4.5, 0, 0)}
  //       imageUrl={app.imageUrl}
  //       link={app.link}
  //     />
  //   ));
  // };

  return (
    <group position={[0, -41.5, 12]} rotation={[-Math.PI / 2, 0 ,-Math.PI / 2]}>
      <group rotation={[0, 0, Math.PI / 2]}>
        {/* 3D Apps section hidden - now using 2D HTML overlay (AppsGrid component) */}
        {/* <group ref={titleRef} position={[isSmallScreen ? -1.0 : -3.6, 2, -2]}>
          {getTitle()}
        </group>

        <group position={[0, isSmallScreen ? 0 : -1, 0]} ref={groupRef}>
          {getApps()}
        </group> */}
      </group>
    </group>
  );
};

export default Experience;