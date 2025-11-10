import gsap from "gsap";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  return (
    <div className="fixed w-full top-24 scroll-hint" style={{ opacity: 0, zIndex: 100 }}>
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="scroll-hint-icon">
          <Image src={svgSrc} width={24} height={24} alt="scroll indicator" loading="lazy" />
        </div>
        <span className="text-white text-sm font-medium tracking-wider">{hintText}</span>
      </div>
    </div>
  );
}