'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Canvas3DAnimation from '../animations/Canvas3DAnimation';
import { isMobile } from 'react-device-detect';

interface LoadingStage {
  threshold: number;
  message: string;
  icon: string;
}

const loadingStages: LoadingStage[] = [
  { threshold: 0, message: "Building something cool as F*CK...", icon: "🔥" },
  { threshold: 20, message: "Loading luxury rides...", icon: "🏎️" },
  { threshold: 40, message: "Preparing the experience...", icon: "✨" },
  { threshold: 60, message: "Almost there...", icon: "🚀" },
  { threshold: 80, message: "Final touches...", icon: "💎" },
  { threshold: 95, message: "Ready to flex...", icon: "💪" },
];

const loadingTips = [
  "Entrepreneur, App Developer, and Author",
  "Creator of PrayAI - Your AI Prayer Companion",
  "Creator of FakeFlex - Flex Like a Boss",
  "Building the future of mobile apps",
  "Cool as F*CK since day one",
  "Contact@DontFollowPat.com for collaborations",
];

interface EnhancedLoaderProps {
  progress: number;
}

export const EnhancedLoader = ({ progress }: EnhancedLoaderProps) => {
  const [currentStage, setCurrentStage] = useState(loadingStages[0]);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Update stage based on progress
    const stage = [...loadingStages]
      .reverse()
      .find(s => progress >= s.threshold) || loadingStages[0];
    setCurrentStage(stage);
  }, [progress]);

  // Rotate tips every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % loadingTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-transparent to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* 3D Canvas Animation from /dist folder - Skip on mobile for better performance */}
        {!isMobile && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Canvas3DAnimation
              animationType="sphere-scan"
              width={140}
              height={140}
              className="drop-shadow-2xl"
            />
          </motion.div>
        )}

        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-white text-center"
        >
          <motion.span
            className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            DontFollowPat
          </motion.span>
        </motion.div>

        {/* Progress bar with glow and shimmer */}
        <div className="relative w-full max-w-sm md:max-w-md h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'linear',
              }}
            />

            {/* Glow effect */}
            <div
              className="absolute inset-0 blur-sm"
              style={{
                boxShadow: '0 0 20px rgba(100, 200, 255, 0.8)',
              }}
            />
          </motion.div>

          {/* Particle effects - Reduce count for performance */}
          {!isMobile && [...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              animate={{
                x: [`${progress}%`, `${progress + Math.random() * 5}%`],
                y: [0, -20],
                opacity: [1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeOut",
              }}
              style={{ left: 0, top: '50%' }}
            />
          ))}
        </div>

        {/* Progress percentage with pulse */}
        <motion.div
          className="text-3xl md:text-4xl font-bold text-white"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {Math.floor(progress)}%
        </motion.div>

        {/* Current stage with icon animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 text-lg md:text-xl text-gray-300"
          >
            <motion.span
              className="text-2xl md:text-3xl"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              {currentStage.icon}
            </motion.span>
            <span>{currentStage.message}</span>
          </motion.div>
        </AnimatePresence>

        {/* Rotating tips with fade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.5 }}
            className="text-sm md:text-base text-gray-400 italic max-w-md text-center px-4"
          >
            {loadingTips[tipIndex]}
          </motion.div>
        </AnimatePresence>

        {/* Pulsing dots indicator */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner sparkles */}
      {[
        { top: '10%', left: '10%' },
        { top: '15%', right: '15%' },
        { bottom: '20%', left: '15%' },
        { bottom: '15%', right: '10%' },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={pos}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
