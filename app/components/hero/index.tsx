'use client';

import { Text } from "@react-three/drei";

import { useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import CloudContainer from "../models/Cloud";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import { Bmw } from "../models/Bmw";
import { Porsche } from "../models/Porsche";
import { Jeep } from "../models/Jeep";
import TextWindow from "./TextWindow";

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const subtitleRef = useRef<THREE.Mesh>(null);
  const emailRef = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      gsap.fromTo(titleRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: isMobile ? 1 : 2,
        duration: 3
      });
    }
  }, [progress, isMobile]);

  useEffect(() => {
    if (progress === 100 && subtitleRef.current) {
      gsap.fromTo(subtitleRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: isMobile ? -1 : 0,
        duration: 3,
        delay: 0.2
      });
    }
  }, [progress, isMobile]);

  useEffect(() => {
    if (progress === 100 && emailRef.current) {
      gsap.fromTo(emailRef.current.position, {
        y: -10,
        duration: 1,
      }, {
        y: isMobile ? -2.2 : -1.2,
        duration: 3,
        delay: 0.4
      });
    }
  }, [progress, isMobile]);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: isMobile ? 1.2 : 1.6,
    color: "#ffffff",
    textAlign: 'center' as const,
  };

  const subtitleFontProps = {
    font: "./soria-font.ttf",
    fontSize: isMobile ? 0.5 : 0.6,
    color: "#ffffff",
    textAlign: 'center' as const,
  };

  const emailFontProps = {
    font: "./soria-font.ttf",
    fontSize: isMobile ? 0.45 : 0.55,
    color: "#ffffff",
    textAlign: 'center' as const,
  };

  const titlePosition: [number, number, number] = [0, isMobile ? 1 : 2, -10];
  const subtitlePosition: [number, number, number] = [0, isMobile ? -1 : 0, -10];
  const emailPosition: [number, number, number] = [0, isMobile ? -2.2 : -1.2, -10];

  return (
    <>
      <Text
        position={titlePosition}
        {...fontProps}
        ref={titleRef}
        maxWidth={isMobile ? 8 : 20}
        anchorX="center"
        anchorY="middle"
      >
        Hi, I am Patrick Francis.
      </Text>
      <Text
        position={subtitlePosition}
        {...subtitleFontProps}
        ref={subtitleRef}
        maxWidth={isMobile ? 8 : 20}
        anchorX="center"
        anchorY="middle"
      >
        Entrepreneur, App Developer, Author,{'\n'}and cool as F*CK
      </Text>
      <Text
        position={emailPosition}
        {...emailFontProps}
        ref={emailRef}
        maxWidth={isMobile ? 8 : 20}
        anchorX="center"
        anchorY="middle"
        onClick={() => window.open('mailto:Contact@DontFollowPat.com', '_blank')}
        onPointerOver={(e) => {
          if (e.object) {
            (e.object as any).material.color.set('#ffffff');
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={(e) => {
          if (e.object) {
            (e.object as any).material.color.set('#64c8ff');
            document.body.style.cursor = 'auto';
          }
        }}
      >
        Email: Contact@DontFollowPat.com
      </Text>
      <StarsContainer />
      <CloudContainer/>
      <Bmw />
      <Porsche />
      <Jeep />
      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10}/>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
