'use client';

import { useEffect, useState } from 'react';
import AppCard from './AppCard';
import { APPS } from './apps.config';

const AppsGrid = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Listen for custom event from 3D scene
    const handleScrollUpdate = (e: CustomEvent) => {
      // Show only when scroll range is > 0.75 (75% through the scene) - right after Don't Follow Pat and Fake In
      setIsVisible(e.detail.scrollPosition > 0.75);
    };

    window.addEventListener('scene-scroll-update', handleScrollUpdate as EventListener);

    return () => {
      window.removeEventListener('scene-scroll-update', handleScrollUpdate as EventListener);
    };
  }, []);

  if (!isMounted || !isVisible) return null;

  return (
    <div
      className="fixed left-0 right-0 z-50 px-4 md:px-8 pointer-events-none"
      style={{
        top: '20%',
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto pointer-events-auto">
        <h2
          className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-6 md:mb-8 tracking-widest drop-shadow-lg"
          style={{ fontFamily: 'var(--font-soria), sans-serif' }}
        >
          PATS APPS
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-sm md:max-w-none mx-auto">
          {APPS.map((app, index) => (
            <div
              key={app.id}
              style={{
                animation: `fadeInUp 0.5s ease-out ${0.1 * index}s forwards`,
                opacity: 0
              }}
            >
              <AppCard app={app} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppsGrid;
