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
  { threshold: 0, message: "Initializing systems...", icon: ">" },
  { threshold: 15, message: "Loading 3D models...", icon: "█" },
  { threshold: 30, message: "Rendering luxury rides...", icon: "▓" },
  { threshold: 50, message: "Compiling animations...", icon: "▒" },
  { threshold: 70, message: "Optimizing experience...", icon: "░" },
  { threshold: 85, message: "Final systems check...", icon: "■" },
  { threshold: 95, message: "Ready to launch...", icon: "✓" },
];

const loadingTips = [
  "patrick.francis@init: ~$ loading portfolio",
  "patrick.francis@init: ~$ sudo make-it-dope",
  "patrick.francis@init: ~$ compiling awesome",
  "patrick.francis@init: ~$ npm run flex",
  "patrick.francis@init: ~$ rendering coolness",
  "patrick.francis@init: ~$ git push --force origin main",
];

interface EnhancedLoaderProps {
  progress: number;
}

export const EnhancedLoader = ({ progress }: EnhancedLoaderProps) => {
  const [currentStage, setCurrentStage] = useState(loadingStages[0]);
  const [tipIndex, setTipIndex] = useState(0);
  const [matrixColumns, setMatrixColumns] = useState<number[]>([]);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    // Update stage based on progress
    const stage = [...loadingStages]
      .reverse()
      .find(s => progress >= s.threshold) || loadingStages[0];
    setCurrentStage(stage);
  }, [progress]);

  // Add terminal line when stage changes
  useEffect(() => {
    if (currentStage.message) {
      setTerminalLines(prev => [...prev, `> ${currentStage.message}`].slice(-5));
    }
  }, [currentStage]);

  // Initialize Matrix columns - fewer on mobile for better performance
  // Delay initialization to not block first paint
  useEffect(() => {
    const timer = setTimeout(() => {
      const columns = Array.from({ length: isMobile ? 6 : 15 }, () => Math.random() * 100);
      setMatrixColumns(columns);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Rotate tips every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % loadingTips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Detect if loading is stuck at high percentage
  useEffect(() => {
    if (progress >= 95 && progress < 100) {
      const stuckTimer = setTimeout(() => {
        setIsStuck(true);
      }, 1000); // Mark as stuck after 1 second at 95%+
      return () => clearTimeout(stuckTimer);
    } else {
      setIsStuck(false);
    }
  }, [progress]);

  return (
    <AnimatePresence mode="wait">
      {progress < 100 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(to bottom, #000814, #001d3d, #000814)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
      {/* Matrix Rain Effect - Only render after columns are initialized */}
      {matrixColumns.length > 0 && (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${isMobile ? 'opacity-10' : 'opacity-20'}`}>
          {matrixColumns.map((offset, i) => (
            <motion.div
              key={i}
              className="absolute top-0 text-cyan-400 text-xs font-mono"
              style={{
                left: `${(i / matrixColumns.length) * 100}%`,
                textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
              }}
              initial={{ y: -100 }}
              animate={{
                y: ['0vh', '120vh'],
              }}
              transition={{
                duration: isMobile ? 12 : 10 + Math.random() * 4,
                repeat: Infinity,
                delay: offset / 20,
                ease: 'linear',
              }}
            >
              {Array.from({ length: isMobile ? 10 : 15 }, () =>
                String.fromCharCode(33 + Math.random() * 94)
              ).join('\n')}
            </motion.div>
          ))}
        </div>
      )}

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6 px-3 md:px-4 w-full max-w-4xl">
        {/* Terminal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
          style={{
            background: 'rgba(0, 20, 40, 0.9)',
            border: '2px solid rgba(0, 255, 255, 0.3)',
            borderRadius: isMobile ? '8px' : '12px',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 100, 150, 0.1)',
          }}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 border-b border-cyan-900/50">
            <div className="flex gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="ml-2 md:ml-4 text-cyan-400 text-xs md:text-sm font-mono truncate">
              {isMobile ? 'patrick@terminal' : 'patrick.francis@terminal'}
            </span>
          </div>

          {/* Terminal Content */}
          <div className="p-4 md:p-6 font-mono text-xs md:text-sm">
            {/* Name Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4 md:mb-6"
            >
              <div className="text-cyan-400 text-2xl md:text-5xl font-bold mb-2 tracking-wider break-words"
                style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
              >
                {'>'} PATRICK {isMobile && <br />}FRANCIS
              </div>
              <motion.div
                className="text-cyan-300 text-sm md:text-xl"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading some dope sh*t hold on...
              </motion.div>
            </motion.div>

            {/* Terminal Output Lines - Only show on desktop or when there are lines */}
            {(!isMobile || terminalLines.length > 0) && (
              <div className="space-y-1 mb-3 md:mb-4 text-cyan-400/80 text-[10px] md:text-sm max-h-20 overflow-hidden">
                {terminalLines.slice(-3).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="truncate"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Command Prompt with Cursor - Simplified on mobile */}
            <div className="flex items-center gap-1 md:gap-2 text-cyan-400 text-[10px] md:text-sm overflow-hidden">
              <span className="truncate">{loadingTips[tipIndex]}</span>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex-shrink-0"
              >
                _
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* 3D Animation - Smaller and to the side on desktop */}
        {!isMobile && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute right-8 top-8"
          >
            <Canvas3DAnimation
              animationType="sphere-scan"
              width={150}
              height={150}
              className="drop-shadow-2xl"
            />
          </motion.div>
        )}

        {/* Enhanced Progress Section */}
        <div className="w-full space-y-3 md:space-y-4">
          {/* Progress Bar Container */}
          <div className="relative">
            <div className="relative w-full h-2.5 md:h-3 bg-black/50 rounded-lg overflow-hidden"
              style={{
                border: '1px solid rgba(0, 255, 255, 0.3)',
                boxShadow: 'inset 0 0 10px rgba(0, 100, 150, 0.3)',
              }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-lg"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #0096c7, #00b4d8, #48cae4)',
                }}
                initial={{ width: 0 }}
                animate={{
                  width: `${progress}%`,
                  boxShadow: isStuck
                    ? [
                        '0 0 20px rgba(0, 180, 216, 0.6)',
                        '0 0 30px rgba(0, 180, 216, 0.9)',
                        '0 0 20px rgba(0, 180, 216, 0.6)'
                      ]
                    : '0 0 20px rgba(0, 180, 216, 0.6)'
                }}
                transition={{
                  width: { duration: 0.3 },
                  boxShadow: isStuck ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }
                }}
              >
                {/* Animated scan line - always visible and smooth */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5, // Faster for more visible movement
                    ease: 'linear',
                  }}
                />
              </motion.div>

              {/* Progress segments indicator */}
              <div className="absolute inset-0 flex">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-cyan-900/30"
                  />
                ))}
              </div>
            </div>

            {/* Progress Text and Percentage */}
            <div className="flex justify-between items-center mt-2 text-cyan-400 font-mono text-xs md:text-sm">
              <span className="truncate mr-2">
                {currentStage.icon} {isStuck ? 'Finalizing...' : currentStage.message}
              </span>
              <motion.span
                className="text-base md:text-lg font-bold flex-shrink-0"
                animate={isStuck
                  ? {
                      scale: [1, 1.05, 1],
                      textShadow: [
                        '0 0 10px rgba(0, 255, 255, 0.5)',
                        '0 0 20px rgba(0, 255, 255, 0.8)',
                        '0 0 10px rgba(0, 255, 255, 0.5)'
                      ]
                    }
                  : { scale: [1, 1.1, 1] }
                }
                transition={{ duration: isStuck ? 1.2 : 0.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}
              >
                {Math.floor(progress)}%
              </motion.span>
            </div>
          </div>

          {/* System Stats - Interactive Elements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs font-mono">
            {[
              { label: 'CPU', value: `${Math.min(95, progress + 5)}%` },
              { label: 'MEMORY', value: `${Math.floor(512 + progress * 5)}MB` },
              { label: 'GPU', value: `${Math.min(88, progress + 8)}%` },
              { label: 'NETWORK', value: `${Math.floor(10 + progress * 2)}MB/s` },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-black/40 border border-cyan-900/50 rounded px-2 py-1.5 md:px-3 md:py-2"
                style={{ boxShadow: '0 0 10px rgba(0, 100, 150, 0.2)' }}
              >
                <div className="text-cyan-600 text-[9px] md:text-[10px] uppercase">{stat.label}</div>
                <motion.div
                  className="text-cyan-400 font-bold text-xs md:text-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {stat.value}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Corner sparkles - Reduced on mobile */}
      {!isMobile && [
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
