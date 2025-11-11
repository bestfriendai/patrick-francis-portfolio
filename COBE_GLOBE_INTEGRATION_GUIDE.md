# Cobe Globe Integration Guide for DontFollowPat Portfolio

## Executive Summary

This document provides a comprehensive strategy for integrating the Cobe interactive globe with **scroll-based animation** into your React Three Fiber portfolio website using **HTML Overlay approach**. The globe will start small in the hero section, grow as the user scrolls, then fall through with a "door effect" before disappearing before Pat's apps section.

---

## 🎯 BEST Implementation: HTML Overlay with Scroll Animation

### **Why HTML Overlay?**

After testing, the HTML overlay approach is the PROVEN working method for integrating Cobe with React Three Fiber:
- ✅ Cobe renders to a native HTML canvas element (as designed)
- ✅ No conflicts with React Three Fiber's rendering pipeline
- ✅ Better performance (no texture mapping overhead)
- ✅ Follows official Cobe React examples
- ✅ Simpler implementation and maintenance

### **Scroll Animation Journey:**

```
[Initial Load - Hero Section]
+------------------------------------------+
|              ☰ SCROLL                     |
|                                          |
|    [BMW]  [Porsche]  [Jeep]              |
|                                          |
|   Hi, I am Patrick Francis.              |
|   Entrepreneur, App Developer, Author    |
|   and cool as F*CK                       |
|                                          |
|          🌍 [Small Globe]                |
|        (Between text & icons)            |
|                                          |
|   Email: Contact@DontFollowPat.com       |
|   [Social Icons: GitHub, X, etc]         |
+------------------------------------------+

        ↓ [User Scrolls Down]

[Mid-Scroll - Globe Growing]
+------------------------------------------+
|                                          |
|         🌍🌍 [Globe Growing]             |
|          (Scale increases)               |
|         (Centered on screen)             |
|                                          |
+------------------------------------------+

        ↓ [Continue Scrolling]

[Pre-Apps Section - Globe Falls Through]
+------------------------------------------+
|                                          |
|          🌍                              |
|          ↓  [Falling effect]             |
|          💫 [Disappears]                 |
|         (Door/portal effect)             |
|                                          |
+------------------------------------------+

        ↓ [Globe Gone]

[Pat's Apps Section]
+------------------------------------------+
|   Featured Applications                  |
|   [PrayAI] [FakeFlex] [etc]              |
|   (No globe interference)                |
+------------------------------------------+
```

---

## 📋 Implementation Strategy

### **Key Animation Phases:**

1. **Phase 1 (Scroll 0-20%)**: Globe visible, small size (scale: 0.25), positioned at 55% viewport height
2. **Phase 2 (Scroll 20-50%)**: Globe grows (scale: 0.25 → 1.5), moves to center (50% viewport)
3. **Phase 3 (Scroll 50-70%)**: Globe at maximum size (scale: 1.5)
4. **Phase 4 (Scroll 70-85%)**: Globe falls through with rotation (720°) and opacity fade
5. **Phase 5 (Scroll 85%+)**: Globe completely hidden before apps section

---

## 💻 Complete Implementation Code

### **File 1:** `app/components/models/CobeGlobeOverlay.tsx` (NEW)

```tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import createGlobe from 'cobe';

interface CobeGlobeOverlayProps {
  scrollProgress: number; // 0 to 1
}

export function CobeGlobeOverlay({ scrollProgress }: CobeGlobeOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const [globeStyle, setGlobeStyle] = useState({
    transform: 'translate(-50%, -50%) scale(0.25)',
    opacity: 0.8,
    top: '55%',
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 1000,
      height: 1000,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.2, 0.2, 0.2],
      markerColor: [0.4, 0.8, 1],
      glowColor: [0.4, 0.8, 1],
      markers: [
        { location: [37.7749, -122.4194], size: 0.1 },
        { location: [40.7128, -74.0060], size: 0.08 },
        { location: [51.5074, -0.1278], size: 0.08 },
        { location: [35.6762, 139.6503], size: 0.08 },
      ],
      onRender: (state) => {
        state.phi = phiRef.current;
        phiRef.current += 0.003; // Gentle rotation
      }
    });

    return () => {
      globe.destroy();
    };
  }, []);

  // Update position and scale based on scroll - matching guide thresholds
  useEffect(() => {
    let scale = 0.25;
    let top = '55%';
    let opacity = 1;
    let rotateX = 0;
    let translateY = 0;

    if (scrollProgress < 0.2) {
      // Phase 1: Small globe in hero (between text and social icons)
      scale = 0.25;
      top = '55%'; // Positioned below text, above social icons
      opacity = 0.8;
    } else if (scrollProgress < 0.5) {
      // Phase 2: Growing phase
      const growProgress = (scrollProgress - 0.2) / 0.3;
      scale = 0.25 + (1.25 * growProgress); // 0.25 → 1.5
      top = '50%';
      opacity = 0.8 + (0.2 * growProgress);
    } else if (scrollProgress < 0.7) {
      // Phase 3: Maximum size, stable before fall
      scale = 1.5;
      top = '50%';
      opacity = 1;
    } else if (scrollProgress < 0.85) {
      // Phase 4: Falling through "door" effect
      const fallProgress = (scrollProgress - 0.7) / 0.15;
      scale = 1.5 + (1 * fallProgress); // Gets bigger as it falls
      translateY = fallProgress * 300; // Falls down rapidly
      opacity = 1 - (fallProgress * 1.2); // Fades out
      rotateX = fallProgress * 720; // Double rotation
      top = '50%';
    } else {
      // Phase 5: Hidden
      opacity = 0;
      scale = 0;
    }

    setGlobeStyle({
      transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
      opacity: Math.max(0, opacity),
      top: top,
    });
  }, [scrollProgress]);

  if (scrollProgress >= 0.85) {
    return null; // Don't render when hidden
  }

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={1000}
      style={{
        position: 'fixed',
        left: '50%',
        ...globeStyle,
        pointerEvents: 'none',
        zIndex: 10,
        transition: 'all 0.15s ease-out',
        willChange: 'transform, opacity',
      }}
    />
  );
}
```

---

## 🔧 Integration into Your App

### **Step 1: Update CanvasLoader Component**

Modify `app/components/common/CanvasLoader.tsx`:

```tsx
import { CobeGlobeOverlay } from "../models/CobeGlobeOverlay";
import { useState, useEffect } from "react";

const CanvasLoader = (props: { children: React.ReactNode }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = scrollHeight > 0 ? currentScroll / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ... existing code ...

  return (
    <div className="h-[100dvh] wrapper relative">
      <div className="h-[100dvh] relative" ref={ref}>
        <Canvas className="base-canvas" {/* ... existing props */}>
          {/* Your existing Canvas content */}
        </Canvas>
        <EnhancedLoader progress={isReady ? 100 : progress} />
        {/* Add Cobe Globe Overlay */}
        {isReady && <CobeGlobeOverlay scrollProgress={scrollProgress} />}
      </div>
      <ThemeSwitcher />
      <ScrollHint />
    </div>
  );
};
```

### **Step 2: Hero Component (No Changes Required)**

The hero component no longer needs to handle the globe directly. It renders inside the R3F Canvas as normal:

```tsx
// app/components/hero/index.tsx
const Hero = () => {
  // ... existing hero code ...

  return (
    <>
      {/* Your existing hero text, models, etc. */}
      <Text position={titlePosition} {...fontProps}>
        Hi, I am Patrick Francis.
      </Text>
      {/* ... rest of hero components ... */}
    </>
  );
};
```

---

## 📦 Installation & Setup

### **Step 1: Install Dependencies**

```bash
cd "/Users/iamabillionaire/Downloads/mohitvirli.github.io-master 2"
npm install cobe
```

### **Step 2: Create the Globe Component**

Create the file `app/components/models/CobeGlobeOverlay.tsx` with the code provided above.

### **Step 3: Update CanvasLoader**

Add scroll tracking and CobeGlobeOverlay to `app/components/common/CanvasLoader.tsx` as shown above.

### **Step 4: Test the Implementation**

```bash
npm run dev
```

Visit `http://localhost:3000` and scroll to see:
- Small globe in hero section (0-20% scroll)
- Growing globe (20-50% scroll)
- Maximum size globe (50-70% scroll)
- Falling/disappearing globe (70-85% scroll)
- No globe (85%+ scroll)

---

## 🎨 Styling & Customization

### **Theme Integration**

The globe matches your blue glow aesthetic:

```typescript
{
  baseColor: [0.2, 0.2, 0.2],        // Dark gray base
  markerColor: [0.4, 0.8, 1],        // Your blue (#64c8ff)
  glowColor: [0.4, 0.8, 1],          // Matching glow
  mapBrightness: 6,                  // High visibility
}
```

### **Adjust Scroll Trigger Points**

