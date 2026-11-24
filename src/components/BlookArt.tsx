import React, { useId } from 'react';
import { ALL_BLOOKS } from '../data/blooks';

interface BlookArtProps {
  id: string;
  className?: string;
  animated?: boolean;
}

/**
 * Circular Clicket Token Icon:
 * Golden circular coin with 3D bottom-right rim, inset ring, subtle shine, and embossed 'C' inside.
 */
export const BlooketTokenIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 3D Side Extrusion */}
    <circle cx="21.5" cy="21.5" r="15.5" fill="#b45309" />
    {/* Main Circular Coin Face */}
    <circle cx="19" cy="19" r="15.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1.6" />
    {/* Inner Inset Circle */}
    <circle cx="19" cy="19" r="11.4" fill="#f59e0b" stroke="#fde68a" strokeWidth="1.3" />
    {/* Subtle Top Highlight Arc */}
    <path
      d="M11.5 12.5 A 10.5 10.5 0 0 1 25.5 11.2"
      stroke="#fef9c3"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.7"
    />
    {/* Embossed C */}
    <text
      x="18.8"
      y="24.6"
      textAnchor="middle"
      fill="#fef3c7"
      fontFamily="'Titan One', cursive, sans-serif"
      fontSize="17"
      fontWeight="bold"
      style={{ filter: 'drop-shadow(1px 1.5px 0px #b45309)' }}
    >
      C
    </text>
  </svg>
);

const SvgShineSweep: React.FC<{
  maskId: string;
  gradId: string;
  width: number;
  height: number;
  isMystic?: boolean;
}> = ({ maskId, gradId, width, height, isMystic = false }) => (
  <>
    <defs>
      <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="32%" stopColor={isMystic ? '#fef08a' : '#e0f2fe'} stopOpacity="0.28" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.88" />
        <stop offset="68%" stopColor={isMystic ? '#e9d5ff' : '#bae6fd'} stopOpacity="0.28" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g mask={`url(#${maskId})`} style={{ pointerEvents: 'none' }}>
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values={`${-width} 0; ${width * 1.6} 0; ${width * 1.6} 0`}
          keyTimes="0; 0.45; 1"
          dur="2.4s"
          repeatCount="indefinite"
        />
        <polygon
          points={`0,${-height * 0.2} ${width * 0.36},${-height * 0.2} ${width * 0.14},${height * 1.2} ${-width * 0.22},${height * 1.2}`}
          fill={`url(#${gradId})`}
        />
      </g>
    </g>
  </>
);

/**
 * Exact Blook artwork from uploaded PNGs and Circus Pack SVGs
 * Chromas & Mysticals animate with smooth floating motion and a moving shine sweep;
 * Cyborg Coach additionally blinks and looks around.
 */
