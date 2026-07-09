import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LockScreen from './pages/LockScreen';
import GiftSelection from './pages/GiftSelection';
import MemoryTree from './pages/MemoryTree';
import BirthdayCake from './pages/BirthdayCake';
import LoveLetter from './pages/LoveLetter';

import FloatingParticles from './components/FloatingParticles';

// Scene names
const SCENES = {
  LOCK: 'lock',
  GIFTS: 'gifts',
  MEMORY: 'memory',
  CAKE: 'cake',
  LETTER: 'letter'
};

export default function App() {
  const [scene, setScene] = useState(SCENES.LOCK);


  // Navigate to a new scene
  const goTo = (sceneName) => setScene(sceneName);

  return (
    <div className="app-root">
      {/* Global floating particles on every scene */}
      <FloatingParticles />



      {/* Vignette overlay for cinematic feel */}
      <div className="vignette" />

      {/* Scene router with AnimatePresence for smooth transitions */}
      <AnimatePresence mode="wait">
        {scene === SCENES.LOCK && (
          <LockScreen key="lock" onUnlock={() => goTo(SCENES.GIFTS)} />
        )}
        {scene === SCENES.GIFTS && (
          <GiftSelection
            key="gifts"
            onSelectGift={(giftId) => {
              if (giftId === 1) goTo(SCENES.MEMORY);
              else if (giftId === 2) goTo(SCENES.CAKE);
              else if (giftId === 3) goTo(SCENES.LETTER);
            }}
          />
        )}
        {scene === SCENES.MEMORY && (
          <MemoryTree key="memory" onBack={() => goTo(SCENES.GIFTS)} />
        )}
        {scene === SCENES.CAKE && (
          <BirthdayCake key="cake" onBack={() => goTo(SCENES.GIFTS)} />
        )}
        {scene === SCENES.LETTER && (
          <LoveLetter
            key="letter"
            onBack={() => goTo(SCENES.GIFTS)}
            onReplay={() => goTo(SCENES.LOCK)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
