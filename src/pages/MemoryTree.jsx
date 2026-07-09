import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TeddyBear from '../components/TeddyBear';
import PhotoModal from '../components/PhotoModal';
import BackButton from '../components/BackButton';
import { PHOTOS } from '../data/photos';

const sceneVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1 } },
  exit:    { opacity: 0, transition: { duration: 0.5 } },
};

/* ── Firefly layer ────────────────────────────────────────── */
function Fireflies() {
  const ff = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 80,
    r: Math.random() * 3 + 1.5,
    dur: Math.random() * 3 + 2,
    delay: Math.random() * 3,
  }));
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:3 }}>
      {ff.map(f => (
        <motion.div key={f.id} style={{
          position:'absolute', left:`${f.x}%`, top:`${f.y}%`,
          width: f.r*2, height: f.r*2, borderRadius:'50%',
          background:'radial-gradient(circle, #fff 15%, #ffd166 55%, transparent 100%)',
          boxShadow:`0 0 ${f.r*4}px ${f.r*2}px rgba(255,209,102,0.55)`,
        }}
          animate={{ y:[0,-20,0], x:[0,(Math.random()-0.5)*18,0], opacity:[0.15,0.9,0.15] }}
          transition={{ repeat:Infinity, duration:f.dur, delay:f.delay, ease:'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Vintage Lamp Post ─────────────────────────────────────── */
function LampPost() {
  return (
    <div style={{ position:'absolute', bottom:0, left:'5%', zIndex:4, pointerEvents:'none', width:70, height:260 }}>
      <svg viewBox="0 0 70 260" style={{ width:'100%', height:'100%' }}>
        <defs>
          <linearGradient id="postMetal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e1208"/>
            <stop offset="40%" stopColor="#3d2510"/>
            <stop offset="100%" stopColor="#140c05"/>
          </linearGradient>
          <radialGradient id="glowBulb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffae0"/>
            <stop offset="30%" stopColor="#ffd166"/>
            <stop offset="100%" stopColor="rgba(255,209,102,0)"/>
          </radialGradient>
        </defs>
        {/* Post */}
        <rect x="32" y="85" width="6" height="175" rx="2" fill="url(#postMetal)"/>
        {/* Base */}
        <rect x="26" y="255" width="18" height="8" rx="3" fill="url(#postMetal)"/>
        {/* Arm curve */}
        <path d="M35 90 Q35 72 26 68" stroke="#3d2510" strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Lantern body */}
        <rect x="14" y="46" width="24" height="24" rx="2" fill="rgba(255,235,150,0.22)" stroke="#3d2510" strokeWidth="2"/>
        <polygon points="14,46 38,46 26,36" fill="#3d2510"/>
        <rect x="12" y="70" width="28" height="4" rx="1" fill="#3d2510"/>
        <line x1="26" y1="46" x2="26" y2="70" stroke="#3d2510" strokeWidth="1.5"/>
        <line x1="14" y1="58" x2="38" y2="58" stroke="#3d2510" strokeWidth="1.5"/>
        {/* Glow */}
        <circle cx="26" cy="58" r="22" fill="url(#glowBulb)" opacity="0.9"/>
      </svg>
    </div>
  );
}

/* ── Hanging Lantern SVG inline ─────────────────────────────── */
function HangingLantern({ x, y, delay, size=22 }) {
  return (
    <motion.g
      initial={{ opacity:0, scale:0 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ delay, duration:0.7 }}
    >
      {/* String */}
      <line x1={x} y1={y-8} x2={x} y2={y+4} stroke="rgba(255,209,102,0.5)" strokeWidth="1.2"/>
      <motion.g
        animate={{ rotate:[-6,6,-6] }}
        transition={{ repeat:Infinity, duration:3+delay*0.5, ease:'easeInOut' }}
        style={{ transformOrigin:`${x}px ${y+4}px` }}
      >
        {/* Glow */}
        <circle cx={x} cy={y+size/2+4} r={size*0.85} fill="rgba(255,185,50,0.18)"/>
        {/* Cap */}
        <path d={`M${x-size*0.5} ${y+4} L${x+size*0.5} ${y+4} L${x} ${y-2} Z`} fill="#3d2510"/>
        {/* Body */}
        <rect x={x-size*0.38} y={y+4} width={size*0.76} height={size} rx="2"
          fill="rgba(255,210,100,0.28)" stroke="#3d2510" strokeWidth="1.5"/>
        {/* Vertical bars */}
        <line x1={x} y1={y+4} x2={x} y2={y+4+size} stroke="#3d2510" strokeWidth="1"/>
        {/* Base plate */}
        <rect x={x-size*0.44} y={y+4+size} width={size*0.88} height={3} rx="1" fill="#3d2510"/>
        {/* Inner light */}
        <ellipse cx={x} cy={y+size*0.55+4} rx={size*0.32} ry={size*0.4} fill="rgba(255,230,120,0.7)"/>
      </motion.g>
    </motion.g>
  );
}

/* ── Neon Heart ─────────────────────────────────────────────── */
function NeonHeart({ x, y, size, delay }) {
  const s = size || 18;
  return (
    <motion.g
      initial={{ opacity:0, scale:0 }}
      animate={{ opacity:[0.7,1,0.7], scale:[1,1.08,1] }}
      transition={{ delay, duration:2.2, repeat:Infinity, ease:'easeInOut' }}
      style={{ transformOrigin:`${x}px ${y}px` }}
    >
      <path
        d={`M${x} ${y+s*0.55} C${x} ${y+s*0.55} ${x-s*0.6} ${y+s*0.2} ${x-s*0.6} ${y+s*0.05} C${x-s*0.6} ${y-s*0.3} ${x} ${y-s*0.3} ${x} ${y} C${x} ${y-s*0.3} ${x+s*0.6} ${y-s*0.3} ${x+s*0.6} ${y+s*0.05} C${x+s*0.6} ${y+s*0.2} ${x} ${y+s*0.55} ${x} ${y+s*0.55}Z`}
        fill="rgba(255,77,109,0.15)"
        stroke="#ff4d6d"
        strokeWidth="1.8"
        filter="url(#neonPink)"
      />
    </motion.g>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function MemoryTree({ onBack }) {
  const [phase, setPhase]             = useState(0); // 0=seed 1=trunk 2=branches 3=leaves 4=photos
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showBubble, setShowBubble]   = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3400),
      setTimeout(() => setPhase(4), 5200),
      setTimeout(() => setShowBubble(true), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── Photo positions on branches ── */
  const photoSlots = [
    // [stringAnchorX, stringAnchorY, photoOffsetX, photoOffsetY, rotation, delay]
    [190, 235, -30, 30, -6,  0.0],  // far left mid
    [300, 175, -20, 28, -3,  0.2],  // left upper
    [430, 145,   0, 30,  0,  0.4],  // top center
    [570, 165,  15, 28,  4,  0.6],  // right upper
    [680, 225,  25, 30,  7,  0.8],  // far right mid
    [155, 340, -35, 32, -8,  1.0],  // far left lower
    [360, 310, -15, 30, -3,  1.2],  // center left lower
    [540, 305,  10, 32,  5,  1.4],  // center right lower
    [710, 330,  30, 30,  9,  1.6],  // far right lower
    [440, 260,   0, 28,  1,  1.8],  // center trunk
  ];

  /* ── Fairy light positions ── */
  const fairyLights = [
    [185,228],[230,195],[275,170],[320,160],[370,148],[420,140],[470,138],[520,145],
    [570,158],[620,170],[665,185],[705,210],[730,240],[720,280],[690,310],[650,335],
    [600,350],[550,358],[500,355],[450,352],[400,348],[350,340],[300,330],[255,318],
    [210,298],[180,268],[165,242],[172,200],[220,155],[420,120],[460,118],[380,135],
    [340,295],[480,290],[600,295],
  ];

  const W = 900, H = 680;

  return (
    <motion.div
      className="scene bg-memory"
      variants={sceneVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ justifyContent:'flex-start', paddingTop:0, overflow:'hidden' }}
    >
      {/* Ambient bokeh */}
      <div className="bokeh-layer"/>
      {/* Fireflies */}
      <Fireflies/>
      {/* Vintage lamp */}
      <LampPost/>

      {/* ── Page Header ── */}
      <motion.div
        style={{ textAlign:'center', zIndex:10, position:'relative', padding:'18px 0 6px', width:'100%' }}
        initial={{ opacity:0, y:-18 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay:0.3 }}
      >
        <h1 style={{
          fontFamily:'Playfair Display, serif',
          fontSize:'clamp(1.4rem,3.5vw,2.1rem)',
          fontWeight:700,
          background:'linear-gradient(135deg, #FFF7F2, #FFB6C9, #FFD166)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          backgroundClip:'text', margin:0,
          filter:'drop-shadow(0 2px 10px rgba(255,77,109,0.3))',
        }}>
          Our Memory Tree 🌸
        </h1>
        <p style={{ fontFamily:'Inter,sans-serif', fontSize:'0.82rem', color:'rgba(255,247,242,0.5)', fontStyle:'italic', margin:'4px 0 0' }}>
          Click any photo to relive that moment ✨
        </p>
      </motion.div>

      {/* ── SVG Tree Canvas ── */}
      <div style={{ flex:1, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', zIndex:5, minHeight:0 }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width:'100%', height:'100%', maxHeight:'calc(100vh - 120px)', overflow:'visible' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Bark textures */}
            <linearGradient id="barkMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"  stopColor="#2a1408"/>
              <stop offset="20%" stopColor="#5c3015"/>
              <stop offset="50%" stopColor="#7a4520"/>
              <stop offset="78%" stopColor="#4e2810"/>
              <stop offset="100%" stopColor="#1e0e04"/>
            </linearGradient>
            <linearGradient id="barkBranch" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"  stopColor="#5c3015"/>
              <stop offset="100%" stopColor="#2a1408"/>
            </linearGradient>
            <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"  stopColor="rgba(30,12,4,0.6)"/>
              <stop offset="100%" stopColor="rgba(15,6,2,0.9)"/>
            </linearGradient>
            <radialGradient id="trunkSpot" cx="50%" cy="0%" r="80%">
              <stop offset="0%"  stopColor="rgba(255,185,80,0.12)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
            </radialGradient>
            <radialGradient id="groundGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="rgba(255,185,80,0.15)"/>
              <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
            </radialGradient>
            <filter id="neonPink">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="softShadow" x="-5%" y="-5%" width="110%" height="115%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="rgba(0,0,0,0.55)"/>
            </filter>
            <filter id="leafGlow">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* ── Ground ── */}
          <ellipse cx={W/2} cy={H-20} rx={420} ry={38} fill="url(#groundGrad)"/>
          <ellipse cx={W/2} cy={H-22} rx={320} ry={22} fill="url(#groundGlow)"/>
          {/* Fallen petals on ground */}
          {[360,400,440,470,510,545,575].map((px,i)=>(
            <ellipse key={i} cx={px} cy={H-30+(i%3)*6} rx={7} ry={3.5}
              fill="#ff9eb5" opacity={0.35} transform={`rotate(${i*22},${px},${H-30+(i%3)*6})`}/>
          ))}

          {/* Ground lanterns */}
          {[[W/2-60,H-58],[W/2+55,H-55],[W/2+160,H-50],[W/2-170,H-52]].map(([gx,gy],i)=>(
            <g key={i}>
              <circle cx={gx} cy={gy} r={14} fill="rgba(255,185,60,0.18)"/>
              <rect x={gx-6} y={gy-10} width={12} height={14} rx="1.5"
                fill="rgba(255,220,100,0.3)" stroke="rgba(90,50,10,0.8)" strokeWidth="1.5"/>
              <polygon points={`${gx-7},${gy-10} ${gx+7},${gy-10} ${gx},${gy-16}`}
                fill="rgba(60,30,5,0.85)"/>
              <ellipse cx={gx} cy={gy+4} rx={6} ry={7} fill="rgba(255,220,80,0.55)"/>
            </g>
          ))}

          {/* ── TRUNK — organic filled shape ── */}
          {phase >= 1 && (
            <motion.g initial={{ opacity:0, scaleY:0 }} animate={{ opacity:1, scaleY:1 }}
              transition={{ duration:1.5, ease:'easeOut' }} style={{ transformOrigin:`${W/2}px ${H}px` }}>

              {/* Main trunk body (filled organic shape) */}
              <path
                d={`
                  M ${W/2-68} ${H-25}
                  C ${W/2-80} ${H-100} ${W/2-65} ${H-180} ${W/2-52} ${H-260}
                  C ${W/2-42} ${H-320} ${W/2-30} ${H-370} ${W/2-18} ${H-410}
                  C ${W/2-8}  ${H-445} ${W/2-5}  ${H-465} ${W/2}    ${H-480}
                  C ${W/2+5}  ${H-465} ${W/2+8}  ${H-445} ${W/2+18} ${H-410}
                  C ${W/2+30} ${H-370} ${W/2+42} ${H-320} ${W/2+52} ${H-260}
                  C ${W/2+65} ${H-180} ${W/2+80} ${H-100} ${W/2+68} ${H-25}
                  Z
                `}
                fill="url(#barkMain)"
                filter="url(#softShadow)"
              />
              {/* Trunk twist highlight */}
              <path
                d={`M ${W/2-10} ${H-30} C ${W/2-18} ${H-150} ${W/2-5} ${H-280} ${W/2-2} ${H-450}`}
                stroke="rgba(255,200,140,0.12)" strokeWidth="14" fill="none" strokeLinecap="round"/>
              {/* Trunk bark crack lines */}
              <path d={`M ${W/2-20} ${H-120} Q ${W/2} ${H-160} ${W/2+15} ${H-130}`}
                stroke="rgba(0,0,0,0.25)" strokeWidth="2.5" fill="none"/>
              <path d={`M ${W/2+25} ${H-220} Q ${W/2+10} ${H-250} ${W/2-10} ${H-240}`}
                stroke="rgba(0,0,0,0.2)" strokeWidth="2" fill="none"/>
              <path d={`M ${W/2-30} ${H-320} Q ${W/2-10} ${H-340} ${W/2+20} ${H-330}`}
                stroke="rgba(0,0,0,0.18)" strokeWidth="2" fill="none"/>

              {/* Root system */}
              {[
                `M ${W/2-60} ${H-30} C ${W/2-90} ${H-18} ${W/2-140} ${H-12} ${W/2-185} ${H-16}`,
                `M ${W/2-50} ${H-25} C ${W/2-70} ${H-10} ${W/2-110} ${H-5}  ${W/2-150} ${H-8}`,
                `M ${W/2+60} ${H-30} C ${W/2+90} ${H-18} ${W/2+140} ${H-12} ${W/2+185} ${H-16}`,
                `M ${W/2+50} ${H-25} C ${W/2+70} ${H-10} ${W/2+110} ${H-5}  ${W/2+150} ${H-8}`,
                `M ${W/2}    ${H-22} C ${W/2-20} ${H-8}  ${W/2-35}  ${H-4}  ${W/2-50}  ${H-6}`,
                `M ${W/2}    ${H-22} C ${W/2+20} ${H-8}  ${W/2+35}  ${H-4}  ${W/2+50}  ${H-6}`,
              ].map((d,i) => (
                <path key={i} d={d} stroke="url(#barkMain)" strokeWidth={16-i*2} fill="none" strokeLinecap="round"/>
              ))}
              {/* Spotlight on trunk */}
              <ellipse cx={W/2} cy={H-300} rx={55} ry={240} fill="url(#trunkSpot)"/>
            </motion.g>
          )}

          {/* ── BRANCHES ── */}
          {phase >= 2 && (
            <motion.g initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1.2 }}>
              {[
                // [from-x, from-y, to-x, to-y, cp1x, cp1y, cp2x, cp2y, width]
                // Far LEFT upper
                [W/2-18, H-460, 90,  190, W/2-80, H-500, 140, 205, 18],
                // LEFT upper mid
                [W/2-15, H-440, 190, 225, W/2-60, H-470, 210, 235, 15],
                // LEFT lower
                [W/2-10, H-380, 130, 310, W/2-50, H-400, 148, 320, 13],
                // FAR LEFT lower
                [W/2-5,  H-340, 60,  370, W/2-60, H-360, 80,  380, 11],
                // RIGHT upper
                [W/2+18, H-460, 800, 185, W/2+80, H-500, 760, 200, 18],
                // RIGHT upper mid
                [W/2+15, H-440, 700, 220, W/2+60, H-470, 680, 230, 15],
                // RIGHT lower
                [W/2+10, H-380, 760, 305, W/2+50, H-400, 740, 315, 13],
                // FAR RIGHT lower
                [W/2+5,  H-340, 840, 360, W/2+60, H-360, 820, 370, 11],
                // CENTER TOP
                [W/2,    H-475, W/2, 110, W/2-30, H-500, W/2+20, 125, 14],
                // CENTER LEFT sub
                [W/2-12, H-420, 300, 280, W/2-40, H-430, 310, 290, 10],
                // CENTER RIGHT sub
                [W/2+12, H-420, 600, 275, W/2+40, H-430, 585, 285, 10],
                // Upper secondary branches
                [140, 210, 95,  175, 130, 195, 108, 182, 9],
                [140, 210, 175, 165, 155, 190, 168, 172, 8],
                [730, 235, 795, 195, 748, 218, 778, 205, 9],
                [680, 225, 650, 180, 670, 208, 658, 190, 8],
              ].map(([x1,y1,x2,y2,cp1x,cp1y,cp2x,cp2y,w], i) => (
                <motion.path
                  key={i}
                  d={`M ${x1} ${y1} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x2} ${y2}`}
                  stroke="url(#barkBranch)"
                  strokeWidth={w}
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength:0 }}
                  animate={{ pathLength:1 }}
                  transition={{ duration:0.8, delay:i*0.06, ease:'easeOut' }}
                />
              ))}
            </motion.g>
          )}

          {/* ── LEAF CANOPY ── */}
          {phase >= 3 && (() => {
            const clusters = [
              // [cx, cy, main-radius, delay]  — large overlapping masses
              [440, 130, 75,  0.0],  // crown top
              [390, 155, 65,  0.1],
              [490, 150, 65,  0.1],
              [330, 180, 60,  0.2],
              [540, 175, 60,  0.2],
              [260, 210, 58,  0.3],
              [610, 205, 58,  0.3],
              [195, 240, 55,  0.4],
              [680, 235, 55,  0.4],
              [145, 270, 50,  0.5],
              [740, 265, 50,  0.5],
              [120, 305, 48,  0.6],
              [775, 300, 48,  0.6],
              [155, 340, 44,  0.7],
              [735, 335, 44,  0.7],
              [210, 370, 42,  0.8],
              [680, 365, 42,  0.8],
              [280, 310, 52,  0.6],
              [600, 305, 52,  0.6],
              [350, 275, 55,  0.5],
              [540, 270, 55,  0.5],
              [420, 265, 58,  0.45],
              [460, 260, 56,  0.45],
              [310, 240, 50,  0.5],
              [570, 235, 50,  0.5],
            ];
            return (
              <motion.g initial={{ opacity:0, scale:0.3 }} animate={{ opacity:1, scale:1 }}
                transition={{ duration:1.4, ease:'easeOut' }} style={{ transformOrigin:`${W/2}px 300px` }}>
                {clusters.map(([cx,cy,r,d], ci) => (
                  <motion.g key={ci}
                    animate={{ y:[0,-3,0], rotate:[-1,1,-1] }}
                    transition={{ repeat:Infinity, duration:3+ci*0.15, delay:d+ci*0.08, ease:'easeInOut' }}
                    style={{ transformOrigin:`${cx}px ${cy}px` }}
                  >
                    {/* Deep shadow layer */}
                    <ellipse cx={cx+4} cy={cy+4} rx={r*1.1} ry={r*0.95} fill="rgba(0,0,0,0.22)"/>
                    {/* Dark base green */}
                    <circle cx={cx} cy={cy} r={r} fill="#1a3520" opacity="0.95"/>
                    {/* Medium green layers */}
                    <circle cx={cx-r*0.3} cy={cy-r*0.2} r={r*0.75} fill="#244a2e" opacity="0.9"/>
                    <circle cx={cx+r*0.25} cy={cy-r*0.25} r={r*0.7} fill="#2d5a38" opacity="0.85"/>
                    <circle cx={cx-r*0.15} cy={cy+r*0.3} r={r*0.65} fill="#1e3f28" opacity="0.8"/>
                    <circle cx={cx+r*0.3} cy={cy+r*0.2} r={r*0.6} fill="#264832" opacity="0.75"/>
                    {/* Light green highlights */}
                    <circle cx={cx-r*0.2} cy={cy-r*0.4} r={r*0.4} fill="#3d6b48" opacity="0.7"/>
                    <circle cx={cx+r*0.1} cy={cy-r*0.35} r={r*0.35} fill="#4a7a55" opacity="0.6"/>
                    {/* Pink blossoms */}
                    <circle cx={cx+r*0.4}  cy={cy-r*0.45} r={r*0.22} fill="#ff9eb5" opacity="0.85"/>
                    <circle cx={cx-r*0.45} cy={cy-r*0.3} r={r*0.18} fill="#ffb6c9" opacity="0.8"/>
                    <circle cx={cx-r*0.1}  cy={cy-r*0.55} r={r*0.16} fill="#ff7090" opacity="0.75"/>
                    <circle cx={cx+r*0.35} cy={cy+r*0.35} r={r*0.14} fill="#ffa0ba" opacity="0.7"/>
                    <circle cx={cx-r*0.5}  cy={cy+r*0.15} r={r*0.13} fill="#ffb6c9" opacity="0.65"/>
                    {/* Gold highlight rim (warm light from below) */}
                    <ellipse cx={cx} cy={cy+r*0.6} rx={r*0.9} ry={r*0.22}
                      fill="rgba(255,185,60,0.12)"/>
                  </motion.g>
                ))}
              </motion.g>
            );
          })()}

          {/* ── FAIRY LIGHTS on tree ── */}
          {phase >= 3 && fairyLights.map(([fx,fy],i) => (
            <motion.circle
              key={i} cx={fx} cy={fy} r={3.5}
              fill={['#FFD166','#FFB6C9','#B99CFF','#FFD166','#ffffff'][i%5]}
              initial={{ opacity:0 }}
              animate={{ opacity:[1,0.25,1], scale:[1,1.3,1] }}
              transition={{ repeat:Infinity, duration:1.4+(i%5)*0.25, delay:i*0.055 }}
              style={{ filter:`drop-shadow(0 0 4px ${['#ffd166','#ffb6c9','#b99cff','#ffd166','#fff'][i%5]})` }}
            />
          ))}

          {/* ── NEON HEARTS ── */}
          {phase >= 3 && [
            [320, 218, 20, 0.3],
            [560, 210, 18, 0.6],
            [440, 310, 22, 0.9],
            [220, 285, 16, 1.2],
            [665, 280, 16, 0.8],
          ].map(([hx,hy,hs,hd],i) => (
            <NeonHeart key={i} x={hx} y={hy} size={hs} delay={hd}/>
          ))}

          {/* ── HANGING LANTERNS on branches ── */}
          {phase >= 3 && [
            [210, 248, 0.5, 20],
            [370, 185, 0.7, 18],
            [580, 188, 0.9, 20],
            [720, 242, 1.1, 18],
            [155, 315, 1.3, 16],
            [740, 310, 1.5, 16],
            [445, 145, 0.3, 14],
          ].map(([lx,ly,ld,ls],i) => (
            <HangingLantern key={i} x={lx} y={ly} delay={ld} size={ls}/>
          ))}

          {/* ── POLAROID PHOTOS ── */}
          {phase >= 4 && photoSlots.slice(0, PHOTOS.length).map((slot, i) => {
            const [ax, ay, ox, oy, rot, d] = slot;
            const photo = PHOTOS[i];
            const pw = 88, ph = 102;  // polaroid dimensions
            const px = ax + ox - pw/2;
            const py = ay + oy;

            return (
              <motion.g
                key={photo.id}
                style={{ cursor:'pointer' }}
                initial={{ opacity:0, y:-25, scale:0.4 }}
                animate={{ opacity:1, y:0, scale:1 }}
                transition={{ delay:d, type:'spring', stiffness:160, damping:14 }}
                onClick={() => setSelectedPhoto(photo)}
              >
                {/* Hanging string with heart clip */}
                <line x1={ax} y1={ay} x2={ax+ox} y2={py-4}
                  stroke="rgba(255,209,102,0.55)" strokeWidth="1.3"/>
                {/* Heart clip */}
                <path
                  d={`M${ax+ox-4} ${py-4} Q${ax+ox} ${py-10} ${ax+ox+4} ${py-4} L${ax+ox} ${py} Z`}
                  fill="#ff4d6d" opacity="0.9"/>

                {/* Swinging polaroid */}
                <motion.g
                  animate={{ rotate:[rot-4, rot+4, rot-4] }}
                  transition={{ repeat:Infinity, duration:3.5+(i*0.4), ease:'easeInOut' }}
                  style={{ transformOrigin:`${ax+ox}px ${py}px` }}
                >
                  {/* Drop shadow */}
                  <rect x={px+4} y={py+4} width={pw} height={ph} rx="3"
                    fill="rgba(0,0,0,0.45)"/>
                  {/* Cream border */}
                  <rect x={px} y={py} width={pw} height={ph} rx="3"
                    fill="#fffcf5" stroke="rgba(230,210,180,0.6)" strokeWidth="0.8"/>
                  {/* Photo area (burgundy fallback) */}
                  <rect x={px+7} y={py+7} width={pw-14} height={ph-26} rx="2"
                    fill="#5A1028"/>
                  {/* Actual photo image */}
                  <image
                    href={photo.src}
                    x={px+7} y={py+7}
                    width={pw-14} height={ph-26}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#clip-p-${i})`}
                  />
                  <defs>
                    <clipPath id={`clip-p-${i}`}>
                      <rect x={px+7} y={py+7} width={pw-14} height={ph-26} rx="2"/>
                    </clipPath>
                  </defs>
                  {/* Caption lines */}
                  <line x1={px+12} y1={py+ph-14} x2={px+pw-12} y2={py+ph-14}
                    stroke="rgba(90,40,20,0.22)" strokeWidth="1.2"/>
                  <line x1={px+18} y1={py+ph-8}  x2={px+pw-18} y2={py+ph-8}
                    stroke="rgba(90,40,20,0.16)" strokeWidth="0.8"/>
                  {/* Small heart on bottom of polaroid */}
                  <text x={px+pw/2} y={py+ph-5} textAnchor="middle"
                    fontSize="8" fill="rgba(255,77,109,0.5)">♥</text>
                </motion.g>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* ── Caption ── */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.p
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:0.5 }}
            style={{
              fontFamily:'Dancing Script, cursive',
              fontSize:'clamp(1rem, 2.5vw, 1.45rem)',
              color:'#FFB6C9',
              textAlign:'center',
              padding:'0 20px 12px',
              zIndex:10, position:'relative',
              textShadow:'0 2px 8px rgba(0,0,0,0.7)',
            }}
          >
            Every memory with you is my favorite gift ❤️
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Teddy + Quote ── */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            initial={{ opacity:0, x:60 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay:0.8, type:'spring', damping:16 }}
            style={{
              position:'fixed', bottom:60, right:20, zIndex:10,
              display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10,
            }}
          >
            {/* Quote Card */}
            {showBubble && (
              <motion.div
                initial={{ opacity:0, scale:0.8, y:10 }}
                animate={{ opacity:1, scale:1, y:0 }}
                style={{
                  background:'rgba(58,11,26,0.82)',
                  backdropFilter:'blur(12px)',
                  border:'1px solid rgba(255,182,201,0.3)',
                  borderRadius:16,
                  padding:'14px 18px',
                  maxWidth:200,
                  boxShadow:'0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <span style={{ fontSize:'1.3rem', color:'#FFD166', display:'block', marginBottom:6 }}>"</span>
                <p style={{
                  fontFamily:'Inter,sans-serif', fontSize:'0.82rem',
                  color:'rgba(255,247,242,0.9)', lineHeight:1.55, margin:0,
                }}>
                  Look at these memories… so many reasons to smile 🥹💖
                </p>
              </motion.div>
            )}
            {/* Teddy */}
            <TeddyBear
              mood="nostalgic"
              size={88}
              style={{ position:'relative', bottom:'auto', right:'auto' }}
              showBubble={false}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Photo Modal ── */}
      <AnimatePresence>
        {selectedPhoto && (
          <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
        )}
      </AnimatePresence>

      <BackButton onClick={onBack} />
    </motion.div>
  );
}
