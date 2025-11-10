'use client';

import { useEffect, useState } from 'react';
import Canvas3DAnimation from './Canvas3DAnimation';

interface AnimationConfig {
  type: string;
  scrollStart: number; // 0-1 range
  scrollEnd: number; // 0-1 range
  position: {
    desktop: { top?: string; left?: string; right?: string; bottom?: string; transform?: string };
    mobile: { top?: string; left?: string; right?: string; bottom?: string; transform?: string };
  };
  size: {
    desktop: { width: number; height: number };
    mobile: { width: number; height: number };
  };
  zIndex?: number;
}

const animations: AnimationConfig[] = [
  // Scroll 15-25% - Introduction Transition
  {
    type: 'helix-scanner',
    scrollStart: 0.15,
    scrollEnd: 0.25,
    position: {
      desktop: { left: '5%', top: '20%' },
      mobile: { left: '5%', top: '15%' }
    },
    size: {
      desktop: { width: 120, height: 120 },
      mobile: { width: 80, height: 80 }
    },
    zIndex: 10
  },
  {
    type: 'crystalline-refraction',
    scrollStart: 0.15,
    scrollEnd: 0.25,
    position: {
      desktop: { right: '5%', top: '20%' },
      mobile: { right: '5%', top: '15%' }
    },
    size: {
      desktop: { width: 120, height: 120 },
      mobile: { width: 80, height: 80 }
    },
    zIndex: 10
  },

  // Scroll 30-45% - Build Momentum
  {
    type: 'sphere-scan',
    scrollStart: 0.30,
    scrollEnd: 0.45,
    position: {
      desktop: { left: '15%', top: '35%' },
      mobile: { left: '10%', top: '30%' }
    },
    size: {
      desktop: { width: 200, height: 200 },
      mobile: { width: 140, height: 140 }
    },
    zIndex: 15
  },
  {
    type: 'phased-array-emitter',
    scrollStart: 0.30,
    scrollEnd: 0.45,
    position: {
      desktop: { right: '10%', top: '25%' },
      mobile: { right: '5%', top: '20%' }
    },
    size: {
      desktop: { width: 150, height: 150 },
      mobile: { width: 100, height: 100 }
    },
    zIndex: 15
  },

  // Scroll 50-65% - Peak Interest Zone (HERO)
  {
    type: 'voxel-matrix-morph',
    scrollStart: 0.50,
    scrollEnd: 0.65,
    position: {
      desktop: { left: '50%', top: '40%', transform: 'translate(-50%, -50%)' },
      mobile: { left: '50%', top: '35%', transform: 'translate(-50%, -50%)' }
    },
    size: {
      desktop: { width: 300, height: 300 },
      mobile: { width: 200, height: 200 }
    },
    zIndex: 20
  },
  {
    type: 'sonar-sweep',
    scrollStart: 0.50,
    scrollEnd: 0.65,
    position: {
      desktop: { left: '10%', bottom: '25%' },
      mobile: { left: '5%', bottom: '20%' }
    },
    size: {
      desktop: { width: 180, height: 180 },
      mobile: { width: 120, height: 120 }
    },
    zIndex: 18
  },

  // Scroll 70-75% - Transition to Apps
  {
    type: 'crystalline-cube-refraction',
    scrollStart: 0.70,
    scrollEnd: 0.80,
    position: {
      desktop: { right: '8%', top: '30%' },
      mobile: { right: '5%', top: '25%' }
    },
    size: {
      desktop: { width: 200, height: 200 },
      mobile: { width: 140, height: 140 }
    },
    zIndex: 16
  },
  {
    type: 'cylindrical-analysis',
    scrollStart: 0.70,
    scrollEnd: 0.80,
    position: {
      desktop: { left: '8%', top: '35%' },
      mobile: { left: '5%', top: '30%' }
    },
    size: {
      desktop: { width: 140, height: 140 },
      mobile: { width: 100, height: 100 }
    },
    zIndex: 16
  },

  // Scroll 75%+ - PATS APPS Section Background
  {
    type: 'interconnecting-waves',
    scrollStart: 0.75,
    scrollEnd: 1.0,
    position: {
      desktop: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
      mobile: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }
    },
    size: {
      desktop: { width: 400, height: 400 },
      mobile: { width: 280, height: 280 }
    },
    zIndex: 5
  }
];

const ScrollAnimations = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Listen to scroll updates from ScrollWrapper
    const handleScroll = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.scrollPosition !== undefined) {
        setScrollPosition(customEvent.detail.scrollPosition);
      }
    };

    window.addEventListener('scene-scroll-update', handleScroll);

    return () => {
      window.removeEventListener('scene-scroll-update', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const getOpacity = (config: AnimationConfig): number => {
    const { scrollStart, scrollEnd } = config;
    const fadeRange = 0.05; // Fade in/out over 5% scroll

    if (scrollPosition < scrollStart) {
      return 0;
    } else if (scrollPosition < scrollStart + fadeRange) {
      // Fade in
      return (scrollPosition - scrollStart) / fadeRange;
    } else if (scrollPosition < scrollEnd - fadeRange) {
      // Fully visible
      return 1;
    } else if (scrollPosition < scrollEnd) {
      // Fade out
      return (scrollEnd - scrollPosition) / fadeRange;
    } else {
      return 0;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      {animations.map((config, index) => {
        const opacity = getOpacity(config);
        if (opacity === 0) return null;

        const position = isMobileView ? config.position.mobile : config.position.desktop;
        const size = isMobileView ? config.size.mobile : config.size.desktop;

        return (
          <div
            key={`${config.type}-${index}`}
            style={{
              position: 'absolute',
              ...position,
              opacity,
              transition: 'opacity 0.5s ease-out',
              zIndex: config.zIndex || 10,
              filter: `
                drop-shadow(0 0 15px rgba(100, 200, 255, ${opacity * 0.4}))
                drop-shadow(0 0 30px rgba(100, 200, 255, ${opacity * 0.2}))
                drop-shadow(0 0 5px rgba(255, 255, 255, ${opacity * 0.6}))
              `
            }}
          >
            <Canvas3DAnimation
              animationType={config.type}
              width={size.width}
              height={size.height}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ScrollAnimations;
