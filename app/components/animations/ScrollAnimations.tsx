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
  // Scroll 15-30% - Introduction Transition (Extended duration)
  {
    type: 'helix-scanner',
    scrollStart: 0.15,
    scrollEnd: 0.30,
    position: {
      desktop: { left: '5%', top: '20%' },
      mobile: { left: '8%', top: '20%' } // Moved in slightly, lowered
    },
    size: {
      desktop: { width: 240, height: 240 },
      mobile: { width: 160, height: 160 }
    },
    zIndex: 10
  },
  {
    type: 'crystalline-refraction',
    scrollStart: 0.15,
    scrollEnd: 0.30,
    position: {
      desktop: { right: '5%', top: '20%' },
      mobile: { right: '8%', top: '20%' } // Moved in slightly, lowered
    },
    size: {
      desktop: { width: 240, height: 240 },
      mobile: { width: 160, height: 160 }
    },
    zIndex: 10
  },

  // Scroll 30-50% - Build Momentum (Extended duration)
  {
    type: 'sphere-scan',
    scrollStart: 0.30,
    scrollEnd: 0.50,
    position: {
      desktop: { left: '15%', top: '35%' },
      mobile: { left: '12%', top: '35%' } // Centered better
    },
    size: {
      desktop: { width: 400, height: 400 },
      mobile: { width: 280, height: 280 }
    },
    zIndex: 15
  },
  {
    type: 'phased-array-emitter',
    scrollStart: 0.30,
    scrollEnd: 0.50,
    position: {
      desktop: { right: '10%', top: '25%' },
      mobile: { right: '12%', top: '28%' } // Better positioning
    },
    size: {
      desktop: { width: 300, height: 300 },
      mobile: { width: 200, height: 200 }
    },
    zIndex: 15
  },

  // Scroll 48-68% - Peak Interest Zone (Longer display, earlier start)
  {
    type: 'voxel-matrix-morph',
    scrollStart: 0.48,
    scrollEnd: 0.68,
    position: {
      desktop: { left: '50%', top: '40%', transform: 'translate(-50%, -50%)' },
      mobile: { left: '50%', top: '40%', transform: 'translate(-50%, -50%)' } // More centered
    },
    size: {
      desktop: { width: 600, height: 600 },
      mobile: { width: 400, height: 400 }
    },
    zIndex: 20
  },
  {
    type: 'sonar-sweep',
    scrollStart: 0.48,
    scrollEnd: 0.68,
    position: {
      desktop: { left: '10%', bottom: '25%' },
      mobile: { left: '10%', bottom: '28%' } // Moved up slightly
    },
    size: {
      desktop: { width: 360, height: 360 },
      mobile: { width: 240, height: 240 }
    },
    zIndex: 18
  },

  // Scroll 68-85% - Transition to Apps (Extended to bridge gap)
  {
    type: 'crystalline-cube-refraction',
    scrollStart: 0.68,
    scrollEnd: 0.85,
    position: {
      desktop: { right: '8%', top: '30%' },
      mobile: { right: '10%', top: '32%' } // Better visibility
    },
    size: {
      desktop: { width: 400, height: 400 },
      mobile: { width: 280, height: 280 }
    },
    zIndex: 16
  },
  {
    type: 'cylindrical-analysis',
    scrollStart: 0.68,
    scrollEnd: 0.85,
    position: {
      desktop: { left: '8%', top: '35%' },
      mobile: { left: '10%', top: '35%' } // More visible
    },
    size: {
      desktop: { width: 280, height: 280 },
      mobile: { width: 200, height: 200 }
    },
    zIndex: 16
  },

  // Scroll 75%+ - PATS APPS Section Background (Continuous)
  {
    type: 'interconnecting-waves',
    scrollStart: 0.75,
    scrollEnd: 1.0,
    position: {
      desktop: { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
      mobile: { left: '50%', top: '48%', transform: 'translate(-50%, -50%)' } // Slightly higher
    },
    size: {
      desktop: { width: 800, height: 800 },
      mobile: { width: 560, height: 560 }
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