export const BlookArt: React.FC<BlookArtProps> = ({
  id,
  className = 'w-24 h-24',
  animated = true,
}) => {
  const uid = useId().replace(/:/g, '');
  const meta = ALL_BLOOKS.find((b) => b.id === id);
  const isChroma = meta?.rarity === 'Chroma';
  const isMystic = meta?.rarity === 'Mystic';
  const isClicked = meta?.rarity === 'Clicked';
  const isGodly = meta?.rarity === 'Godly';
  const shouldAnimateSpecial = animated && (isChroma || isMystic || isClicked || isGodly);

  // Special animated Cyborg Coach (blinks + looks around + Chroma float & shine)
  if (id === 'athlete-cyborg') {
    const cyborgUrl = meta?.imageUrl || 'assets/aistudio/download__18__e086e375.png';
    if (!animated) {
      return (
        <img
          src={cyborgUrl}
          alt={meta?.name || 'Cyborg Coach'}
          className={`${className} object-contain select-none`}
          draggable={false}
        />
      );
    }

    const leftEyeClipId = `cyborg-left-eye-${uid}`;
    const rightLensClipId = `cyborg-right-lens-${uid}`;

    return (
      <div className={`relative ${className} animate-chroma-move select-none`}>
        <svg viewBox="0 0 160 184" className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id={leftEyeClipId}>
              <circle cx="30.5" cy="105.5" r="19.2" />
            </clipPath>
            <clipPath id={rightLensClipId}>
              <circle cx="125" cy="105" r="20" />
            </clipPath>
          </defs>

          {/* Base Cyborg Coach artwork */}
          <image href={cyborgUrl} x="0" y="0" width="160" height="184" />

          {/* Left Human Eye: animated sclera, looking pupil, blinking eyelid */}
          <g clipPath={`url(#${leftEyeClipId})`}>
            <circle cx="30.5" cy="105.5" r="20" fill="#ffffff" />
            <g className="animate-cyborg-look">
              <circle cx="30.5" cy="106.5" r="10.8" fill="#18181b" />
              <circle cx="36" cy="100.5" r="4" fill="#ffffff" />
              <circle cx="25.5" cy="111.5" r="2.1" fill="#ffffff" />
            </g>
            {/* Peach Eyelid Blink */}
            <rect
              x="9"
              y="84"
              width="44"
              height="44"
              fill="#fedba9"
              className="animate-cyborg-blink"
            />
          </g>

          {/* Crisp Orange-Gold Eyebrow sitting cleanly above the eye & blink */}
          <path
            d="M 19 82 Q 36 87 53 107"
            fill="none"
            stroke="#fabc2e"
            strokeWidth="7.2"
            strokeLinecap="round"
          />

          {/* Right Cybernetic Red Scanner Lens: animated tracking reticle + metallic blink shutter */}
          <g clipPath={`url(#${rightLensClipId})`}>
            <g className="animate-cyborg-look">
              <circle
                cx="125"
                cy="105"
                r="9.5"
                fill="none"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
              <circle cx="125" cy="105" r="3.4" fill="#ffffff" opacity="0.9" />
              <line x1="112" y1="105" x2="119" y2="105" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <line x1="131" y1="105" x2="138" y2="105" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
            </g>
            {/* Metallic Cybernetic Shutter Blink */}
            <g className="animate-cyborg-blink">
              <rect x="103" y="83" width="44" height="44" fill="#4b5563" />
              <rect x="105" y="103" width="40" height="3" fill="#38bdf8" opacity="0.85" />
            </g>
          </g>
        </svg>

        {/* Moving Chroma Shine masked strictly to the Cyborg Coach PNG silhouette */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{
            WebkitMaskImage: `url(${cyborgUrl})`,
            maskImage: `url(${cyborgUrl})`,
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
        >
          <div
            className="absolute inset-y-[-20%] w-[55%] animate-blook-shine"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(224,242,254,0.28) 32%, rgba(255,255,255,0.88) 50%, rgba(186,230,253,0.28) 68%, transparent 100%)',
            }}
          />
        </div>
      </div>
    );
  }

  if (meta?.imageUrl) {
    return (
      <img
        src={meta.imageUrl}
        alt={meta.name}
        className={`${className} object-contain select-none`}
        draggable={false}
      />
    );
  }

  switch (id) {
    case 'tightrope-walker':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Base Yellow Rounded Square */}
          <rect x="10" y="10" width="100" height="100" rx="18" fill="#ffcc00" />
          {/* Darker Yellow Bottom Shading */}
          <path d="M10 88 H110 V92 C110 101.941 101.941 110 92 110 H28 C18.059 110 10 101.941 10 92 V88 Z" fill="#f2b705" />
          {/* Purple Shoulders/Collar on Left and Right Bottom Corners */}
          <path d="M10 86 H38 C42 86 45 89 45 93 V110 H28 C18.059 110 10 101.941 10 92 V86 Z" fill="#5e439c" />
          <path d="M110 86 H82 C78 86 75 89 75 93 V110 H92 C101.941 110 110 101.941 110 92 V86 Z" fill="#5e439c" />
          {/* Purple Blush Ovals under eyes */}
          <ellipse cx="24" cy="81" rx="7" ry="3.5" fill="#9a68c7" />
          <ellipse cx="96" cy="81" rx="7" ry="3.5" fill="#9a68c7" />
          {/* Eyes */}
          <circle cx="31" cy="67" r="11.5" fill="#ffffff" />
          <circle cx="33" cy="67" r="7.5" fill="#3a3a3c" />
          <circle cx="29" cy="64" r="3" fill="#ffffff" />
          <circle cx="89" cy="67" r="11.5" fill="#ffffff" />
          <circle cx="87" cy="67" r="7.5" fill="#3a3a3c" />
          <circle cx="83" cy="64" r="3" fill="#ffffff" />
          {/* Neutral Nose/Mouth Line */}
          <rect x="52" y="79" width="16" height="3.5" rx="1.75" fill="#d99b00" />
          {/* Brown Center-Parted Hair */}
          <path d="M28 10 H92 C101.941 10 110 18.059 110 28 V48 C90 48 68 38 60 24 C52 38 30 48 10 48 V28 C10 18.059 18.059 10 28 10 Z" fill="#7d5636" />
          {/* Brown Eyebrows */}
          <ellipse cx="30" cy="44" rx="9" ry="4" fill="#634126" />
          <ellipse cx="90" cy="44" rx="9" ry="4" fill="#634126" />
        </svg>
      );

    case 'jester':
      return (
        <svg viewBox="0 0 120 130" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Base Yellow Rounded Square */}
          <rect x="10" y="20" width="100" height="100" rx="18" fill="#ffcc00" />
          {/* Red Jester Collar at Bottom */}
          <path d="M10 95 L28 104 L45 96 L60 105 L75 96 L92 104 L110 95 V102 C110 111.941 101.941 120 92 120 H28 C18.059 120 10 111.941 10 102 V95 Z" fill="#c9182b" />
          {/* Straight Brown Hair Top */}
          <path d="M28 20 H92 C101.941 20 110 28.059 110 38 V49 H10 V38 C10 28.059 18.059 20 28 20 Z" fill="#734f32" />
          {/* Brown Eyebrows */}
          <ellipse cx="32" cy="48" rx="9.5" ry="5" fill="#593a22" />
          <ellipse cx="88" cy="48" rx="9.5" ry="5" fill="#593a22" />
          {/* Eyes */}
          <circle cx="31" cy="73" r="11.5" fill="#ffffff" />
          <circle cx="33" cy="73" r="7.5" fill="#3a3a3c" />
          <circle cx="29" cy="70" r="3" fill="#ffffff" />
          <circle cx="89" cy="73" r="11.5" fill="#ffffff" />
          <circle cx="87" cy="73" r="7.5" fill="#3a3a3c" />
          <circle cx="83" cy="70" r="3" fill="#ffffff" />
          {/* Happy Open Mouth with White Teeth Bar & Tongue */}
          <path d="M49 82 H71 V92 C71 98 66 103 60 103 C54 103 49 98 49 92 V82 Z" fill="#8f111d" />
          <rect x="49" y="82" width="22" height="5.5" fill="#ffffff" />
          <path d="M53 95 Q60 91 67 95 C66 100 63 103 60 103 C57 103 54 100 53 95 Z" fill="#e02438" />
          {/* Jester Hat on Top Right */}
          <g transform="translate(36, 2)">
            <path d="M25 26 C18 10 6 12 4 22 C10 19 16 22 18 28 Z" fill="#299c52" />
            <path d="M24 26 C22 10 30 2 38 6 C33 12 32 19 34 26 Z" fill="#1f874c" />
            <path d="M33 26 C40 12 52 14 55 24 C48 20 42 23 39 28 Z" fill="#1e5bb8" />
            <path d="M16 28 L20 22 L25 27 L30 21 L35 27 L40 22 L43 28 Q30 31 16 28 Z" fill="#ffd900" />
            <circle cx="4" cy="22" r="4" fill="#ffcc00" />
            <circle cx="38" cy="6" r="4" fill="#d91b2e" />
            <circle cx="55" cy="24" r="4" fill="#d91b2e" />
          </g>
        </svg>
      );

    case 'magician':
      return (
        <svg viewBox="0 0 125 125" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Base Peach Skin Rounded Square */}
          <rect x="10" y="15" width="100" height="100" rx="18" fill="#fcc96b" />
          {/* Magician Suit & Red Cape Bottom */}
          <path d="M10 92 H110 V97 C110 106.941 101.941 115 92 115 H28 C18.059 115 10 106.941 10 97 V92 Z" fill="#ff1a1a" />
          {/* Black Suit Lapels & White Shirt V */}
          <polygon points="36,92 60,115 84,92" fill="#141414" />
          <polygon points="46,92 60,112 74,92" fill="#ffffff" />
          {/* Big Black Bowtie on Left-Center */}
          <g transform="translate(33, 98) rotate(-8)">
            <path d="M0 -8 L16 0 L0 8 Z" fill="#111111" />
            <path d="M32 -8 L16 0 L32 8 Z" fill="#111111" />
            <circle cx="16" cy="0" r="4.5" fill="#222222" />
          </g>
          {/* Ginger/Brown Swept Hair */}
          <path d="M28 15 H92 C101.941 15 110 23.059 110 33 V44 C95 44 85 32 75 26 C65 38 40 46 10 42 V33 C10 23.059 18.059 15 28 15 Z" fill="#b36b2c" />
          <path d="M22 32 C38 44 62 36 72 22 C54 24 35 22 22 32 Z" fill="#9c591f" />
          {/* Eyebrows */}
          <path d="M20 50 Q30 43 40 49" stroke="#8c4f1a" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M80 49 Q90 43 100 50" stroke="#8c4f1a" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Eyes */}
          <circle cx="31" cy="68" r="11" fill="#ffffff" />
          <circle cx="34" cy="68" r="7.5" fill="#3a3a3c" />
          <circle cx="30" cy="65" r="3" fill="#ffffff" />
          <circle cx="89" cy="68" r="11" fill="#ffffff" />
          <circle cx="91" cy="68" r="7.5" fill="#3a3a3c" />
          <circle cx="87" cy="65" r="3" fill="#ffffff" />
          {/* Freckles */}
          <circle cx="23" cy="83" r="2.2" fill="#c78238" />
          <circle cx="30" cy="82" r="2.2" fill="#c78238" />
          <circle cx="26" cy="87" r="2.2" fill="#c78238" />
          <circle cx="90" cy="82" r="2.2" fill="#c78238" />
          <circle cx="97" cy="83" r="2.2" fill="#c78238" />
          <circle cx="94" cy="87" r="2.2" fill="#c78238" />
          {/* Curved Nose */}
          <path d="M58 67 C51 70 52 79 60 78" stroke="#c78238" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Smirk Open Mouth */}
          <path d="M52 84 L74 80 C75 90 67 95 58 94 C53 93 51 89 52 84 Z" fill="#6e1414" />
          <path d="M53 84 L73 81 L72 85 L53 87 Z" fill="#ffffff" />
          <path d="M56 91 Q64 88 70 91 C67 94 61 95 56 91 Z" fill="#e84a5f" />
          {/* Tilted Mini Top Hat on Top Right */}
          <g transform="translate(92, 18) rotate(24)">
            <ellipse cx="0" cy="12" rx="22" ry="7" fill="#1a1a1a" />
            <path d="M-14 10 L-16 -14 C-16 -18 16 -18 16 -14 L14 10 Z" fill="#262626" />
            <ellipse cx="0" cy="-14" rx="16" ry="4.5" fill="#383838" />
            <path d="M-14.5 4 H14.5 L14 10 H-14 Z" fill="#ff1a1a" />
          </g>
        </svg>
      );

    case 'top-hat':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(60, 66) rotate(-5)">
            <ellipse cx="0" cy="24" rx="48" ry="18" fill="#1c1c1c" />
            <ellipse cx="0" cy="22" rx="45" ry="15" fill="#292929" />
            <path d="M-30 20 L-35 -36 C-35 -44 35 -44 35 -36 L30 20 C30 28 -30 28 -30 20 Z" fill="#242424" />
            <path d="M-24 18 L-28 -34 C-20 -36 -10 -36 -5 -35 L-5 22 C-14 22 -20 20 -24 18 Z" fill="#303030" />
            <path d="M-31 7 C-15 13 15 13 31 7 L30 20 C15 27 -15 27 -30 20 Z" fill="#e61919" />
            <ellipse cx="0" cy="-36" rx="35" ry="9" fill="#383838" />
          </g>
        </svg>
      );

    case 'popcorn':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <g>
            <circle cx="35" cy="42" r="12" fill="#fcd34d" />
            <circle cx="52" cy="34" r="14" fill="#fbbf24" />
            <circle cx="70" cy="36" r="13" fill="#fcd34d" />
            <circle cx="85" cy="44" r="11" fill="#f59e0b" />
            <circle cx="24" cy="54" r="11" fill="#fde68a" />
            <circle cx="42" cy="50" r="13" fill="#fef08a" />
            <circle cx="60" cy="46" r="14" fill="#fde047" />
            <circle cx="78" cy="50" r="13" fill="#fef08a" />
            <circle cx="94" cy="55" r="10" fill="#fcd34d" />
            <circle cx="32" cy="60" r="11" fill="#f59e0b" />
            <circle cx="50" cy="58" r="12" fill="#fbbf24" />
            <circle cx="68" cy="58" r="12" fill="#f59e0b" />
            <circle cx="86" cy="60" r="11" fill="#fde047" />
          </g>
          <polygon points="18,58 102,58 92,112 28,112" fill="#dc2626" />
          <polygon points="33,58 44,58 40,112 31,112" fill="#ffffff" />
          <polygon points="54.5,58 65.5,58 64,112 56,112" fill="#ffffff" />
          <polygon points="76,58 87,58 89,112 80,112" fill="#ffffff" />
        </svg>
      );

    case 'cotton-candy':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <polygon points="56,74 64,74 60,115" fill="#e0f2fe" />
          <path d="M57 80 L63 83 L62.5 87 L57.5 84 Z" fill="#38bdf8" />
          <path d="M58 91 L62 94 L61.5 98 L58.5 95 Z" fill="#38bdf8" />
          <path d="M59 102 L61 104 L60.5 108 L59.5 106 Z" fill="#38bdf8" />
          <circle cx="60" cy="24" r="16" fill="#f9a8d4" />
          <circle cx="44" cy="36" r="18" fill="#f9a8d4" />
          <circle cx="76" cy="38" r="17" fill="#f9a8d4" />
          <circle cx="38" cy="54" r="16" fill="#f9a8d4" />
          <circle cx="80" cy="54" r="16" fill="#f9a8d4" />
          <circle cx="48" cy="68" r="15" fill="#f9a8d4" />
          <circle cx="70" cy="67" r="15" fill="#f9a8d4" />
          <circle cx="60" cy="48" r="22" fill="#f9a8d4" />
          <path d="M40 30 Q52 22 64 28" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M32 52 Q42 64 56 60" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <path d="M72 32 Q84 42 76 56" stroke="#fbcfe8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M52 72 Q62 78 72 70" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        </svg>
      );

    case 'unicycler':
      return (
        <svg viewBox="0 0 120 145" className={className} xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(60, 100)">
            <rect x="-5" y="-12" width="10" height="8" rx="2" fill="#eb5e28" />
            <rect x="-3" y="-4" width="6" height="12" fill="#a3a3a3" />
            <circle cx="0" cy="24" r="18" fill="none" stroke="#6c584c" strokeWidth="6" />
            <circle cx="0" cy="24" r="14" fill="none" stroke="#dde5b6" strokeWidth="2" />
            <line x1="0" y1="9" x2="0" y2="39" stroke="#38bdf8" strokeWidth="2" />
            <line x1="-15" y1="24" x2="15" y2="24" stroke="#38bdf8" strokeWidth="2" />
            <line x1="-10" y1="14" x2="10" y2="34" stroke="#38bdf8" strokeWidth="2" />
            <line x1="10" y1="14" x2="-10" y2="34" stroke="#38bdf8" strokeWidth="2" />
            <path d="M-4 6 L0 24 L4 6 Z" fill="#f59e0b" />
            <circle cx="0" cy="24" r="4.5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
          </g>
          <rect x="14" y="6" width="92" height="86" rx="16" fill="#ffcc00" />
          <path d="M14 70 H106 V78 C106 85.732 99.732 92 92 92 H28 C20.268 92 14 85.732 14 78 V70 Z" fill="#0f0f0f" />
          <polygon points="40,70 80,70 68,86 52,86" fill="#ffffff" />
          <circle cx="60" cy="76" r="1.5" fill="#111111" />
          <circle cx="60" cy="81" r="1.5" fill="#111111" />
          <path d="M28 6 H92 C99.732 6 106 12.268 106 20 V34 C92 34 82 22 72 16 C62 28 38 35 14 32 V20 C14 12.268 20.268 6 28 6 Z" fill="#a46729" />
          <path d="M24 37 Q33 31 42 36" stroke="#854d16" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <path d="M78 36 Q87 31 96 37" stroke="#854d16" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          <circle cx="34" cy="52" r="10" fill="#ffffff" />
          <circle cx="36" cy="52" r="6.8" fill="#3a3a3c" />
          <circle cx="33" cy="49" r="2.6" fill="#ffffff" />
          <circle cx="86" cy="52" r="10" fill="#ffffff" />
          <circle cx="88" cy="52" r="6.8" fill="#3a3a3c" />
          <circle cx="85" cy="49" r="2.6" fill="#ffffff" />
          <circle cx="26" cy="65" r="2" fill="#bd7b20" />
          <circle cx="32" cy="64" r="2" fill="#bd7b20" />
          <circle cx="29" cy="68" r="2" fill="#bd7b20" />
          <circle cx="88" cy="64" r="2" fill="#bd7b20" />
          <circle cx="94" cy="65" r="2" fill="#bd7b20" />
          <circle cx="91" cy="68" r="2" fill="#bd7b20" />
          <path d="M58 51 C52 54 53 62 60 61" stroke="#bd7b20" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M52 65 L72 62 C73 70 66 75 58 74 C53 73 51 69 52 65 Z" fill="#6e1414" />
          <path d="M53 65 L71 62.5 L70 66 L53 68 Z" fill="#ffffff" />
          <path d="M56 71 Q63 68 68 71 C65 74 60 75 56 71 Z" fill="#e84a5f" />
        </svg>
      );

    case 'canon-ball':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="100" height="100" rx="18" fill="#0d0d0d" />
          <path d="M10 84 H110 V92 C110 101.941 101.941 110 92 110 H28 C18.059 110 10 101.941 10 92 V84 Z" fill="#050505" />
          <ellipse cx="26" cy="28" rx="9" ry="5.5" transform="rotate(-30 26 28)" fill="#d4d4d8" />
          <circle cx="41" cy="21" r="4" fill="#d4d4d8" />
        </svg>
      );

    case 'magic-wand':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <g transform="rotate(-38 55 68)">
            <rect x="4" y="64" width="76" height="7" rx="2" fill="#0a0a0a" />
            <rect x="64" y="64" width="22" height="7" rx="1" fill="#ffffff" />
          </g>
          <path
            d="M95 14 Q95 30 111 30 Q95 30 95 46 Q95 30 79 30 Q95 30 95 14 Z"
            fill="#facc15"
          />
          <path d="M81 14 Q81 18 85 18 Q81 18 81 22 Q81 18 77 18 Q81 18 81 14 Z" fill="#fde047" />
          <path d="M108 12 Q108 16 112 16 Q108 16 108 20 Q108 16 104 16 Q108 16 108 12 Z" fill="#fde047" />
          <path d="M107 40 Q107 44 111 44 Q107 44 107 48 Q107 44 103 44 Q107 44 107 40 Z" fill="#fde047" />
        </svg>
      );

    case 'tent':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <line x1="60" y1="8" x2="60" y2="22" stroke="#d97706" strokeWidth="2.5" />
          <polygon points="60,8 78,13 60,18" fill="#dc2626" />
          <path d="M22 68 H98 L95 108 C95 111 25 111 25 108 Z" fill="#dc2626" />
          <polygon points="28,68 37,68 38,109 29,109" fill="#ffffff" />
          <polygon points="45,68 54,68 54,109 46,109" fill="#ffffff" />
          <polygon points="66,68 75,68 74,109 66,109" fill="#ffffff" />
          <polygon points="83,68 92,68 91,109 82,109" fill="#ffffff" />
          <path d="M46 109 L48 84 C48 74 72 74 72 84 L74 109 Z" fill="#7f1d1d" />
          <path d="M60 20 C52 40 35 55 16 64 H104 C85 55 68 40 60 20 Z" fill="#dc2626" />
          <path d="M60 20 C55 40 43 55 29 64 H42 C51 54 57 40 60 20 Z" fill="#ffffff" />
          <path d="M60 20 C60 40 60 55 55 64 H65 C62 54 61 40 60 20 Z" fill="#ffffff" />
          <path d="M60 20 C65 40 77 55 91 64 H78 C69 54 63 40 60 20 Z" fill="#ffffff" />
          <path d="M16 64 C20 72 28 72 32 64 C36 72 44 72 48 64 C52 72 60 72 64 64 C68 72 76 72 80 64 C84 72 92 72 96 64 C100 70 103 68 104 64 Z" fill="#facc15" />
        </svg>
      );

    case 'circus-ball': {
      const clipId = `circusBallClip-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id={clipId}>
              <rect x="10" y="10" width="100" height="100" rx="18" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <rect x="10" y="10" width="100" height="100" fill="#f5e6d3" />
            <path d="M10 34 Q35 28 60 42 L26 110 H10 Z" fill="#f2b949" />
            <path d="M60 42 L24 110 H94 Z" fill="#2b59c3" />
            <path d="M66 10 H110 V48 Q86 46 60 42 Z" fill="#c93b2b" />
            <circle cx="62" cy="40" r="19" fill="#fdf8f2" />
            <circle cx="24" cy="28" r="8" fill="#ffffff" opacity="0.55" />
          </g>
        </svg>
      );
    }

    case 'circus-elephant': {
      const clipId = `elephantBallClip-${uid}`;
      const shineMaskId = `elephantShineMask-${uid}`;
      const shineGradId = `elephantShineGrad-${uid}`;
      return (
        <svg
          viewBox="0 0 120 140"
          className={`${className} ${shouldAnimateSpecial ? 'animate-chroma-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="24" y="50" width="72" height="60" rx="22" />
            </clipPath>
            <mask id={shineMaskId}>
              <rect x="24" y="76" width="72" height="60" rx="22" fill="#ffffff" />
              <rect x="24" y="6" width="72" height="70" rx="14" fill="#ffffff" />
              <rect x="24" y="72" width="14" height="14" rx="3" fill="#ffffff" />
              <rect x="82" y="72" width="14" height="14" rx="3" fill="#ffffff" />
            </mask>
          </defs>
          <g transform="translate(0, 26)">
            <g clipPath={`url(#${clipId})`}>
              <rect x="24" y="50" width="72" height="60" fill="#f5e6d3" />
              <path d="M24 58 L60 68 L36 110 H24 Z" fill="#f2b949" />
              <path d="M60 68 L36 110 H84 Z" fill="#2b59c3" />
              <path d="M60 50 H96 V72 L60 68 Z" fill="#c93b2b" />
              <circle cx="60" cy="68" r="12" fill="#fdf8f2" />
            </g>
          </g>
          <rect x="24" y="6" width="72" height="70" rx="14" fill="#b4c0e8" />
          <path d="M24 16 H36 V56 C28 56 24 50 24 42 Z" fill="#9ba9d9" />
          <path d="M96 16 H84 V56 C92 56 96 50 96 42 Z" fill="#9ba9d9" />
          <rect x="24" y="72" width="14" height="14" rx="3" fill="#9ba9d9" />
          <rect x="82" y="72" width="14" height="14" rx="3" fill="#9ba9d9" />
          <circle cx="27" cy="85" r="2" fill="#ffffff" />
          <circle cx="31" cy="85" r="2" fill="#ffffff" />
          <circle cx="35" cy="85" r="2" fill="#ffffff" />
          <circle cx="85" cy="85" r="2" fill="#ffffff" />
          <circle cx="89" cy="85" r="2" fill="#ffffff" />
          <circle cx="93" cy="85" r="2" fill="#ffffff" />
          <circle cx="39" cy="40" r="9.5" fill="#ffffff" />
          <circle cx="41" cy="40" r="6.5" fill="#27272a" />
          <circle cx="38" cy="38" r="2.5" fill="#ffffff" />
          <circle cx="81" cy="40" r="9.5" fill="#ffffff" />
          <circle cx="79" cy="40" r="6.5" fill="#27272a" />
          <circle cx="76" cy="38" r="2.5" fill="#ffffff" />
          <path d="M36 58 Q40 70 48 66 Q45 58 42 56 Z" fill="#ffffff" />
          <path d="M53 38 V62 C53 74 74 74 74 62 V52" stroke="#9ba9d9" strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M53 38 V62 C53 74 74 74 74 62 V52" stroke="#b4c0e8" strokeWidth="10" strokeLinecap="round" fill="none" />
          <line x1="50" y1="45" x2="56" y2="45" stroke="#8594c7" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="51" x2="56" y2="51" stroke="#8594c7" strokeWidth="2" strokeLinecap="round" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={140} />
          )}
        </svg>
      );
    }

    case 'ring-lion': {
      const shineMaskId = `lionShineMask-${uid}`;
      const shineGradId = `lionShineGrad-${uid}`;
      return (
        <svg
          viewBox="0 0 130 130"
          className={`${className} ${shouldAnimateSpecial ? 'animate-chroma-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id={shineMaskId}>
              <circle cx="65" cy="65" r="60" fill="none" stroke="#ffffff" strokeWidth="7" />
              <rect x="23" y="23" width="84" height="84" rx="16" fill="#ffffff" />
              <circle cx="30" cy="24" r="7" fill="#ffffff" />
              <circle cx="100" cy="24" r="7" fill="#ffffff" />
            </mask>
          </defs>
          <g className={shouldAnimateSpecial ? 'animate-ring-spin' : ''}>
            <circle cx="65" cy="65" r="57" fill="none" stroke="#14b8a6" strokeWidth="5.5" />
            <path d="M65 8 A57 57 0 0 1 122 65" fill="none" stroke="#eab308" strokeWidth="5.5" />
            <path d="M65 122 A57 57 0 0 1 8 65" fill="none" stroke="#eab308" strokeWidth="5.5" />
          </g>
          <rect x="23" y="23" width="84" height="84" rx="16" fill="#ea7317" />
          <circle cx="30" cy="24" r="7" fill="#3a2e2b" />
          <circle cx="100" cy="24" r="7" fill="#3a2e2b" />
          <rect x="30" y="34" width="70" height="62" rx="14" fill="#fcb941" />
          <ellipse cx="47" cy="44" rx="8" ry="4.5" fill="#9c4a1a" />
          <ellipse cx="83" cy="44" rx="8" ry="4.5" fill="#9c4a1a" />
          <circle cx="42" cy="62" r="10.5" fill="#ffffff" />
          <circle cx="44" cy="62" r="7" fill="#7c2d12" />
          <circle cx="41" cy="59" r="2.8" fill="#ffffff" />
          <circle cx="88" cy="62" r="10.5" fill="#ffffff" />
          <circle cx="86" cy="62" r="7" fill="#7c2d12" />
          <circle cx="83" cy="59" r="2.8" fill="#ffffff" />
          <ellipse cx="56" cy="79" rx="11" ry="8" fill="#fef3c7" />
          <ellipse cx="74" cy="79" rx="11" ry="8" fill="#fef3c7" />
          <polygon points="57,69 73,69 65,77" fill="#27272a" />
          <circle cx="51" cy="78" r="1.3" fill="#d97706" />
          <circle cx="55" cy="81" r="1.3" fill="#d97706" />
          <circle cx="50" cy="82" r="1.3" fill="#d97706" />
          <circle cx="79" cy="78" r="1.3" fill="#d97706" />
          <circle cx="75" cy="81" r="1.3" fill="#d97706" />
          <circle cx="80" cy="82" r="1.3" fill="#d97706" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={130} height={130} />
          )}
        </svg>
      );
    }

    case 'fire-guy': {
      const shineMaskId = `fireShineMask-${uid}`;
      const shineGradId = `fireShineGrad-${uid}`;
      return (
        <svg
          viewBox="0 0 130 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-chroma-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id={shineMaskId}>
              <rect x="20" y="14" width="90" height="92" rx="16" fill="#ffffff" />
              <path d="M22 103 C10 103 8 88 16 78 C18 84 21 84 23 73 C31 83 36 93 28 101 Z" fill="#ffffff" />
              <path d="M108 103 C120 103 122 88 114 78 C112 84 109 84 107 73 C99 83 94 93 102 101 Z" fill="#ffffff" />
            </mask>
          </defs>
          <rect x="20" y="14" width="90" height="92" rx="16" fill="#ffcc00" />
          <path d="M20 92 H110 V94 C110 100.627 104.627 106 98 106 H32 C25.373 106 20 100.627 20 94 V92 Z" fill="#dc2626" />
          <path d="M36 14 H94 C102.837 14 110 21.163 110 30 V40 H20 V30 C20 21.163 27.163 14 36 14 Z" fill="#784f30" />
          <ellipse cx="40" cy="40" rx="8.5" ry="4.5" fill="#5c3a21" />
          <ellipse cx="90" cy="40" rx="8.5" ry="4.5" fill="#5c3a21" />
          <circle cx="39" cy="62" r="10.5" fill="#ffffff" />
          <circle cx="41" cy="62" r="7" fill="#3a3a3c" />
          <circle cx="38" cy="59" r="2.8" fill="#ffffff" />
          <circle cx="91" cy="62" r="10.5" fill="#ffffff" />
          <circle cx="89" cy="62" r="7" fill="#3a3a3c" />
          <circle cx="86" cy="59" r="2.8" fill="#ffffff" />
          <path d="M55 70 H75 V79 C75 84 70.5 89 65 89 C59.5 89 55 84 55 79 V70 Z" fill="#881337" />
          <rect x="55" y="70" width="20" height="5" fill="#ffffff" />
          <path d="M58 81 Q65 78 72 81 C71 86 68 89 65 89 C62 89 59 86 58 81 Z" fill="#e11d48" />
          <rect x="24" y="88" width="82" height="11" rx="3" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
          <g className={shouldAnimateSpecial ? 'animate-flame-flicker' : ''}>
            <path d="M22 103 C10 103 8 88 16 78 C18 84 21 84 23 73 C31 83 36 93 28 101 Z" fill="#f97316" />
            <path d="M22 101 C16 101 15 92 21 84 C25 90 27 96 22 101 Z" fill="#facc15" />
          </g>
          <g className={shouldAnimateSpecial ? 'animate-flame-flicker' : ''}>
            <path d="M108 103 C120 103 122 88 114 78 C112 84 109 84 107 73 C99 83 94 93 102 101 Z" fill="#f97316" />
            <path d="M108 101 C114 101 115 92 109 84 C105 90 103 96 108 101 Z" fill="#facc15" />
          </g>
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={130} height={120} />
          )}
        </svg>
      );
    }

    case 'the-golden-ticket': {
      const gradId = `goldTicketGrad-${uid}`;
      const shineMaskId = `ticketShineMask-${uid}`;
      const shineGradId = `ticketShineGrad-${uid}`;
      const ticketPath =
        'M14 16 H136 C136 22 142 24 142 28 C142 32 136 34 136 38 C136 42 142 44 142 48 C142 52 136 54 136 58 C136 62 142 64 142 68 C142 72 136 74 136 78 C136 82 142 84 142 88 C142 92 136 94 136 96 H14 C14 94 8 92 8 88 C8 84 14 82 14 78 C14 74 8 72 8 68 C8 64 14 62 14 58 C14 54 8 52 8 48 C8 44 14 42 14 38 C14 34 8 32 8 28 C8 24 14 22 14 16 Z';
      return (
        <svg
          viewBox="0 0 150 110"
          className={`${className} ${shouldAnimateSpecial ? 'animate-mystic-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#eab308" />
              <stop offset="55%" stopColor="#fef9c3" />
              <stop offset="80%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <mask id={shineMaskId}>
              <path d={ticketPath} fill="#ffffff" />
            </mask>
          </defs>
          <path
            d={ticketPath}
            fill={`url(#${gradId})`}
            stroke="#a16207"
            strokeWidth="2"
          />
          <rect x="22" y="22" width="106" height="68" rx="4" fill="none" stroke="#713f12" strokeWidth="1.8" />
          <line x1="22" y1="40" x2="128" y2="40" stroke="#713f12" strokeWidth="1.8" />
          <line x1="22" y1="72" x2="128" y2="72" stroke="#713f12" strokeWidth="1.8" />
          <text x="75" y="36" textAnchor="middle" fill="#dc2626" fontFamily="'Nunito', sans-serif" fontWeight="900" fontSize="15">
            35726
          </text>
          <text x="75" y="63" textAnchor="middle" fill="#09090b" fontFamily="'Nunito', sans-serif" fontWeight="900" fontSize="22">
            Admit One
          </text>
          <text x="75" y="86" textAnchor="middle" fill="#dc2626" fontFamily="'Nunito', sans-serif" fontWeight="900" fontSize="15">
            35726
          </text>
          {shouldAnimateSpecial && (
            <>
              <SvgShineSweep
                maskId={shineMaskId}
                gradId={shineGradId}
                width={150}
                height={110}
                isMystic
              />
              <path d="M26 20 L28 25 L33 27 L28 29 L26 34 L24 29 L19 27 L24 25 Z" fill="#ffffff">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.8s" repeatCount="indefinite" />
              </path>
              <path d="M126 76 L128 80 L132 82 L128 84 L126 88 L124 84 L120 82 L124 80 Z" fill="#fef9c3">
                <animate attributeName="opacity" values="1;0.2;1" dur="1.8s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </svg>
      );
    }

    case 'fruit-apple': {
      const gradId = `appleGrad-${uid}`;
      const deepGradId = `appleDeep-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="15%" y1="10%" x2="90%" y2="95%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="55%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id={deepGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Apple Contour Silhouette */}
          <path
            d="M60 28 C44 17 16 23 14 54 C12 87 31 107 49 105 C55 104 57 102 60 102 C63 102 65 104 71 105 C89 107 108 87 106 54 C104 23 76 17 60 28 Z"
            fill={`url(#${gradId})`}
          />
          {/* Deep Left & Bottom Contour Shadow */}
          <path
            d="M60 102 C63 102 65 104 71 105 C89 107 108 87 106 54 C104 33 90 23 76 23 C91 34 96 68 78 90 C68 100 62 100 60 102 Z"
            fill="#7f1d1d"
            opacity="0.45"
          />
          {/* Layered Glossy Wave Highlights */}
          <path
            d="M25 38 C22 52 24 68 38 72 C52 76 58 64 52 46 C46 31 31 28 25 38 Z"
            fill={`url(#${deepGradId})`}
          />
          <ellipse cx="32" cy="46" rx="7.5" ry="15" transform="rotate(-14 32 46)" fill="#fca5a5" opacity="0.72" />
          <path d="M27 83 Q53 86 73 70 Q58 92 27 83 Z" fill="#f87171" opacity="0.55" />
          {/* Top Dimple & Curved Brown Stem */}
          <path d="M47 28 Q60 36 73 28 Q60 32 47 28 Z" fill="#7f1d1d" opacity="0.65" />
          <path d="M60 31 Q61 17 67 12" stroke="#78350f" strokeWidth="5.2" strokeLinecap="round" fill="none" />
          <path d="M60 31 Q62 18 66 13" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    case 'fruit-pear': {
      const gradId = `pearGrad-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="25%" y1="10%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="45%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          {/* Teardrop Pear Silhouette */}
          <path
            d="M60 18 C72 18 78 36 87 55 C99 80 91 108 60 108 C29 108 21 80 33 55 C42 36 48 18 60 18 Z"
            fill={`url(#${gradId})`}
          />
          {/* Smooth Right Side Contour Shade */}
          <path
            d="M72 26 C77 37 82 47 87 55 C99 80 91 108 60 108 C76 101 84 82 77 58 C73 43 72 32 72 26 Z"
            fill="#15803d"
            opacity="0.45"
          />
          {/* Inner Soft Pear Highlights */}
          <ellipse cx="48" cy="64" rx="16" ry="25" transform="rotate(-10 48 64)" fill="#bbf7d0" opacity="0.55" />
          <ellipse cx="43" cy="54" rx="7" ry="13" transform="rotate(-14 43 54)" fill="#ecfdf5" opacity="0.72" />
          <ellipse cx="48" cy="88" rx="14" ry="8" fill="#86efac" opacity="0.4" />
          {/* Tiny Stem */}
          <path d="M59 19 Q60 11 63 9" stroke="#c2410c" strokeWidth="4.2" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    case 'fruit-grapes': {
      // 4 - 3 - 2 - 1 grape circles per row
      const grapePositions = [
        // Row 1 (4)
        { cx: 28.5, cy: 39, r: 11.5 },
        { cx: 49.5, cy: 39, r: 11.5 },
        { cx: 70.5, cy: 39, r: 11.5 },
        { cx: 91.5, cy: 39, r: 11.5 },
        // Row 2 (3)
        { cx: 39, cy: 57, r: 11.5 },
        { cx: 60, cy: 57, r: 11.5 },
        { cx: 81, cy: 57, r: 11.5 },
        // Row 3 (2)
        { cx: 49.5, cy: 75, r: 11.5 },
        { cx: 70.5, cy: 75, r: 11.5 },
        // Row 4 (1)
        { cx: 60, cy: 93, r: 11.5 },
      ];
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Woody Stem */}
          <path d="M60 35 Q62 17 72 11" stroke="#78350f" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M47 28 Q60 25 73 28" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Clustered Glossy Burgundy Grapes (4-3-2-1 rows) */}
          {grapePositions.map((g, i) => (
            <g key={i}>
              <circle cx={g.cx} cy={g.cy} r={g.r} fill="#881337" />
              <circle cx={g.cx - 1.4} cy={g.cy - 1.4} r={g.r * 0.85} fill="#be185d" opacity="0.65" />
              <ellipse
                cx={g.cx - g.r * 0.32}
                cy={g.cy - g.r * 0.34}
                rx={g.r * 0.38}
                ry={g.r * 0.22}
                transform={`rotate(-28 ${g.cx - g.r * 0.32} ${g.cy - g.r * 0.34})`}
                fill="#fda4af"
                opacity="0.88"
              />
            </g>
          ))}
        </svg>
      );
    }

    case 'fruit-strawberry': {
      const gradId = `strawGrad-${uid}`;
      const seeds = [
        [40, 48], [56, 46], [72, 48], [84, 52],
        [37, 63], [52, 61], [67, 62], [80, 65],
        [44, 78], [59, 77], [73, 79],
        [51, 93], [65, 93],
      ];
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="20%" y1="15%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
          </defs>
          {/* Berry Silhouette */}
          <path
            d="M27 39 C22 57 35 103 60 107 C85 103 98 57 93 39 C85 30 35 30 27 39 Z"
            fill={`url(#${gradId})`}
          />
          {/* Glossy Center Blush Highlight */}
          <ellipse cx="53" cy="64" rx="20" ry="26" fill="#f87171" opacity="0.65" />
          <ellipse cx="47" cy="52" rx="8" ry="12" transform="rotate(-15 47 52)" fill="#fecaca" opacity="0.55" />
          {/* Golden Seeds */}
          {seeds.map(([x, y], idx) => (
            <ellipse key={idx} cx={x} cy={y} rx="2.1" ry="3.6" fill="#fde047" />
          ))}
          {/* Jagged Leaf Crown */}
          <path
            d="M32 37 L24 27 L39 30 L42 18 L54 27 L60 15 L66 27 L78 18 L81 30 L96 27 L88 37 L74 35 L60 40 L46 35 Z"
            fill="#4ade80"
          />
          <path
            d="M37 36 L44 26 L56 32 L60 22 L64 32 L76 26 L83 36 L60 40 Z"
            fill="#16a34a"
            opacity="0.7"
          />
        </svg>
      );
    }

    case 'fruit-kiwi': {
      const fleshGrad = `kiwiFlesh-${uid}`;
      const angles = [0, 22, 45, 67, 90, 112, 135, 157, 180, 202, 225, 247, 270, 292, 315, 337];
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={fleshGrad} cx="46%" cy="44%" r="54%">
              <stop offset="0%" stopColor="#bef264" />
              <stop offset="65%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#65a30d" />
            </radialGradient>
          </defs>
          {/* Fuzzy Brown Rim */}
          <circle cx="60" cy="60" r="48" fill="#78350f" />
          <ellipse cx="59" cy="58" rx="46" ry="47" fill="#92400e" />
          {/* Bright Lime Flesh */}
          <circle cx="60" cy="58" r="42" fill={`url(#${fleshGrad})`} />
          {/* Radial Pale Spokes */}
          {angles.map((a) => (
            <line
              key={`ray-${a}`}
              x1="60"
              y1="58"
              x2="60"
              y2="25"
              stroke="#ecfccb"
              strokeWidth="2.2"
              opacity="0.55"
              transform={`rotate(${a} 60 58)`}
            />
          ))}
          {/* Starburst Cream Core */}
          <ellipse cx="60" cy="58" rx="15" ry="13" fill="#fefce8" />
          <ellipse cx="57" cy="56" rx="9" ry="7" fill="#ffffff" opacity="0.85" />
          {/* Radial Black Seeds */}
          {angles.map((a, idx) => (
            <ellipse
              key={`seed-${a}`}
              cx="60"
              cy={idx % 2 === 0 ? '36' : '39'}
              rx="1.9"
              ry="3.6"
              fill="#1c1917"
              transform={`rotate(${a + 8} 60 58)`}
            />
          ))}
          {/* Top-Left Specular Crescent */}
          <path d="M25 46 A38 38 0 0 1 56 19" stroke="#fef9c3" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.55" />
        </svg>
      );
    }

    case 'fruit-peach': {
      const gradId = `peachGrad-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={gradId} cx="35%" cy="32%" r="72%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="45%" stopColor="#fb923c" />
              <stop offset="85%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#e11d48" />
            </radialGradient>
          </defs>
          {/* Crisp Green Leaf */}
          <path d="M62 28 C76 11 98 14 96 29 C82 34 69 32 62 28 Z" fill="#22c55e" />
          <path d="M64 28 C74 20 84 20 93 26" stroke="#15803d" strokeWidth="2.2" fill="none" />
          {/* Plump Peach Silhouette */}
          <path
            d="M60 27 C42 18 16 27 16 56 C16 86 42 104 60 107 C78 104 104 86 104 56 C104 27 78 18 60 27 Z"
            fill={`url(#${gradId})`}
          />
          {/* Subtle Center Cleft */}
          <path d="M60 28 C55 44 56 66 60 88" stroke="#be123c" strokeWidth="3.2" strokeLinecap="round" fill="none" opacity="0.35" />
          {/* Soft Velvet Highlights */}
          <ellipse cx="37" cy="48" rx="10" ry="17" transform="rotate(-18 37 48)" fill="#fff7ed" opacity="0.58" />
          <ellipse cx="83" cy="60" rx="8" ry="15" transform="rotate(14 83 60)" fill="#fda4af" opacity="0.35" />
        </svg>
      );
    }

    case 'fruit-tanghulu': {
      const berryGrad = `tangBerry-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={berryGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="55%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#9f1239" />
            </linearGradient>
          </defs>
          {/* Wooden Skewer */}
          <rect x="57.5" y="8" width="5" height="106" rx="2.5" fill="#d97706" />
          <rect x="59" y="8" width="2" height="106" rx="1" fill="#fde68a" opacity="0.6" />
          {/* Stacked Candied Berries with Sugar Shell */}
          {[
            { cy: 29, r: 14 },
            { cy: 55, r: 15.5 },
            { cy: 82, r: 16 },
          ].map((b, idx) => (
            <g key={idx}>
              {/* Outer Crystal Glaze Halo */}
              <circle cx="60" cy={b.cy} r={b.r + 2.4} fill="#fecdd3" opacity="0.65" />
              <circle cx="60" cy={b.cy} r={b.r} fill={`url(#${berryGrad})`} />
              {/* Sharp Glossy Sugar Speculars */}
              <ellipse
                cx={53}
                cy={b.cy - b.r * 0.34}
                rx={b.r * 0.35}
                ry={b.r * 0.18}
                transform={`rotate(-28 53 ${b.cy - b.r * 0.34})`}
                fill="#ffffff"
                opacity="0.92"
              />
              <circle cx={67} cy={b.cy + b.r * 0.32} r="2.3" fill="#ffffff" opacity="0.7" />
              {/* Sugar Drip Bead */}
              <path
                d={`M${60 + b.r * 0.55} ${b.cy + b.r * 0.65} Q${60 + b.r * 0.65} ${b.cy + b.r + 4} ${60 + b.r * 0.4} ${b.cy + b.r + 3} Z`}
                fill="#ffe4e6"
                opacity="0.85"
              />
            </g>
          ))}
        </svg>
      );
    }

    case 'fruit-pineapple': {
      const bodyGrad = `pineGrad-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={bodyGrad} x1="15%" y1="20%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* Spiky Emerald Crown */}
          <path d="M44 42 L26 22 L49 32 L45 10 L60 27 L75 10 L71 32 L94 22 L76 42 Z" fill="#16a34a" />
          <path d="M49 41 L40 20 L57 32 L60 12 L63 32 L80 20 L71 41 Z" fill="#4ade80" />
          {/* Golden Pineapple Body */}
          <rect x="27" y="38" width="66" height="71" rx="28" fill={`url(#${bodyGrad})`} />
          {/* Clean Geometric Diamond Facets (No outlines) */}
          <polygon points="60,44 74,58 60,72 46,58" fill="#fef08a" opacity="0.45" />
          <polygon points="44,60 58,74 44,88 30,74" fill="#b45309" opacity="0.22" />
          <polygon points="76,60 90,74 76,88 62,74" fill="#b45309" opacity="0.28" />
          <polygon points="60,76 74,90 60,104 46,90" fill="#fef08a" opacity="0.35" />
          {/* Glossy Highlight */}
          <ellipse cx="42" cy="58" rx="7" ry="16" transform="rotate(-12 42 58)" fill="#fef9c3" opacity="0.65" />
        </svg>
      );
    }

    case 'fruit-starfruit': {
      const starGrad = `starGrad-${uid}`;
      const shineMaskId = `starShineMask-${uid}`;
      const shineGradId = `starShineGrad-${uid}`;
      const outerStar =
        'M60 11 L73 41 L106 44 L80 65 L89 98 L60 80 L31 98 L40 65 L14 44 L47 41 Z';
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-chroma-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={starGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="68%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
            <mask id={shineMaskId}>
              <path d={outerStar} fill="#ffffff" />
            </mask>
          </defs>
          {/* Outer Iridescent Starfruit Rim */}
          <path d={outerStar} fill={`url(#${starGrad})`} />
          {/* Inner Crystalline Prismatic Facets */}
          <polygon points="60,21 69,46 95,48 75,64 81,90 60,75 39,90 45,64 25,48 51,46" fill="#e0f2fe" opacity="0.55" />
          <polygon points="60,21 60,59 69,46" fill="#ffffff" opacity="0.65" />
          <polygon points="95,48 60,59 75,64" fill="#c084fc" opacity="0.45" />
          <polygon points="25,48 60,59 45,64" fill="#22d3ee" opacity="0.5" />
          {/* Prismatic Seed Core */}
          <ellipse cx="60" cy="54" rx="2.6" ry="5" fill="#0ea5e9" />
          <ellipse cx="53" cy="61" rx="2.6" ry="5" transform="rotate(-65 53 61)" fill="#6366f1" />
          <ellipse cx="67" cy="61" rx="2.6" ry="5" transform="rotate(65 67 61)" fill="#14b8a6" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'fruit-dragonfruit': {
      const dfGrad = `dfGrad-${uid}`;
      const shineMaskId = `dfShineMask-${uid}`;
      const shineGradId = `dfShineGrad-${uid}`;
      const dfSilhouette =
        'M60 13 C74 17 85 27 93 23 C92 38 103 48 101 66 C99 88 81 106 60 107 C39 106 21 88 19 66 C17 48 28 38 27 23 C35 27 46 17 60 13 Z';
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-mystic-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={dfGrad} x1="15%" y1="10%" x2="85%" y2="95%">
              <stop offset="0%" stopColor="#e879f9" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
            <mask id={shineMaskId}>
              <path d={dfSilhouette} fill="#ffffff" />
            </mask>
          </defs>
          {/* Glowing Teal-Tipped Dragonfruit Fins */}
          <path d="M27 23 Q15 34 22 49 L32 39 Z" fill="#2dd4bf" />
          <path d="M93 23 Q105 34 98 49 L88 39 Z" fill="#2dd4bf" />
          <path d="M60 10 L51 24 L69 24 Z" fill="#5eead4" />
          {/* Cosmic Violet-Magenta Body */}
          <path d={dfSilhouette} fill={`url(#${dfGrad})`} />
          {/* Starry Cross-Section Core */}
          <ellipse cx="60" cy="65" rx="28" ry="31" fill="#fdf4ff" opacity="0.92" />
          <ellipse cx="60" cy="65" rx="23" ry="26" fill="#fae8ff" />
          {/* Starry Cosmic Seeds */}
          {[
            [50, 50], [68, 49], [44, 62], [60, 62], [75, 64],
            [49, 77], [64, 76], [56, 85],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.2" fill="#3b0764" />
          ))}
          {/* Mystical Glossy Sheen */}
          <ellipse cx="38" cy="48" rx="7" ry="15" transform="rotate(-18 38 48)" fill="#f5d0fe" opacity="0.55" />
          {shouldAnimateSpecial && (
            <>
              <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
              <path d="M22 20 L24 25 L29 27 L24 29 L22 34 L20 29 L15 27 L20 25 Z" fill="#fef08a">
                <animate attributeName="opacity" values="0.25;1;0.25" dur="1.7s" repeatCount="indefinite" />
              </path>
              <path d="M97 78 L99 82 L103 84 L99 86 L97 90 L95 86 L91 84 L95 82 Z" fill="#5eead4">
                <animate attributeName="opacity" values="1;0.25;1" dur="1.7s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </svg>
      );
    }

    case 'fruit-blood-orange': {
      const orangeGrad = `clickedOrange-${uid}`;
      const shineMaskId = `clickedShineMask-${uid}`;
      const shineGradId = `clickedShineGrad-${uid}`;
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-clicked-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={orangeGrad} cx="42%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#fdba74" />
              <stop offset="45%" stopColor="#ff7a00" />
              <stop offset="100%" stopColor="#c2410c" />
            </radialGradient>
            <mask id={shineMaskId}>
              <circle cx="60" cy="60" r="42" fill="#ffffff" />
            </mask>
          </defs>
          {/* Orbiting Neon Orange Click-Burst Arcs */}
          <path d="M14 44 A48 48 0 0 1 44 14" stroke="#ff9f1c" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M106 76 A48 48 0 0 1 76 106" stroke="#ff7a00" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M84 16 A48 48 0 0 1 104 40" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M16 80 A48 48 0 0 0 36 104" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Radiant Blood Orange Rind & Pith */}
          <circle cx="60" cy="60" r="41" fill="#ea580c" />
          <circle cx="60" cy="60" r="36" fill="#ffedd5" />
          <circle cx="60" cy="60" r="32" fill={`url(#${orangeGrad})`} />
          {/* Glossy Citrus Segments */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <path
              key={deg}
              d="M60 60 L51 31 A30 30 0 0 1 69 31 Z"
              fill={deg % 90 === 0 ? '#ff6b00' : '#f97316'}
              transform={`rotate(${deg} 60 60)`}
              opacity="0.92"
            />
          ))}
          {/* Spokes & Glowing Core */}
          {[0, 45, 90, 135].map((deg) => (
            <line
              key={`spoke-${deg}`}
              x1="60"
              y1="27"
              x2="60"
              y2="93"
              stroke="#fff7ed"
              strokeWidth="2.8"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          <circle cx="60" cy="60" r="6.5" fill="#fff7ed" />
          <ellipse cx="44" cy="43" rx="7" ry="12" transform="rotate(-30 44 43)" fill="#ffffff" opacity="0.45" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'fruit-sun-ambrosia': {
      const goldGrad = `godlyGold-${uid}`;
      const orbGrad = `godlyOrb-${uid}`;
      const shineMaskId = `godlyShineMask-${uid}`;
      const shineGradId = `godlyShineGrad-${uid}`;
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-godly-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={goldGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="40%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <radialGradient id={orbGrad} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </radialGradient>
            <mask id={shineMaskId}>
              <rect x="18" y="16" width="84" height="92" rx="18" fill="#ffffff" />
            </mask>
          </defs>
          {/* Floating Sun Halo */}
          <ellipse cx="60" cy="18" rx="22" ry="6" fill="none" stroke="#fef08a" strokeWidth="4" />
          {/* Winged Golden Sun Crown Crest */}
          <path d="M22 44 L10 30 L28 33 L28 21 L42 33 L60 19 L78 33 L92 21 L92 33 L110 30 L98 44 Z" fill="#eab308" />
          <path d="M27 44 L20 33 L37 36 L44 24 L60 35 L76 24 L83 36 L100 33 L93 44 Z" fill="#fef08a" />
          {/* Ornate Shrine Vessel Body */}
          <path d="M28 42 H92 L88 94 C88 101 81 106 73 106 H47 C39 106 32 101 32 94 Z" fill={`url(#${goldGrad})`} />
          <path d="M20 56 C12 56 12 72 22 76 L31 76 L30 56 Z" fill="#facc15" />
          <path d="M100 56 C108 56 108 72 98 76 L89 76 L90 56 Z" fill="#facc15" />
          <rect x="24" y="40" width="72" height="10" rx="5" fill="#fef08a" />
          <rect x="36" y="98" width="48" height="10" rx="4" fill="#a16207" />
          {/* Radiant Celestial Fruit Core Orb */}
          <circle cx="60" cy="70" r="19" fill="#ca8a04" />
          <circle cx="60" cy="70" r="15.5" fill={`url(#${orbGrad})`} />
          <ellipse cx="54" cy="64" rx="5" ry="7" transform="rotate(-24 54 64)" fill="#ffffff" opacity="0.88" />
          {shouldAnimateSpecial && (
            <>
              <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
              <path d="M18 18 L20 23 L25 25 L20 27 L18 32 L16 27 L11 25 L16 23 Z" fill="#fef08a">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
              </path>
              <path d="M102 18 L104 23 L109 25 L104 27 L102 32 L100 27 L95 25 L100 23 Z" fill="#ffffff">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </svg>
      );
    }

    case 'chess-pawn-white': {
      const ivoryGrad = `chessIvory-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={ivoryGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
          </defs>
          {/* Pedestal Base */}
          <rect x="26" y="92" width="68" height="14" rx="7" fill="#94a3b8" />
          <rect x="30" y="88" width="60" height="12" rx="6" fill="#e2e8f0" />
          {/* Tapered Body */}
          <path d="M46 52 C42 68 35 80 32 88 H88 C85 80 78 68 74 52 Z" fill={`url(#${ivoryGrad})`} />
          <path d="M70 52 C74 68 80 80 84 88 H88 C85 80 78 68 74 52 Z" fill="#cbd5e1" opacity="0.65" />
          {/* Collar Ring */}
          <rect x="39" y="45" width="42" height="10" rx="5" fill="#e2e8f0" />
          <rect x="42" y="47" width="22" height="3.5" rx="1.75" fill="#ffffff" opacity="0.85" />
          {/* Glossy Sphere Finial */}
          <circle cx="60" cy="30" r="18" fill={`url(#${ivoryGrad})`} />
          <ellipse cx="53" cy="24" rx="6" ry="8.5" transform="rotate(-24 53 24)" fill="#ffffff" opacity="0.85" />
          <ellipse cx="48" cy="70" rx="4.5" ry="11" transform="rotate(14 48 70)" fill="#ffffff" opacity="0.7" />
        </svg>
      );
    }

    case 'chess-pawn-black': {
      const obsidianGrad = `chessObsidian-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={obsidianGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="48%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          {/* Pedestal Base */}
          <rect x="26" y="92" width="68" height="14" rx="7" fill="#0f172a" />
          <rect x="30" y="88" width="60" height="12" rx="6" fill="#334155" />
          {/* Tapered Body */}
          <path d="M46 52 C42 68 35 80 32 88 H88 C85 80 78 68 74 52 Z" fill={`url(#${obsidianGrad})`} />
          <path d="M70 52 C74 68 80 80 84 88 H88 C85 80 78 68 74 52 Z" fill="#0f172a" opacity="0.55" />
          {/* Collar Ring */}
          <rect x="39" y="45" width="42" height="10" rx="5" fill="#475569" />
          <rect x="42" y="47" width="20" height="3" rx="1.5" fill="#94a3b8" opacity="0.65" />
          {/* Glossy Sphere Finial */}
          <circle cx="60" cy="30" r="18" fill={`url(#${obsidianGrad})`} />
          <ellipse cx="53" cy="24" rx="6" ry="8.5" transform="rotate(-24 53 24)" fill="#cbd5e1" opacity="0.45" />
          <ellipse cx="48" cy="70" rx="4.5" ry="11" transform="rotate(14 48 70)" fill="#94a3b8" opacity="0.35" />
        </svg>
      );
    }

    case 'chess-clock': {
      const woodGrad = `chessClockWood-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={woodGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="55%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          {/* Top Rocker Plungers */}
          <rect x="28" y="20" width="18" height="12" rx="4" fill="#94a3b8" />
          <rect x="74" y="25" width="18" height="8" rx="3" fill="#64748b" />
          <rect x="25" y="18" width="24" height="5" rx="2.5" fill="#e2e8f0" />
          <rect x="71" y="23" width="24" height="5" rx="2.5" fill="#cbd5e1" />
          {/* Rounded Mahogany Cabinet */}
          <rect x="14" y="34" width="92" height="62" rx="16" fill="#78350f" />
          <rect x="14" y="30" width="92" height="60" rx="16" fill={`url(#${woodGrad})`} />
          <rect x="22" y="34" width="76" height="6" rx="3" fill="#fbbf24" opacity="0.45" />
          {/* Twin Analog Clock Dials */}
          <circle cx="40" cy="60" r="18" fill="#cbd5e1" />
          <circle cx="40" cy="60" r="14.5" fill="#ffffff" />
          <line x1="40" y1="60" x2="40" y2="49" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="60" x2="49" y2="63" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="40" cy="60" r="2.5" fill="#1e293b" />

          <circle cx="80" cy="60" r="18" fill="#cbd5e1" />
          <circle cx="80" cy="60" r="14.5" fill="#ffffff" />
          <line x1="80" y1="60" x2="86" y2="51" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
          <line x1="80" y1="60" x2="72" y2="63" stroke="#ef4444" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="80" cy="60" r="2.5" fill="#1e293b" />
          {/* Brass Center Plaque */}
          <rect x="52" y="80" width="16" height="5" rx="2.5" fill="#fde047" />
        </svg>
      );
    }

    case 'chess-board-tile': {
      const frameGrad = `chessBoardFrame-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={frameGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
          {/* 3D Board Extrusion & Frame */}
          <rect x="14" y="18" width="92" height="90" rx="16" fill="#451a03" />
          <rect x="14" y="14" width="92" height="88" rx="16" fill={`url(#${frameGrad})`} />
          {/* 4x4 Glossy Checkered Grid */}
          <g>
            {[0, 1, 2, 3].map((row) =>
              [0, 1, 2, 3].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={22 + col * 19}
                  y={20 + row * 19}
                  width="19"
                  height="19"
                  rx={
                    (row === 0 && col === 0) ||
                    (row === 0 && col === 3) ||
                    (row === 3 && col === 0) ||
                    (row === 3 && col === 3)
                      ? 4
                      : 0
                  }
                  fill={(row + col) % 2 === 0 ? '#f8fafc' : '#1e293b'}
                />
              ))
            )}
          </g>
          {/* Glossy Diagonal Reflection */}
          <polygon points="24,20 56,20 24,52" fill="#ffffff" opacity="0.35" />
          <rect x="26" y="23" width="12" height="4" rx="2" fill="#ffffff" opacity="0.7" />
        </svg>
      );
    }

    case 'chess-rook': {
      const rookGrad = `chessRook-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={rookGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
          </defs>
          {/* Pedestal Base */}
          <rect x="24" y="92" width="72" height="14" rx="7" fill="#075985" />
          <rect x="28" y="86" width="64" height="12" rx="5" fill="#0ea5e9" />
          {/* Tower Body */}
          <path d="M36 44 H84 L80 86 H40 Z" fill={`url(#${rookGrad})`} />
          <path d="M68 44 H84 L80 86 H68 Z" fill="#0369a1" opacity="0.45" />
          {/* Crenellated Battlement Crown */}
          <path
            d="M30 20 H42 V28 H53 V20 H67 V28 H78 V20 H90 V42 L84 48 H36 L30 42 Z"
            fill="#38bdf8"
          />
          {/* Subtle Mortar Groove Highlights */}
          <rect x="34" y="42" width="52" height="5" rx="2.5" fill="#bae6fd" opacity="0.75" />
          <ellipse cx="47" cy="64" rx="4.5" ry="13" fill="#e0f2fe" opacity="0.5" />
        </svg>
      );
    }

    case 'chess-bishop': {
      const bishopGrad = `chessBishop-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={bishopGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="48%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          {/* Base & Collar */}
          <rect x="26" y="92" width="68" height="14" rx="7" fill="#1e3a8a" />
          <rect x="30" y="86" width="60" height="12" rx="6" fill="#3b82f6" />
          {/* Tapered Stem */}
          <path d="M44 58 L36 86 H84 L76 58 Z" fill={`url(#${bishopGrad})`} />
          <rect x="38" y="53" width="44" height="9" rx="4.5" fill="#60a5fa" />
          {/* Top Finial */}
          <circle cx="60" cy="14" r="6.5" fill="#93c5fd" />
          {/* Mitre Dome with Diagonal Cut */}
          <path
            d="M60 19 C43 26 39 43 44 54 H76 C81 43 77 26 60 19 Z"
            fill={`url(#${bishopGrad})`}
          />
          {/* Signature Diagonal Mitre Notch */}
          <path d="M62 29 L73 39" stroke="#eff6ff" strokeWidth="5.5" strokeLinecap="round" />
          <ellipse cx="51" cy="36" rx="4" ry="9" transform="rotate(-14 51 36)" fill="#dbeafe" opacity="0.55" />
        </svg>
      );
    }

    case 'chess-knight': {
      const knightGrad = `chessKnight-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={knightGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="45%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
          </defs>
          {/* Pedestal Base */}
          <rect x="24" y="92" width="72" height="14" rx="7" fill="#3b0764" />
          <rect x="28" y="86" width="64" height="12" rx="6" fill="#7e22ce" />
          {/* Armored Steed Mane Crest */}
          <path
            d="M72 22 C86 30 90 52 82 70 L74 86 H62 C70 66 72 44 64 26 Z"
            fill="#6b21a8"
          />
          {/* Sculpted Knight Head & Neck */}
          <path
            d="M36 86 L40 60 C27 56 22 44 30 33 L42 21 L45 11 L56 17 L68 12 L68 25 C82 35 83 62 72 86 Z"
            fill={`url(#${knightGrad})`}
          />
          {/* Gold Bridle & Gloss Highlights */}
          <path d="M40 32 L54 42" stroke="#fde047" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="47" cy="27" rx="4" ry="6.5" transform="rotate(-32 47 27)" fill="#f3e8ff" opacity="0.6" />
          <ellipse cx="52" cy="64" rx="4.5" ry="12" transform="rotate(8 52 64)" fill="#e9d5ff" opacity="0.4" />
        </svg>
      );
    }

    case 'chess-queen': {
      const queenGrad = `chessQueen-${uid}`;
      const gemGrad = `chessQueenGem-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={queenGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="48%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <radialGradient id={gemGrad} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="55%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>
          </defs>
          {/* Pedestal Base */}
          <rect x="24" y="92" width="72" height="14" rx="7" fill="#92400e" />
          <rect x="28" y="86" width="64" height="12" rx="6" fill="#f59e0b" />
          {/* Tapered Royal Body */}
          <path d="M36 52 L34 86 H86 L84 52 Z" fill={`url(#${queenGrad})`} />
          {/* 5-Pointed Coronet Spires */}
          <path
            d="M32 52 L22 28 L42 40 L48 22 L60 38 L72 22 L78 40 L98 28 L88 52 Z"
            fill={`url(#${queenGrad})`}
          />
          {/* Coronet Pearls */}
          <circle cx="22" cy="26" r="4.5" fill="#fef9c3" />
          <circle cx="48" cy="20" r="4.5" fill="#fef9c3" />
          <circle cx="60" cy="14" r="5" fill="#ffffff" />
          <circle cx="72" cy="20" r="4.5" fill="#fef9c3" />
          <circle cx="98" cy="26" r="4.5" fill="#fef9c3" />
          {/* Ruby Center Crest */}
          <polygon points="60,57 69,68 60,79 51,68" fill={`url(#${gemGrad})`} />
          <rect x="34" y="49" width="52" height="7" rx="3.5" fill="#fef08a" />
          <ellipse cx="45" cy="70" rx="3.5" ry="10" fill="#ffffff" opacity="0.55" />
        </svg>
      );
    }

    case 'chess-king': {
      const chromaGrad = `chessChromaKing-${uid}`;
      const shineMaskId = `chessKingMask-${uid}`;
      const shineGradId = `chessKingShine-${uid}`;
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-chroma-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={chromaGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <mask id={shineMaskId}>
              <rect x="22" y="8" width="76" height="98" rx="14" fill="#ffffff" />
            </mask>
          </defs>
          {/* Crown Cross Finial */}
          <rect x="55" y="9" width="10" height="22" rx="4" fill="#67e8f9" />
          <rect x="47" y="15" width="26" height="9" rx="4" fill="#a5f3fc" />
          {/* Royal Pedestal */}
          <rect x="24" y="92" width="72" height="14" rx="7" fill="#0284c7" />
          <rect x="28" y="86" width="64" height="12" rx="6" fill={`url(#${chromaGrad})`} />
          {/* Prismatic King Body */}
          <path d="M35 44 C30 33 42 26 60 28 C78 26 90 33 85 44 L82 86 H38 Z" fill={`url(#${chromaGrad})`} />
          {/* Imperial Collar Band */}
          <rect x="33" y="42" width="54" height="10" rx="5" fill="#e0f2fe" />
          <circle cx="46" cy="47" r="2.8" fill="#38bdf8" />
          <circle cx="60" cy="47" r="3.2" fill="#f472b6" />
          <circle cx="74" cy="47" r="2.8" fill="#a855f7" />
          <ellipse cx="47" cy="68" rx="4.5" ry="12" fill="#ffffff" opacity="0.55" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'chess-en-passant': {
      const mysticGrad = `chessMysticGrad-${uid}`;
      const phantomGrad = `chessPhantomBody-${uid}`;
      const shineMaskId = `chessMysticMask-${uid}`;
      const shineGradId = `chessMysticShine-${uid}`;
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-mystic-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={mysticGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5d0fe" />
              <stop offset="45%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
            <linearGradient id={phantomGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="55%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6b21a8" />
            </linearGradient>
            <mask id={shineMaskId}>
              <rect x="14" y="14" width="92" height="92" rx="20" fill="#ffffff" />
            </mask>
          </defs>
          {/* Afterimage Ghost Pawn Trail */}
          <g opacity="0.38" transform="translate(-16, -2)">
            <circle cx="52" cy="36" r="14" fill="#c084fc" />
            <path d="M40 54 L32 84 H72 L64 54 Z" fill="#a855f7" />
          </g>
          {/* Kinetic Arcane Dash Arcs */}
          <path d="M16 54 H38" stroke="#e9d5ff" strokeWidth="4" strokeLinecap="round" />
          <path d="M12 68 H34" stroke="#67e8f9" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M20 82 H40" stroke="#e9d5ff" strokeWidth="3" strokeLinecap="round" />
          {/* Main Spectral En Passant Pawn */}
          <g transform="translate(14, 4)">
            <rect x="34" y="88" width="52" height="12" rx="6" fill="#4c1d95" />
            <path d="M47 52 L39 88 H81 L73 52 Z" fill={`url(#${mysticGrad})`} />
            <rect x="42" y="46" width="36" height="8" rx="4" fill="#e9d5ff" />
            <circle cx="60" cy="30" r="16" fill={`url(#${phantomGrad})`} />
            <ellipse cx="54" cy="24" rx="5" ry="7.5" transform="rotate(-24 54 24)" fill="#ffffff" opacity="0.8" />
          </g>
          {shouldAnimateSpecial && (
            <>
              <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
              <path d="M24 22 L26 27 L31 29 L26 31 L24 36 L22 31 L17 29 L22 27 Z" fill="#fef08a">
                <animate attributeName="opacity" values="0.35;1;0.35" dur="1.7s" repeatCount="indefinite" />
              </path>
              <path d="M98 20 L100 24 L104 26 L100 28 L98 32 L96 28 L92 26 L96 24 Z" fill="#e9d5ff">
                <animate attributeName="opacity" values="1;0.35;1" dur="1.7s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </svg>
      );
    }

    case 'chess-checkmate': {
      const checkmateGrad = `chessClickedGrad-${uid}`;
      const shineMaskId = `chessClickedMask-${uid}`;
      const shineGradId = `chessClickedShine-${uid}`;
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-clicked-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={checkmateGrad} cx="42%" cy="38%" r="68%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="42%" stopColor="#ff7a00" />
              <stop offset="100%" stopColor="#9a3412" />
            </radialGradient>
            <mask id={shineMaskId}>
              <circle cx="60" cy="60" r="46" fill="#ffffff" />
            </mask>
          </defs>
          {/* Orbiting Click-Burst Checkmate Arcs */}
          <path d="M14 44 A48 48 0 0 1 44 14" stroke="#ff9f1c" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M106 76 A48 48 0 0 1 76 106" stroke="#ff7a00" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M84 16 A48 48 0 0 1 104 40" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M16 80 A48 48 0 0 0 36 104" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Tilted Defeated King Crest on Heated Tile */}
          <circle cx="60" cy="60" r="39" fill="#c2410c" />
          <circle cx="60" cy="60" r="34" fill={`url(#${checkmateGrad})`} />
          <g transform="translate(60, 62) rotate(-24) translate(-60, -62)">
            <rect x="56" y="23" width="8" height="16" rx="3" fill="#fff7ed" />
            <rect x="50" y="28" width="20" height="6" rx="3" fill="#fff7ed" />
            <path d="M43 44 C40 37 48 34 60 35 C72 34 80 37 77 44 L74 79 H46 Z" fill="#ffedd5" />
            <rect x="38" y="79" width="44" height="10" rx="5" fill="#fed7aa" />
          </g>
          {/* Checkmate '#' Impact Badge */}
          <text
            x="84"
            y="47"
            textAnchor="middle"
            fill="#ffffff"
            stroke="#9a3412"
            strokeWidth="4"
            paintOrder="stroke fill"
            fontFamily="'Titan One', cursive, sans-serif"
            fontSize="24"
          >
            #
          </text>
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'chess-grandmaster': {
      const goldGrad = `chessGodlyGold-${uid}`;
      const gemGrad = `chessGodlyGem-${uid}`;
      const shineMaskId = `chessGodlyMask-${uid}`;
      const shineGradId = `chessGodlyShine-${uid}`;
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-godly-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={goldGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef9c3" />
              <stop offset="42%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <radialGradient id={gemGrad} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </radialGradient>
            <mask id={shineMaskId}>
              <rect x="14" y="12" width="92" height="98" rx="18" fill="#ffffff" />
            </mask>
          </defs>
          {/* Celestial Halo */}
          <ellipse cx="60" cy="18" rx="24" ry="6.5" fill="none" stroke="#fef08a" strokeWidth="4" />
          {/* Winged Grandmaster Laurel Crest */}
          <path d="M22 66 C10 56 10 40 24 32 L34 46 L26 66 Z" fill="#eab308" />
          <path d="M98 66 C110 56 110 40 96 32 L86 46 L94 66 Z" fill="#eab308" />
          {/* Imperial Crown Base */}
          <rect x="24" y="92" width="72" height="14" rx="7" fill="#a16207" />
          <rect x="28" y="86" width="64" height="11" rx="5.5" fill="#eab308" />
          {/* Sovereign King & Queen Merged Crest */}
          <path
            d="M30 86 L24 44 L44 56 L60 28 L76 56 L96 44 L90 86 Z"
            fill={`url(#${goldGrad})`}
          />
          <rect x="56" y="20" width="8" height="16" rx="3" fill="#fef08a" />
          <rect x="51" y="25" width="18" height="6" rx="3" fill="#fef08a" />
          <circle cx="24" cy="42" r="5" fill="#fef9c3" />
          <circle cx="96" cy="42" r="5" fill="#fef9c3" />
          {/* Glowing Sunstone Core */}
          <circle cx="60" cy="66" r="14" fill="#ca8a04" />
          <circle cx="60" cy="66" r="11" fill={`url(#${gemGrad})`} />
          <ellipse cx="56" cy="62" rx="3.5" ry="5" transform="rotate(-24 56 62)" fill="#ffffff" opacity="0.88" />
          {shouldAnimateSpecial && (
            <>
              <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
              <path d="M18 18 L20 23 L25 25 L20 27 L18 32 L16 27 L11 25 L16 23 Z" fill="#fef08a">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
              </path>
              <path d="M102 18 L104 23 L109 25 L104 27 L102 32 L100 27 L95 25 L100 23 Z" fill="#ffffff">
                <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </svg>
      );
    }

    default:
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="14" width="96" height="94" rx="18" fill="#ffcc00" />
          <circle cx="34" cy="68" r="11" fill="#ffffff" />
          <circle cx="36" cy="68" r="7" fill="#18181b" />
          <circle cx="86" cy="68" r="11" fill="#ffffff" />
          <circle cx="84" cy="68" r="7" fill="#18181b" />
        </svg>
      );
  }
};