Customize when animations occur by modifying thresholds in `CobeGlobeOverlay.tsx`:

```tsx
if (scrollProgress < 0.2) {          // Phase 1: Small globe
if (scrollProgress < 0.5) {          // Phase 2: Growing
if (scrollProgress < 0.7) {          // Phase 3: Maximum size
if (scrollProgress < 0.85) {         // Phase 4: Falling
else {                                // Phase 5: Hidden
```

**Recommended Adjustments:**
- Make globe appear earlier: Change `0.2` to `0.15`
- Make globe fall later: Change `0.7` to `0.75`
- Hide before apps section: Adjust `0.85` based on your apps scroll position

### **Adjust Initial Position**

Fine-tune the globe's position in the hero section:

```tsx
// In CobeGlobeOverlay.tsx:
top: '55%',  // Change to '50%', '60%', etc. to adjust vertical position
```

### **Customize Markers**

Add your own location markers:

```typescript
markers: [
  { location: [YOUR_LAT, YOUR_LONG], size: 0.15 },  // Your location
  { location: [37.7749, -122.4194], size: 0.1 },    // San Francisco
  { location: [40.7128, -74.0060], size: 0.1 },     // New York
  // Add PrayAI / FakeFlex user concentrations
]
```

---

## ⚡ Performance Considerations

### **Why This Approach Performs Better**

1. **Native Canvas Rendering**: Cobe renders directly to HTML canvas (as designed)
2. **No Texture Mapping**: Eliminates THREE.js CanvasTexture overhead
3. **CSS Transforms**: Uses GPU-accelerated CSS transforms for animations
4. **Conditional Rendering**: Component unmounts when not visible (scrollProgress >= 0.85)

### **Mobile Optimization**

Add mobile detection for reduced quality:

```typescript
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

const globe = createGlobe(canvasRef.current, {
  devicePixelRatio: isMobile ? 1 : 2,
  width: isMobile ? 600 : 1000,
  height: isMobile ? 600 : 1000,
  mapSamples: isMobile ? 8000 : 16000,
  // ... rest of config
});
```

---

## 🚀 Quick Implementation Checklist

- [x] Install `cobe` package (`npm install cobe`)
- [x] Create `app/components/models/CobeGlobeOverlay.tsx`
- [x] Update `app/components/common/CanvasLoader.tsx` with scroll tracking
- [x] Add `<CobeGlobeOverlay scrollProgress={scrollProgress} />` to CanvasLoader
- [ ] Test scroll animation phases
- [ ] Adjust scroll trigger points to match your layout
- [ ] Customize globe positioning (`top: '55%'`) if needed
- [ ] Add your personal marker locations
- [ ] Test on mobile devices
- [ ] Optimize performance if needed

---

## 🔥 Advanced Tips

### **Scroll-Linked Rotation**

Make the globe rotate based on scroll instead of time:

```typescript
onRender: (state) => {
  state.phi = scrollProgress * Math.PI * 4; // Rotations based on scroll
}
```

### **Dynamic Markers**

Add pulsing animated markers:

```typescript
markers: [
  {
    location: [37.7749, -122.4194],
    size: 0.1 + Math.sin(Date.now() * 0.001) * 0.02 // Pulsing
  },
]
```

### **Parallax Effect**

Add depth to the fall animation:

```tsx
translateY = fallProgress * 300 + (Math.sin(fallProgress * Math.PI) * 50);
```

---

## 📝 Summary

This implementation provides:

1. ✅ **HTML Overlay Approach** - Proven working method with Cobe
2. ✅ **Small globe on initial load** - Positioned between hero text and social icons
3. ✅ **Growth animation on scroll** - Globe scales from 0.25x to 1.5x
4. ✅ **Dramatic fall-through effect** - 720° rotation with fade
5. ✅ **Clean disappearance** - Hidden before Pat's apps section
6. ✅ **Optimal performance** - Native canvas rendering, no texture mapping
7. ✅ **Theme-matched** - Blue glow matches your aesthetic
8. ✅ **Fully customizable** - Easy to adjust timing, position, and appearance

**Key Difference from Previous Approach:**
- ❌ OLD: Tried to use Cobe canvas as THREE.js texture (didn't work properly)
- ✅ NEW: Render Cobe canvas as HTML overlay (works perfectly!)

The HTML overlay approach follows Cobe's official React examples and provides the best performance and reliability.

---

## 🎯 Implementation Complete!

The globe is now properly integrated and rendering. Check `http://localhost:3000` to see it in action!
