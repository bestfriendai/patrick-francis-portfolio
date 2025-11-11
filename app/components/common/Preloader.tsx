'use client'

import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { Memory } from '../models/Memory'
import { Wanderer } from '../models/Wanderer'
import WindowModel from '../models/WindowModel'
import { Bmw } from '../models/Bmw'
import { Porsche } from '../models/Porsche'
import { Jeep } from '../models/Jeep'

// Preload heavy models first - these are loaded eagerly with priority
// Order by size: Jeep (24MB), BMW (19MB), Porsche (7.8MB)
useGLTF.preload('/models/jeep.glb');
useGLTF.preload('/models/bmw.glb');
useGLTF.preload('/models/porsche.glb');
useGLTF.preload('/models/wanderer_above_the_sea_of_fog.glb');
useGLTF.preload('/models/globe.glb');
useGLTF.preload('/models/smallglobe.glb');
useGLTF.preload('/models/dalithe_persistence_of_memory.glb');
useGLTF.preload('/models/window.glb');

// List of models to preload in scene
const MODELS = [WindowModel, Memory, Wanderer, Bmw, Porsche, Jeep];

const Preloader = () => {
  const [visible, setVisible] = useState(true);

  // Hacky way to preload the models by setting them on to the scene and
  // removing them after a timeout as the base canvas is shown after a delay.
  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 0);
  }, []);

  return (<>
    {MODELS.map((Component, index) => (
      <Component key={index} visible={visible}/>
    ))}
  </>)
}

export default Preloader;
