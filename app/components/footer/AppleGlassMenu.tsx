'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FOOTER_LINKS } from '../../constants';

const AppleGlassMenu = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-container glass-container--rounded">
        <div className="glass-filter"></div>
        <div className="glass-overlay"></div>
        <div className="glass-specular"></div>
        <div className="glass-content">
          {FOOTER_LINKS.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-item"
              title={link.hoverText}
            >
              <Image
                src={link.icon}
                alt={link.name}
                width={56}
                height={56}
                className="glass-icon"
                quality={90}
                priority={index < 3}
              />
            </a>
          ))}
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
        <filter id="lensFilter" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feComponentTransfer in="SourceAlpha" result="alpha">
            <feFuncA type="identity" />
          </feComponentTransfer>
          <feGaussianBlur in="alpha" stdDeviation="50" result="blur" />
          <feDisplacementMap in="SourceGraphic" in2="blur" scale="50" xChannelSelector="A" yChannelSelector="A" />
        </filter>
      </svg>

      <style jsx>{`
        .glass-container {
          position: relative;
          display: flex;
          align-items: center;
          background: transparent;
          border-radius: 2rem;
          overflow: hidden;
          box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
        }

        .glass-container--rounded {
          border-radius: 3rem;
        }

        .glass-filter,
        .glass-overlay,
        .glass-specular {
          position: absolute;
          inset: 0;
          border-radius: inherit;
        }

        .glass-filter {
          z-index: 0;
          backdrop-filter: blur(20px);
          filter: saturate(120%) brightness(1.15);
        }

        .glass-overlay {
          z-index: 1;
          background: rgba(255, 255, 255, 0.25);
        }

        .glass-specular {
          z-index: 2;
          box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.75), inset 0 0 5px rgba(255, 255, 255, 0.75);
        }

        .glass-content {
          position: relative;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 12px 28px;
          gap: 1.5rem;
        }

        .glass-item {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.25s ease-out;
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.25));
        }

        .glass-item:hover {
          transform: scale(1.15) translateY(-4px);
        }

        .glass-item:active {
          transform: scale(0.95);
        }

        .glass-icon {
          width: 56px;
          height: 56px;
          object-fit: contain;
        }

        @media (max-width: 768px) {
          .glass-content {
            gap: 0.75rem;
            padding: 8px 16px;
          }

          .glass-icon {
            width: 40px;
            height: 40px;
          }

          .glass-container--rounded {
            border-radius: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AppleGlassMenu;
