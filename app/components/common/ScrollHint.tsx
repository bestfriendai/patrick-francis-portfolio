import gsap from "gsap";
import Image from "next/image";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

import { usePortalStore, useScrollStore } from "@stores";

export const ScrollHint = () => {
  const [hintText, setHintText] = useState('');
  const [showScrollHint, setShowScrollHint] = useState(false);
  const portal = usePortalStore((state) => state.activePortalId);
  const scrollProgress = useScrollStore((state) => state.scrollProgress);

  // Show 'Scroll' for Hero and work portals, 'Pan' for Projects portal.
  useEffect(() => {
    if (!portal) {
      if (scrollProgress === 0) {
        setHintText('SCROLL');
        setShowScrollHint(true);
      } else if (scrollProgress > 0 && scrollProgress < 0.3) {
        setHintText('KEEP SCROLLING');
        setShowScrollHint(true);
      } else if (scrollProgress >= 0.3 && scrollProgress < 0.65) {
        setHintText('KEEP SCROLLING');
        setShowScrollHint(true);
      } else if (scrollProgress >= 0.65 && scrollProgress < 0.75) {
        setHintText('ALMOST THERE');
        setShowScrollHint(true);
      } else if (scrollProgress >= 0.75) {
        setHintText('OK, STOP SCROLLING');
        setShowScrollHint(true);
      } else {
        setShowScrollHint(false);
      }
    } else {
      if (portal === 'work') {
        setHintText('SCROLL');
        setShowScrollHint(scrollProgress === 0);
      } else {
        setHintText('PAN');
        setShowScrollHint(true);
      }
    }
  }, [portal, scrollProgress]);

  useEffect(() => {
    if (showScrollHint) {
      gsap.to('.scroll-hint', {
        opacity: 1,
        duration: 1.5,
        delay: 2,
      });
      gsap.to('.scroll-hint-icon', {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    } else {
      gsap.killTweensOf('.scroll-hint');
      gsap.killTweensOf('.scroll-hint-icon');
      gsap.to('.scroll-hint', {
        opacity: 0,
        duration: 0.5,
      });
    }
  }, [showScrollHint]);

  const svgSrc = hintText === 'PAN' ? 'icons/chevrons-left-right.svg' : 'icons/chevrons-up-down.svg';
  const isStopMessage = hintText === 'OK, STOP SCROLLING';

  // Position based on scroll progress
  const getPosition = () => {
    if (scrollProgress >= 0.75) {
      // At Pat's Apps section - lower on screen, above menu
      return isMobile ? '75%' : '70%';
    } else {
      // In header area - below menu
      return isMobile ? '4.5rem' : '5.5rem';
    }
  };

  return (
    <div
      className="fixed w-full scroll-hint"
      style={{
        opacity: 0,
        zIndex: 100,
        top: getPosition(),
      }}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {!isStopMessage && (
          <div className="scroll-hint-icon">
            <Image
              src={svgSrc}
              width={isMobile ? 28 : 24}
              height={isMobile ? 28 : 24}
              alt="scroll indicator"
              loading="lazy"
            />
          </div>
        )}
        <span
          className="text-white font-bold tracking-wider"
          style={{
            fontSize: isStopMessage ? (isMobile ? '1.5rem' : '1.25rem') : (isMobile ? '0.85rem' : '0.875rem'),
            textShadow: isStopMessage
              ? '0 0 20px rgba(0, 255, 255, 0.8), 0 2px 6px rgba(0, 0, 0, 0.8)'
              : '0 0 10px rgba(0, 0, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5)',
            color: isStopMessage ? '#00ffff' : '#ffffff',
          }}
        >
          {hintText}
        </span>
      </div>
    </div>
  );
}