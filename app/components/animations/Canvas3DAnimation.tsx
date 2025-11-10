'use client';

import { useEffect, useRef } from 'react';

interface Canvas3DAnimationProps {
  animationType: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Canvas3DAnimation: React.FC<Canvas3DAnimationProps> = ({
  animationType,
  width = 180,
  height = 180,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CANVAS_WIDTH = width;
    const CANVAS_HEIGHT = height;
    const MONOCHROME_FILL = (opacity: number) =>
      `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;
    const MONOCHROME_STROKE = (opacity: number) =>
      `rgba(255, 255, 255, ${Math.max(0, Math.min(1, opacity))})`;
    const GLOW_FILL = (opacity: number) =>
      `rgba(100, 200, 255, ${Math.max(0, Math.min(1, opacity))})`;
    const GLOBAL_SPEED = 0.7;

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let time = 0;
    let lastTime = 0;
    let isRunning = true;

    const animations: { [key: string]: (timestamp: number) => void } = {
      'sphere-scan': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.0005 * GLOBAL_SPEED;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const radius = CANVAS_WIDTH * 0.4;
        const numDots = 250;

        if (!animations['sphere-scan-dots']) {
          const dots = [];
          for (let i = 0; i < numDots; i++) {
            const theta = Math.acos(1 - 2 * (i / numDots));
            const phi = Math.sqrt(numDots * Math.PI) * theta;
            dots.push({
              x: radius * Math.sin(theta) * Math.cos(phi),
              y: radius * Math.sin(theta) * Math.sin(phi),
              z: radius * Math.cos(theta)
            });
          }
          (animations as any)['sphere-scan-dots'] = dots;
        }

        const dots = (animations as any)['sphere-scan-dots'];
        const rotX = Math.sin(time * 0.3) * 0.5;
        const rotY = time * 0.5;
        const easedTime = easeInOutCubic((Math.sin(time * 2.5) + 1) / 2);
        const scanLine = (easedTime * 2 - 1) * radius;
        const scanWidth = 25;

        dots.forEach((dot: any) => {
          let { x, y, z } = dot;
          let nX = x * Math.cos(rotY) - z * Math.sin(rotY);
          let nZ = x * Math.sin(rotY) + z * Math.cos(rotY);
          x = nX;
          z = nZ;
          let nY = y * Math.cos(rotX) - z * Math.sin(rotX);
          nZ = y * Math.sin(rotX) + z * Math.cos(rotX);
          y = nY;
          z = nZ;
          const scale = (z + radius * 1.5) / (radius * 2.5);
          const pX = centerX + x;
          const pY = centerY + y;
          const distToScan = Math.abs(y - scanLine);
          let scanInfluence =
            distToScan < scanWidth
              ? Math.cos((distToScan / scanWidth) * (Math.PI / 2))
              : 0;
          const size = Math.max(0, scale * 2.5 + scanInfluence * 3.5);
          const opacity = Math.max(0, scale * 0.7 + scanInfluence * 0.5);

          // Add glow effect for scan line
          if (scanInfluence > 0) {
            ctx.beginPath();
            ctx.arc(pX, pY, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = GLOW_FILL(scanInfluence * 0.2);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(pX, pY, size, 0, Math.PI * 2);
          ctx.fillStyle = scanInfluence > 0.3 ? GLOW_FILL(opacity) : MONOCHROME_FILL(opacity);
          ctx.fill();
        });
      },

      'crystalline-refraction': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.16 * GLOBAL_SPEED;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const gridSize = 15;
        const spacing = CANVAS_WIDTH / (gridSize - 1);

        if (!animations['crystalline-refraction-dots']) {
          const dots = [];
          for (let r = 0; r < gridSize; r++)
            for (let c = 0; c < gridSize; c++)
              dots.push({ x: c * spacing, y: r * spacing });
          (animations as any)['crystalline-refraction-dots'] = dots;
        }

        const dots = (animations as any)['crystalline-refraction-dots'];
        const waveRadius = time % (CANVAS_WIDTH * 1.2);
        const waveWidth = 60;

        // Draw connecting lines first (behind dots)
        dots.forEach((dot: any, i: number) => {
          const dist = Math.hypot(dot.x - centerX, dot.y - centerY);
          const distToWave = Math.abs(dist - waveRadius);
          if (distToWave < waveWidth / 2 && i % 3 === 0) {
            const neighbors = dots.filter((_: any, j: number) => Math.abs(i - j) < 20 && j !== i);
            neighbors.forEach((neighbor: any) => {
              const neighborDist = Math.hypot(neighbor.x - centerX, neighbor.y - centerY);
              const neighborDistToWave = Math.abs(neighborDist - waveRadius);
              if (neighborDistToWave < waveWidth / 2) {
                ctx.beginPath();
                ctx.moveTo(dot.x, dot.y);
                ctx.lineTo(neighbor.x, neighbor.y);
                ctx.strokeStyle = GLOW_FILL(0.15);
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            });
          }
        });

        dots.forEach((dot: any) => {
          const dist = Math.hypot(dot.x - centerX, dot.y - centerY);
          const distToWave = Math.abs(dist - waveRadius);
          let displacement = 0;
          if (distToWave < waveWidth / 2) {
            const wavePhase = (distToWave / (waveWidth / 2)) * Math.PI;
            displacement = easeInOutCubic(Math.sin(wavePhase)) * 12;
          }
          const angleToCenter = Math.atan2(dot.y - centerY, dot.x - centerX);
          const dx = Math.cos(angleToCenter) * displacement;
          const dy = Math.sin(angleToCenter) * displacement;
          const opacity = 0.3 + (Math.abs(displacement) / 12) * 0.7;
          const size = 1.5 + (Math.abs(displacement) / 12) * 2.5;

          // Glow effect
          if (Math.abs(displacement) > 6) {
            ctx.beginPath();
            ctx.arc(dot.x + dx, dot.y + dy, size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = GLOW_FILL((Math.abs(displacement) / 12) * 0.15);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(dot.x + dx, dot.y + dy, size, 0, Math.PI * 2);
          ctx.fillStyle = Math.abs(displacement) > 6 ? GLOW_FILL(opacity) : MONOCHROME_FILL(opacity);
          ctx.fill();
        });
      },

      'helix-scanner': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001 * GLOBAL_SPEED;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const numDots = 100;
        const radius = 35;
        const height = 120;

        if (!animations['helix-scanner-dots']) {
          const dots = [];
          for (let i = 0; i < numDots; i++)
            dots.push({ angle: i * 0.3, y: (i / numDots) * height - height / 2 });
          (animations as any)['helix-scanner-dots'] = dots;
        }

        const dots = (animations as any)['helix-scanner-dots'];
        const loopDuration = 8;
        const seamlessProgress = Math.sin((time / loopDuration) * Math.PI * 2);
        const scanY = seamlessProgress * (height / 2);
        const scanWidth = 25;
        const trailLength = height * 0.3;

        dots.forEach((dot: any) => {
          const rotation = time;
          const x = radius * Math.cos(dot.angle + rotation);
          const z = radius * Math.sin(dot.angle + rotation);
          const pX = centerX + x;
          const pY = centerY + dot.y;
          const scale = (z + radius) / (radius * 2);
          const distToScan = Math.abs(dot.y - scanY);
          const leadingEdgeInfluence =
            distToScan < scanWidth
              ? Math.cos((distToScan / scanWidth) * (Math.PI / 2))
              : 0;
          let trailInfluence = 0;
          const distBehindScan = dot.y - scanY;
          const isMovingUp = Math.cos((time / loopDuration) * Math.PI * 2) > 0;
          if (
            isMovingUp &&
            distBehindScan < 0 &&
            Math.abs(distBehindScan) < trailLength
          ) {
            trailInfluence =
              Math.pow(1 - Math.abs(distBehindScan) / trailLength, 2) * 0.4;
          } else if (
            !isMovingUp &&
            distBehindScan > 0 &&
            Math.abs(distBehindScan) < trailLength
          ) {
            trailInfluence =
              Math.pow(1 - Math.abs(distBehindScan) / trailLength, 2) * 0.4;
          }
          const totalInfluence = Math.max(leadingEdgeInfluence, trailInfluence);
          const size = Math.max(0, scale * 1.8 + totalInfluence * 2.8);
          const opacity = Math.max(0, scale * 0.4 + totalInfluence * 0.6);
          ctx.beginPath();
          ctx.arc(pX, pY, size, 0, Math.PI * 2);
          ctx.fillStyle = MONOCHROME_FILL(opacity);
          ctx.fill();
        });
      },

      'voxel-matrix-morph': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.0005 * GLOBAL_SPEED;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const gridSize = 6;
        const spacing = 18;
        const totalSize = (gridSize - 1) * spacing;

        if (!animations['voxel-matrix-morph-points']) {
          const points = [];
          for (let x = 0; x < gridSize; x++)
            for (let y = 0; y < gridSize; y++)
              for (let z = 0; z < gridSize; z++)
                points.push({
                  x: (x - (gridSize - 1) / 2) * spacing,
                  y: (y - (gridSize - 1) / 2) * spacing,
                  z: (z - (gridSize - 1) / 2) * spacing
                });
          (animations as any)['voxel-matrix-morph-points'] = points;
        }

        const points = (animations as any)['voxel-matrix-morph-points'];
        const rotX = time * 0.4;
        const rotY = time * 0.6;
        const easedTime = easeInOutCubic((Math.sin(time * 2) + 1) / 2);
        const scanLine = (easedTime * 2 - 1) * (totalSize / 2 + 10);
        const scanWidth = 30;

        points.forEach((p: any) => {
          let { x, y, z } = p;
          let nX = x * Math.cos(rotY) - z * Math.sin(rotY);
          let nZ = x * Math.sin(rotY) + z * Math.cos(rotY);
          x = nX;
          z = nZ;
          let nY = y * Math.cos(rotX) - z * Math.sin(rotX);
          nZ = y * Math.sin(rotX) + z * Math.cos(rotX);
          y = nY;
          z = nZ;
          const distToScan = Math.abs(y - scanLine);
          let scanInfluence = 0;
          let displacement = 1;
          if (distToScan < scanWidth) {
            scanInfluence = Math.cos((distToScan / scanWidth) * (Math.PI / 2));
            displacement = 1 + scanInfluence * 0.4;
          }
          const scale = (z + 80) / 160;
          const pX = centerX + x * displacement;
          const pY = centerY + y * displacement;
          const size = Math.max(0, scale * 2.5 + scanInfluence * 3);
          const opacity = Math.max(0.15, scale * 0.8 + scanInfluence * 0.4);

          // Glow effect for scan line
          if (scanInfluence > 0.3) {
            ctx.beginPath();
            ctx.arc(pX, pY, size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = GLOW_FILL(scanInfluence * 0.2);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(pX, pY, size, 0, Math.PI * 2);
          ctx.fillStyle = scanInfluence > 0.5 ? GLOW_FILL(opacity) : MONOCHROME_FILL(opacity);
          ctx.fill();

          // Core highlight
          if (scanInfluence > 0.5) {
            ctx.beginPath();
            ctx.arc(pX, pY, size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(1);
            ctx.fill();
          }
        });
      },

      'sonar-sweep': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time = timestamp;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const fadeTime = 2500;

        if (!animations['sonar-sweep-rings']) {
          const rings = [];
          for (let r = 20; r <= 80; r += 15)
            for (let i = 0; i < r / 2; i++)
              rings.push({
                r,
                angle: (i / (r / 2)) * Math.PI * 2,
                lastSeen: -fadeTime
              });
          (animations as any)['sonar-sweep-rings'] = rings;
        }

        const rings = (animations as any)['sonar-sweep-rings'];
        const scanAngle =
          (time * 0.001 * (Math.PI / 2) * GLOBAL_SPEED) % (Math.PI * 2);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + 85 * Math.cos(scanAngle),
          centerY + 85 * Math.sin(scanAngle)
        );
        ctx.strokeStyle = MONOCHROME_STROKE(0.5);
        ctx.lineWidth = 1;
        ctx.stroke();

        rings.forEach((dot: any) => {
          let angleDiff = Math.abs(dot.angle - scanAngle);
          if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
          if (angleDiff < 0.05) dot.lastSeen = time;
          const timeSinceSeen = time - dot.lastSeen;
          if (timeSinceSeen < fadeTime) {
            const t = timeSinceSeen / fadeTime;
            const opacity = 1 - easeInOutCubic(t);
            const size = 1 + opacity * 1.5;
            const x = centerX + dot.r * Math.cos(dot.angle);
            const y = centerY + dot.r * Math.sin(dot.angle);
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(opacity);
            ctx.fill();
          }
        });
      },

      'crystalline-cube-refraction': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.0003 * GLOBAL_SPEED;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const fov = 250;
        const gridSize = 7;
        const spacing = 15;
        const cubeHalfSize = ((gridSize - 1) * spacing) / 2;
        const maxDist = Math.hypot(cubeHalfSize, cubeHalfSize, cubeHalfSize);

        if (!animations['crystalline-cube-refraction-points']) {
          const points = [];
          for (let x = 0; x < gridSize; x++)
            for (let y = 0; y < gridSize; y++)
              for (let z = 0; z < gridSize; z++)
                points.push({
                  x: x * spacing - cubeHalfSize,
                  y: y * spacing - cubeHalfSize,
                  z: z * spacing - cubeHalfSize
                });
          (animations as any)['crystalline-cube-refraction-points'] = points;
        }

        const points = (animations as any)['crystalline-cube-refraction-points'];
        const rotX = time * 2;
        const rotY = time * 3;
        const waveRadius = (timestamp * 0.04 * GLOBAL_SPEED) % (maxDist * 1.5);
        const waveWidth = 40;
        const displacementMagnitude = 10;
        const pointsToDraw = [];

        points.forEach((p_orig: any) => {
          let { x, y, z } = p_orig;
          const distFromCenter = Math.hypot(x, y, z);
          const distToWave = Math.abs(distFromCenter - waveRadius);
          let displacementAmount = 0;
          if (distToWave < waveWidth / 2) {
            const wavePhase = (distToWave / (waveWidth / 2)) * (Math.PI / 2);
            displacementAmount =
              easeInOutCubic(Math.cos(wavePhase)) * displacementMagnitude;
          }
          if (displacementAmount > 0 && distFromCenter > 0) {
            const ratio = (distFromCenter + displacementAmount) / distFromCenter;
            x *= ratio;
            y *= ratio;
            z *= ratio;
          }
          const cY = Math.cos(rotY);
          const sY = Math.sin(rotY);
          let tX = x * cY - z * sY;
          let tZ = x * sY + z * cY;
          x = tX;
          z = tZ;
          const cX = Math.cos(rotX);
          const sX = Math.sin(rotX);
          let tY = y * cX - z * sX;
          tZ = y * sX + z * cX;
          y = tY;
          z = tZ;
          const scale = fov / (fov + z);
          const pX = centerX + x * scale;
          const pY = centerY + y * scale;
          const waveInfluence = displacementAmount / displacementMagnitude;
          const size = (1.5 + waveInfluence * 2.5) * scale;
          const opacity = Math.max(0.1, scale * 0.7 + waveInfluence * 0.4);
          if (size > 0.1) pointsToDraw.push({ x: pX, y: pY, z, size, opacity });
        });

        pointsToDraw
          .sort((a, b) => a.z - b.z)
          .forEach((p: any) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(p.opacity);
            ctx.fill();
          });
      },

      'cylindrical-analysis': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001 * GLOBAL_SPEED;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const radius = 60;
        const height = 100;
        const numLayers = 15;
        const dotsPerLayer = 25;
        const easedTime = easeInOutCubic((Math.sin(time * 2) + 1) / 2);
        const scanY = centerY + (easedTime * 2 - 1) * (height / 2);
        const scanWidth = 15;

        for (let i = 0; i < numLayers; i++) {
          const layerY = centerY + (i / (numLayers - 1) - 0.5) * height;
          const rot = time * (0.2 + (i % 2) * 0.1);
          for (let j = 0; j < dotsPerLayer; j++) {
            const angle = (j / dotsPerLayer) * Math.PI * 2 + rot;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const scale = (z + radius) / (radius * 2);
            const pX = centerX + x * scale;
            const pY = layerY;
            const distToScan = Math.abs(pY - scanY);
            const scanInfluence =
              distToScan < scanWidth
                ? Math.cos((distToScan / scanWidth) * (Math.PI / 2))
                : 0;
            const size = Math.max(0, scale * 1.5 + scanInfluence * 2);
            const opacity = Math.max(0, scale * 0.5 + scanInfluence * 0.5);
            ctx.beginPath();
            ctx.arc(pX, pY, size, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(opacity);
            ctx.fill();
          }
        }
      },

      'phased-array-emitter': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001 * GLOBAL_SPEED;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const fov = 300;
        const ringRadii = [20, 40, 60, 80];
        const pointsPerRing = [12, 18, 24, 30];
        const maxRadius = ringRadii[ringRadii.length - 1];

        if (!animations['phased-array-emitter-points']) {
          const points = [];
          ringRadii.forEach((radius, i) => {
            for (let j = 0; j < pointsPerRing[i]; j++) {
              const angle = (j / pointsPerRing[i]) * Math.PI * 2;
              points.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                z: 0
              });
            }
          });
          (animations as any)['phased-array-emitter-points'] = points;
        }

        const points = (animations as any)['phased-array-emitter-points'];
        const rotX = 1.0;
        const rotY = time * 0.2;
        const waveRadius = (time * 120) % (maxRadius * 1.8);
        const waveWidth = 50;
        const waveHeight = 18;
        const pointsToDraw: any[] = [];

        points.forEach((p_orig: any) => {
          let { x, y, z } = p_orig;
          const distFromCenter = Math.hypot(x, y);
          const distToWave = Math.abs(distFromCenter - waveRadius);
          let waveInfluence = 0;
          if (distToWave < waveWidth / 2) {
            const wavePhase = (1 - distToWave / (waveWidth / 2)) * Math.PI;
            z = easeInOutCubic(Math.sin(wavePhase)) * waveHeight;
            waveInfluence = z / waveHeight;
          }
          const cY = Math.cos(rotY);
          const sY = Math.sin(rotY);
          let tX = x * cY - z * sY;
          let tZ = x * sY + z * cY;
          x = tX;
          z = tZ;
          const cX = Math.cos(rotX);
          const sX = Math.sin(rotX);
          let tY = y * cX - z * sX;
          tZ = y * sX + z * cX;
          y = tY;
          z = tZ;
          const scale = fov / (fov + z + 100);
          const pX = centerX + x * scale;
          const pY = centerY + y * scale;
          const size = (1.5 + waveInfluence * 2.5) * scale;
          const opacity = 0.4 + waveInfluence * 0.6;
          pointsToDraw.push({ x: pX, y: pY, z, size, opacity });
        });

        pointsToDraw
          .sort((a, b) => a.z - b.z)
          .forEach((p: any) => {
            if (p.size < 0.1) return;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(p.opacity);
            ctx.fill();
          });
      },

      'interconnecting-waves': (timestamp: number) => {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        time += deltaTime * 0.001 * GLOBAL_SPEED;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        const dotRings = [
          { radius: 20, count: 12 },
          { radius: 45, count: 24 },
          { radius: 70, count: 36 }
        ];

        dotRings.forEach((ring, ringIndex) => {
          if (ringIndex >= dotRings.length - 1) return;
          const nextRing = dotRings[ringIndex + 1];
          for (let i = 0; i < ring.count; i++) {
            const angle = (i / ring.count) * Math.PI * 2;
            const radiusPulse1 = Math.sin(time * 2 - ringIndex * 0.4) * 4;
            const x1 = centerX + Math.cos(angle) * (ring.radius + radiusPulse1);
            const y1 = centerY + Math.sin(angle) * (ring.radius + radiusPulse1);
            const nextRingRatio = nextRing.count / ring.count;
            for (let j = 0; j < nextRingRatio; j++) {
              const nextAngle =
                ((i * nextRingRatio + j) / nextRing.count) * Math.PI * 2;
              const radiusPulse2 = Math.sin(time * 2 - (ringIndex + 1) * 0.4) * 4;
              const x2 =
                centerX + Math.cos(nextAngle) * (nextRing.radius + radiusPulse2);
              const y2 =
                centerY + Math.sin(nextAngle) * (nextRing.radius + radiusPulse2);
              const lineOpacity =
                0.15 +
                ((Math.sin(time * 3 - ringIndex * 0.5 + i * 0.3) + 1) / 2) * 0.5;
              ctx.beginPath();
              ctx.moveTo(x1, y1);
              ctx.lineTo(x2, y2);
              ctx.lineWidth = 1 + lineOpacity * 0.5;
              const useGlow = lineOpacity > 0.4;
              ctx.strokeStyle = useGlow ? GLOW_FILL(lineOpacity) : MONOCHROME_STROKE(lineOpacity);
              ctx.stroke();
            }
          }
        });

        dotRings.forEach((ring, ringIndex) => {
          for (let i = 0; i < ring.count; i++) {
            const angle = (i / ring.count) * Math.PI * 2;
            const radiusPulse = Math.sin(time * 2 - ringIndex * 0.4) * 3;
            const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
            const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);
            const dotOpacity =
              0.4 + Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) * 0.6;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = MONOCHROME_FILL(dotOpacity);
            ctx.fill();
          }
        });
      }
    };

    const animate = (timestamp: number) => {
      if (!isRunning) return;

      const animationFunc = animations[animationType];
      if (animationFunc) {
        animationFunc(timestamp);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationType, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...style
      }}
    />
  );
};

export default Canvas3DAnimation;
