import React, { useId } from 'react';
import { ALL_BLOOKS } from '../data/blooks';

interface BlookArtProps {
  id: string;
  className?: string;
  animated?: boolean;
}

export const DEFAULT_PFP_URL = '/assets/aistudio/I-removebg-preview_65d55998.png';

export const DefaultAvatarPfp: React.FC<{ className?: string; alt?: string }> = ({
  className = 'w-full h-full',
  alt = 'Default Clicket PFP',
}) => (
  <img
    src={DEFAULT_PFP_URL}
    alt={alt}
    className={`${className} object-contain select-none`}
    draggable={false}
  />
);

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
  const isSecret = meta?.rarity === 'Secret';
  const shouldAnimateSpecial =
    animated && (isChroma || isMystic || isClicked || isGodly || isSecret);

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

    // =========================================================================
    // DEEP SEA PACK (14 CUSTOM VECTOR BLOOKS)
    // =========================================================================

    case 'deep-clownfish': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Fins */}
          <path d="M26 42 Q8 30 12 58 Q16 74 28 70 Z" fill="#ea580c" stroke="#1e293b" strokeWidth="3" />
          <path d="M94 42 Q112 30 108 58 Q104 74 92 70 Z" fill="#ea580c" stroke="#1e293b" strokeWidth="3" />
          <path d="M44 18 Q60 4 76 18 Z" fill="#f97316" stroke="#1e293b" strokeWidth="3" />
          {/* Rounded Blook Body */}
          <rect x="20" y="18" width="80" height="84" rx="22" fill="#f97316" stroke="#9a3412" strokeWidth="2.5" />
          {/* Classic White Clownfish Stripes */}
          <path d="M36 20 Q43 60 36 100" stroke="#ffffff" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M36 20 Q43 60 36 100" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="0" opacity="0.2" fill="none" />
          <path d="M84 20 Q77 60 84 100" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* Cute Eyes & Smile */}
          <circle cx="46" cy="54" r="10" fill="#ffffff" />
          <circle cx="48" cy="54" r="6" fill="#0f172a" />
          <circle cx="46" cy="51.5" r="2.2" fill="#ffffff" />
          <circle cx="74" cy="54" r="10" fill="#ffffff" />
          <circle cx="72" cy="54" r="6" fill="#0f172a" />
          <circle cx="70" cy="51.5" r="2.2" fill="#ffffff" />
          <path d="M52 74 Q60 82 68 74" stroke="#7c2d12" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    case 'deep-crab': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Legs */}
          <path d="M24 72 L10 82 M24 84 L12 94 M96 72 L110 82 M96 84 L108 94" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
          {/* Claws */}
          <circle cx="18" cy="36" r="12" fill="#ef4444" />
          <path d="M18 36 L10 24 L20 26 Z" fill="#ff8585" />
          <circle cx="102" cy="36" r="12" fill="#ef4444" />
          <path d="M102 36 L110 24 L100 26 Z" fill="#ff8585" />
          {/* Spiral Shell Hat */}
          <path d="M28 46 C28 16 92 16 92 46 Z" fill="#fde68a" stroke="#b45309" strokeWidth="2.5" />
          <path d="M40 44 C44 26 76 26 80 44" stroke="#d97706" strokeWidth="3.5" fill="none" />
          <path d="M52 44 C54 33 66 33 68 44" stroke="#b45309" strokeWidth="3" fill="none" />
          {/* Crab Body */}
          <rect x="20" y="44" width="80" height="58" rx="20" fill="#ef4444" />
          <rect x="28" y="82" width="64" height="14" rx="7" fill="#fca5a5" opacity="0.45" />
          {/* Eyes */}
          <circle cx="42" cy="64" r="9" fill="#ffffff" />
          <circle cx="44" cy="64" r="5.5" fill="#0f172a" />
          <circle cx="42" cy="61.5" r="2" fill="#ffffff" />
          <circle cx="78" cy="64" r="9" fill="#ffffff" />
          <circle cx="76" cy="64" r="5.5" fill="#0f172a" />
          <circle cx="74" cy="61.5" r="2" fill="#ffffff" />
          <path d="M52 78 Q60 85 68 78" stroke="#7f1d1d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    case 'deep-seahorse': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Dorsal Fin & Curled Tail */}
          <path d="M78 44 Q102 42 98 62 Q94 74 78 72 Z" fill="#38bdf8" />
          <path d="M58 96 Q76 112 88 100 Q96 90 84 84" stroke="#eab308" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* Crown Ridge */}
          <polygon points="40,18 46,8 54,18 62,8 70,18 78,10 80,24 38,24" fill="#38bdf8" />
          {/* Snout */}
          <rect x="12" y="46" width="24" height="14" rx="7" fill="#facc15" />
          {/* Body */}
          <rect x="26" y="20" width="60" height="78" rx="24" fill="#facc15" />
          <rect x="34" y="54" width="32" height="36" rx="14" fill="#fef08a" />
          <line x1="38" y1="64" x2="62" y2="64" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="74" x2="62" y2="74" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="84" x2="60" y2="84" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="48" cy="40" r="9.5" fill="#ffffff" />
          <circle cx="46" cy="40" r="6" fill="#0f172a" />
          <circle cx="44" cy="38" r="2" fill="#ffffff" />
        </svg>
      );
    }

    case 'deep-starfish': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Rounded 5-Arm Starfish */}
          <path
            d="M60 8 L74 38 L108 42 L82 65 L90 100 L60 82 L30 100 L38 65 L12 42 L46 38 Z"
            fill="#fb7185"
            stroke="#e11d48"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Cute Dots */}
          <circle cx="60" cy="24" r="3" fill="#ffe4e6" />
          <circle cx="28" cy="48" r="3" fill="#ffe4e6" />
          <circle cx="92" cy="48" r="3" fill="#ffe4e6" />
          <circle cx="38" cy="86" r="3" fill="#ffe4e6" />
          <circle cx="82" cy="86" r="3" fill="#ffe4e6" />
          {/* Face */}
          <circle cx="48" cy="54" r="7.5" fill="#ffffff" />
          <circle cx="49" cy="54" r="4.5" fill="#0f172a" />
          <circle cx="47.5" cy="52" r="1.6" fill="#ffffff" />
          <circle cx="72" cy="54" r="7.5" fill="#ffffff" />
          <circle cx="71" cy="54" r="4.5" fill="#0f172a" />
          <circle cx="69.5" cy="52" r="1.6" fill="#ffffff" />
          <path d="M53 67 Q60 73 67 67" stroke="#881337" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    case 'deep-octopus': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Tentacles */}
          <path d="M26 76 Q14 96 24 106" stroke="#9333ea" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M44 82 Q38 100 46 110" stroke="#a855f7" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M60 84 Q60 102 64 110" stroke="#9333ea" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M76 82 Q82 100 74 110" stroke="#a855f7" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M94 76 Q106 96 96 106" stroke="#9333ea" strokeWidth="11" strokeLinecap="round" fill="none" />
          {/* Dome Head */}
          <rect x="20" y="16" width="80" height="72" rx="34" fill="#a855f7" />
          <ellipse cx="38" cy="30" rx="9" ry="5" transform="rotate(-20 38 30)" fill="#e9d5ff" opacity="0.55" />
          {/* Eyes */}
          <circle cx="43" cy="54" r="10" fill="#ffffff" />
          <circle cx="45" cy="54" r="6" fill="#0f172a" />
          <circle cx="43" cy="51.5" r="2" fill="#ffffff" />
          <circle cx="77" cy="54" r="10" fill="#ffffff" />
          <circle cx="75" cy="54" r="6" fill="#0f172a" />
          <circle cx="73" cy="51.5" r="2" fill="#ffffff" />
          <circle cx="60" cy="69" r="4" fill="#581c87" />
        </svg>
      );
    }

    case 'deep-pufferfish': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Spikes */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <polygon
              key={deg}
              points="56,6 64,6 60,18"
              fill="#d97706"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
          {/* Side Fins */}
          <ellipse cx="14" cy="62" rx="9" ry="13" fill="#fde047" />
          <ellipse cx="106" cy="62" rx="9" ry="13" fill="#fde047" />
          {/* Puffed Round Body */}
          <circle cx="60" cy="60" r="44" fill="#facc15" />
          <ellipse cx="60" cy="76" rx="32" ry="22" fill="#fef9c3" />
          {/* Eyes & Puffed Lips */}
          <circle cx="42" cy="52" r="10.5" fill="#ffffff" />
          <circle cx="44" cy="52" r="6" fill="#0f172a" />
          <circle cx="42" cy="49.5" r="2" fill="#ffffff" />
          <circle cx="78" cy="52" r="10.5" fill="#ffffff" />
          <circle cx="76" cy="52" r="6" fill="#0f172a" />
          <circle cx="74" cy="49.5" r="2" fill="#ffffff" />
          <ellipse cx="60" cy="70" rx="8" ry="6" fill="#fb923c" />
          <circle cx="60" cy="70" r="3" fill="#7c2d12" />
        </svg>
      );
    }

    case 'deep-jellyfish': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Glowing Tentacles */}
          <path d="M32 64 Q24 86 34 106" stroke="#67e8f9" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M48 66 Q54 88 46 110" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M64 66 Q58 88 66 110" stroke="#67e8f9" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M80 64 Q88 86 78 106" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Translucent Bell */}
          <path d="M18 64 C18 18 102 18 102 64 C88 70 74 64 60 68 C46 64 32 70 18 64 Z" fill="#06b6d4" />
          <path d="M26 58 C26 26 94 26 94 58 Z" fill="#a5f3fc" opacity="0.6" />
          {/* Cute Bioluminescent Spots & Face */}
          <circle cx="40" cy="34" r="4" fill="#ecfeff" opacity="0.85" />
          <circle cx="80" cy="34" r="4" fill="#ecfeff" opacity="0.85" />
          <circle cx="46" cy="50" r="7.5" fill="#ffffff" />
          <circle cx="47" cy="50" r="4.5" fill="#083344" />
          <circle cx="74" cy="50" r="7.5" fill="#ffffff" />
          <circle cx="73" cy="50" r="4.5" fill="#083344" />
          <path d="M55 58 Q60 62 65 58" stroke="#083344" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    case 'deep-anglerfish': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Lure Stalk & Glowing Bulb */}
          <path d="M60 28 C58 8 34 6 24 22" stroke="#475569" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="24" r="10" fill="#fef08a" opacity="0.35" />
          <circle cx="22" cy="24" r="6" fill="#fde047" />
          {/* Fins */}
          <path d="M98 52 L114 40 L110 74 L98 66 Z" fill="#334155" />
          {/* Deep Abyssal Body */}
          <rect x="18" y="26" width="84" height="76" rx="26" fill="#1e293b" />
          <rect x="22" y="30" width="76" height="68" rx="22" fill="#334155" />
          {/* Glowing Eyes */}
          <circle cx="42" cy="54" r="10.5" fill="#fef08a" />
          <circle cx="44" cy="54" r="5" fill="#0f172a" />
          <circle cx="78" cy="54" r="10.5" fill="#fef08a" />
          <circle cx="76" cy="54" r="5" fill="#0f172a" />
          {/* Sharp Tooth Grin */}
          <path d="M32 74 Q60 92 88 74 Q88 94 60 96 Q32 94 32 74 Z" fill="#0f172a" />
          <polygon points="38,76 43,86 48,77" fill="#f8fafc" />
          <polygon points="55,79 60,89 65,79" fill="#f8fafc" />
          <polygon points="72,77 77,86 82,76" fill="#f8fafc" />
        </svg>
      );
    }

    case 'deep-shark': {
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Dorsal Fin */}
          <path d="M48 26 L62 4 L76 26 Z" fill="#475569" />
          {/* Side Pectoral Fins */}
          <path d="M18 66 L4 80 L22 84 Z" fill="#64748b" />
          <path d="M102 66 L116 80 L98 84 Z" fill="#64748b" />
          {/* Shark Body */}
          <rect x="18" y="24" width="84" height="82" rx="24" fill="#64748b" />
          {/* White Belly */}
          <path d="M24 68 Q60 58 96 68 V88 C96 98 88 106 78 106 H42 C32 106 24 98 24 88 Z" fill="#f8fafc" />
          {/* Gill Slits */}
          <line x1="25" y1="54" x2="25" y2="66" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="95" y1="54" x2="95" y2="66" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          {/* Fierce Eyes */}
          <circle cx="42" cy="52" r="9" fill="#ffffff" />
          <circle cx="43" cy="52" r="5.5" fill="#0f172a" />
          <path d="M32 42 L51 47" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="78" cy="52" r="9" fill="#ffffff" />
          <circle cx="77" cy="52" r="5.5" fill="#0f172a" />
          <path d="M88 42 L69 47" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
          {/* Tooth Smile */}
          <path d="M38 78 Q60 92 82 78 Q78 96 60 96 Q42 96 38 78 Z" fill="#991b1b" />
          <polygon points="44,80 48,88 52,81" fill="#ffffff" />
          <polygon points="56,82 60,90 64,82" fill="#ffffff" />
          <polygon points="68,81 72,88 76,80" fill="#ffffff" />
        </svg>
      );
    }

    case 'deep-orca': {
      const orcaGrad = `deepOrcaGrad-${uid}`;
      const shineMaskId = `deepOrcaMask-${uid}`;
      const shineGradId = `deepOrcaShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={orcaGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="55%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <mask id={shineMaskId}>
              <rect x="16" y="18" width="88" height="88" rx="24" fill="#ffffff" />
            </mask>
          </defs>
          {/* Dorsal & Side Fins */}
          <path d="M50 22 L64 4 L74 22 Z" fill="#0f172a" />
          <path d="M18 68 L4 80 L20 84 Z" fill="#0284c7" />
          <path d="M102 68 L116 80 L100 84 Z" fill="#0284c7" />
          {/* Orca Body */}
          <rect x="18" y="20" width="84" height="86" rx="24" fill={`url(#${orcaGrad})`} />
          {/* Classic White Eye Patches */}
          <ellipse cx="35" cy="46" rx="10" ry="6" transform="rotate(-22 35 46)" fill="#e0f2fe" />
          <ellipse cx="85" cy="46" rx="10" ry="6" transform="rotate(22 85 46)" fill="#e0f2fe" />
          {/* White Belly */}
          <path d="M30 72 Q60 62 90 72 V88 C90 98 82 106 72 106 H48 C38 106 30 98 30 88 Z" fill="#f8fafc" />
          {/* Eyes */}
          <circle cx="43" cy="56" r="7.5" fill="#ffffff" />
          <circle cx="44" cy="56" r="4.5" fill="#0f172a" />
          <circle cx="77" cy="56" r="7.5" fill="#ffffff" />
          <circle cx="76" cy="56" r="4.5" fill="#0f172a" />
          <path d="M50 78 Q60 86 70 78" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'deep-narwhal': {
      const tuskGrad = `deepNarwhalTusk-${uid}`;
      const bodyGrad = `deepNarwhalBody-${uid}`;
      const shineMaskId = `deepNarwhalMask-${uid}`;
      const shineGradId = `deepNarwhalShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={tuskGrad} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
            <linearGradient id={bodyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="55%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <mask id={shineMaskId}>
              <rect x="18" y="24" width="84" height="82" rx="24" fill="#ffffff" />
            </mask>
          </defs>
          {/* Spiraled Crystal Horn */}
          <polygon points="53,34 67,34 60,4" fill={`url(#${tuskGrad})`} />
          <line x1="56" y1="24" x2="64" y2="20" stroke="#0284c7" strokeWidth="2" />
          <line x1="57" y1="15" x2="63" y2="12" stroke="#0284c7" strokeWidth="2" />
          {/* Flippers */}
          <ellipse cx="14" cy="74" rx="10" ry="7" transform="rotate(-25 14 74)" fill="#0284c7" />
          <ellipse cx="106" cy="74" rx="10" ry="7" transform="rotate(25 106 74)" fill="#0284c7" />
          {/* Narwhal Body */}
          <rect x="20" y="30" width="80" height="76" rx="26" fill={`url(#${bodyGrad})`} />
          <ellipse cx="60" cy="84" rx="28" ry="18" fill="#e0f2fe" />
          {/* Cute Spots */}
          <circle cx="34" cy="44" r="4" fill="#bae6fd" opacity="0.7" />
          <circle cx="86" cy="44" r="4" fill="#bae6fd" opacity="0.7" />
          {/* Eyes & Smile */}
          <circle cx="42" cy="60" r="8.5" fill="#ffffff" />
          <circle cx="44" cy="60" r="5" fill="#0f172a" />
          <circle cx="42" cy="58" r="1.8" fill="#ffffff" />
          <circle cx="78" cy="60" r="8.5" fill="#ffffff" />
          <circle cx="76" cy="60" r="5" fill="#0f172a" />
          <circle cx="74" cy="58" r="1.8" fill="#ffffff" />
          <path d="M52 74 Q60 80 68 74" stroke="#0c4a6e" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'deep-manta': {
      const mantaGrad = `deepMantaGrad-${uid}`;
      const shineMaskId = `deepMantaMask-${uid}`;
      const shineGradId = `deepMantaShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={mantaGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <mask id={shineMaskId}>
              <path d="M60 18 C84 26 112 46 112 58 C96 74 78 90 60 100 C42 90 24 74 8 58 C8 46 36 26 60 18 Z" fill="#ffffff" />
            </mask>
          </defs>
          {/* Tail */}
          <path d="M60 92 Q66 108 58 116" stroke="#0284c7" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Sweeping Wing Body */}
          <path
            d="M60 18 C84 26 114 46 114 58 C96 74 78 90 60 100 C42 90 24 74 6 58 C6 46 36 26 60 18 Z"
            fill={`url(#${mantaGrad})`}
          />
          {/* Bioluminescent Wing Stripes */}
          <path d="M24 54 Q40 44 46 66" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M96 54 Q80 44 74 66" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85" />
          {/* Cephalic Horn Fins */}
          <path d="M40 26 Q34 14 46 20" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M80 26 Q86 14 74 20" stroke="#38bdf8" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Glowing Eyes */}
          <circle cx="44" cy="48" r="6.5" fill="#a5f3fc" />
          <circle cx="45" cy="48" r="3.5" fill="#0f172a" />
          <circle cx="76" cy="48" r="6.5" fill="#a5f3fc" />
          <circle cx="75" cy="48" r="3.5" fill="#0f172a" />
          <path d="M51 64 Q60 70 69 64" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" fill="none" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'deep-kraken': {
      const krakenGrad = `deepKrakenGrad-${uid}`;
      const shineMaskId = `deepKrakenMask-${uid}`;
      const shineGradId = `deepKrakenShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={krakenGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
            <mask id={shineMaskId}>
              <rect x="16" y="14" width="88" height="94" rx="24" fill="#ffffff" />
            </mask>
          </defs>
          {/* Tentacle Crown */}
          <path d="M18 76 Q4 96 16 112" stroke="#6b21a8" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M38 84 Q28 104 38 114" stroke="#9333ea" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M60 86 Q60 106 60 116" stroke="#7e22ce" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M82 84 Q92 104 82 114" stroke="#9333ea" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M102 76 Q116 96 104 112" stroke="#6b21a8" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* Kraken Crest */}
          <polygon points="34,28 24,8 46,20 60,4 74,20 96,8 86,28" fill="#581c87" />
          {/* Body */}
          <rect x="20" y="18" width="80" height="72" rx="30" fill={`url(#${krakenGrad})`} />
          {/* Mystic Glowing Runes & Eyes */}
          <circle cx="60" cy="34" r="6" fill="#e9d5ff" opacity="0.85" />
          <circle cx="42" cy="54" r="10.5" fill="#fef08a" />
          <ellipse cx="43" cy="54" rx="3.5" ry="7.5" fill="#1e1b4b" />
          <circle cx="78" cy="54" r="10.5" fill="#fef08a" />
          <ellipse cx="77" cy="54" rx="3.5" ry="7.5" fill="#1e1b4b" />
          <path d="M46 72 L60 78 L74 72" stroke="#e9d5ff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
          )}
        </svg>
      );
    }

    case 'deep-leviathan': {
      const voidGrad = `deepLeviathanGrad-${uid}`;
      const coreGrad = `deepLeviathanCore-${uid}`;
      const shineMaskId = `deepLeviathanMask-${uid}`;
      const shineGradId = `deepLeviathanShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={voidGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="55%" stopColor="#09090b" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <radialGradient id={coreGrad} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <mask id={shineMaskId}>
              <rect x="14" y="14" width="92" height="92" rx="22" fill="#ffffff" />
            </mask>
          </defs>
          {/* Abyssal Spines & Side Wings */}
          <path d="M16 48 L4 34 L18 66 Z" fill="#09090b" stroke="#94a3b8" strokeWidth="2" />
          <path d="M104 48 L116 34 L102 66 Z" fill="#09090b" stroke="#94a3b8" strokeWidth="2" />
          <polygon points="36,24 28,6 48,18 60,2 72,18 92,6 84,24" fill="#000000" stroke="#e2e8f0" strokeWidth="2" />
          {/* Void Leviathan Frame */}
          <rect
            x="18"
            y="20"
            width="84"
            height="84"
            rx="22"
            fill={`url(#${voidGrad})`}
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          {/* Rift Core */}
          <circle cx="60" cy="38" r="10" fill={`url(#${coreGrad})`} />
          <circle cx="60" cy="38" r="3.5" fill="#ffffff" />
          {/* Piercing Eyes */}
          <path d="M30 52 L50 58 L34 65 Z" fill="#ffffff" />
          <path d="M90 52 L70 58 L86 65 Z" fill="#ffffff" />
          <circle cx="40" cy="58" r="2.6" fill="#000000" />
          <circle cx="80" cy="58" r="2.6" fill="#000000" />
          {/* Abyssal Fangs */}
          <path d="M34 78 Q60 92 86 78" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" fill="none" />
          <polygon points="42,80 46,89 50,82" fill="#ffffff" />
          <polygon points="56,83 60,92 64,83" fill="#ffffff" />
          <polygon points="70,82 74,89 78,80" fill="#ffffff" />
          {shouldAnimateSpecial && (
            <>
              <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
              <circle cx="16" cy="22" r="2.2" fill="#ffffff">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.6s" repeatCount="indefinite" />
              </circle>
              <circle cx="104" cy="22" r="2.2" fill="#ffffff">
                <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </svg>
      );
    }

    /* ==================== DRINKS PACK ==================== */
    case 'drink-water':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Bottle Cap */}
          <rect x="44" y="10" width="32" height="12" rx="4" fill="#0284c7" />
          <line x1="48" y1="12" x2="48" y2="20" stroke="#7dd3fc" strokeWidth="2" />
          <line x1="56" y1="12" x2="56" y2="20" stroke="#7dd3fc" strokeWidth="2" />
          <line x1="64" y1="12" x2="64" y2="20" stroke="#7dd3fc" strokeWidth="2" />
          <line x1="72" y1="12" x2="72" y2="20" stroke="#7dd3fc" strokeWidth="2" />
          {/* Neck */}
          <path d="M46 22 L34 38 H86 L74 22 Z" fill="#bae6fd" />
          {/* Bottle Body */}
          <rect x="28" y="36" width="64" height="72" rx="16" fill="#7dd3fc" />
          {/* Water Fill */}
          <path d="M28 56 Q44 50 60 56 Q76 62 92 56 V92 A16 16 0 0 1 76 108 H44 A16 16 0 0 1 28 92 Z" fill="#0ea5e9" />
          {/* Label Strip & Water Drop Crest */}
          <rect x="28" y="60" width="64" height="24" fill="#e0f2fe" opacity="0.92" />
          <path d="M60 63 C65 69 67 74 67 76 A7 7 0 1 1 53 76 C53 74 55 69 60 63 Z" fill="#0284c7" />
          <circle cx="57.5" cy="76.5" r="1.5" fill="#bae6fd" />
          {/* Condensation Droplets & Gloss */}
          <circle cx="78" cy="49" r="2.2" fill="#ffffff" opacity="0.7" />
          <circle cx="76" cy="96" r="2.4" fill="#bae6fd" opacity="0.65" />
          <rect x="35" y="42" width="7" height="54" rx="3.5" fill="#ffffff" opacity="0.45" />
        </svg>
      );

    case 'drink-lemonade':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Striped Straw */}
          <path d="M72 42 L84 12 L94 14 L82 44 Z" fill="#ef4444" />
          <line x1="77" y1="26" x2="88" y2="29" stroke="#ffffff" strokeWidth="3.5" />
          <line x1="81" y1="17" x2="91" y2="20" stroke="#ffffff" strokeWidth="3.5" />
          {/* Lemon Slice on Rim */}
          <circle cx="30" cy="38" r="15" fill="#facc15" stroke="#fef08a" strokeWidth="3" />
          <circle cx="30" cy="38" r="9" fill="#fde047" />
          {/* Glass */}
          <polygon points="28,36 92,36 82,106 38,106" fill="#fef9c3" stroke="#eab308" strokeWidth="3" />
          {/* Lemonade Liquid */}
          <polygon points="32,52 88,52 80,103 40,103" fill="#facc15" />
          {/* Ice Cubes & Floating Lemon Wheel */}
          <rect x="40" y="48" width="14" height="14" rx="3" transform="rotate(-12 47 55)" fill="#ffffff" opacity="0.72" />
          <rect x="64" y="50" width="13" height="13" rx="3" transform="rotate(14 70 56)" fill="#ffffff" opacity="0.72" />
          <circle cx="58" cy="82" r="10" fill="#fde047" stroke="#fef9c3" strokeWidth="2.5" opacity="0.85" />
          <rect x="37" y="54" width="5.5" height="42" rx="2.75" fill="#ffffff" opacity="0.38" transform="rotate(-6 39 75)" />
        </svg>
      );

    case 'drink-orange-juice':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Carton Top */}
          <polygon points="34,26 60,12 86,26 86,38 34,38" fill="#fb923c" />
          <polygon points="34,26 60,12 60,38 34,38" fill="#fdba74" />
          <rect x="48" y="10" width="24" height="7" rx="2" fill="#ea580c" />
          {/* Carton Body */}
          <rect x="30" y="38" width="60" height="70" rx="10" fill="#f97316" />
          <rect x="30" y="52" width="60" height="40" fill="#ffedd5" />
          {/* Fresh Orange & Leaf Emblem */}
          <circle cx="60" cy="73" r="14" fill="#fb923c" stroke="#ea580c" strokeWidth="2" />
          <circle cx="60" cy="73" r="10.5" fill="#fde047" opacity="0.55" />
          <path d="M60 59 C64 52 73 53 73 59 C68 62 63 61 60 59 Z" fill="#22c55e" />
          <rect x="35" y="42" width="5.5" height="60" rx="2.75" fill="#ffffff" opacity="0.28" />
        </svg>
      );

    case 'drink-milkshake':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Straw */}
          <rect x="68" y="8" width="8" height="32" rx="3" transform="rotate(14 72 24)" fill="#ec4899" />
          {/* Whipped Cream Swirl */}
          <ellipse cx="60" cy="40" rx="32" ry="12" fill="#ffffff" />
          <ellipse cx="60" cy="30" rx="22" ry="10" fill="#fdf2f8" />
          <circle cx="60" cy="18" r="8" fill="#e11d48" />
          <circle cx="57.5" cy="15.5" r="2.2" fill="#ffffff" opacity="0.85" />
          {/* Glass Cup */}
          <polygon points="30,42 90,42 78,108 42,108" fill="#f472b6" stroke="#db2777" strokeWidth="3" />
          {/* Strawberry Swirls & Sprinkles */}
          <path d="M35 64 Q48 56 60 64 Q72 72 85 62" stroke="#fbcfe8" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.7" />
          <path d="M39 86 Q52 78 64 86 Q74 92 81 84" stroke="#fdf2f8" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
          <line x1="46" y1="34" x2="50" y2="37" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="72" y1="33" x2="68" y2="37" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="37" y="48" width="5.5" height="52" rx="2.75" fill="#ffffff" opacity="0.32" transform="rotate(-7 39 74)" />
        </svg>
      );

    case 'drink-boba':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Wide Boba Straw */}
          <rect x="55" y="6" width="11" height="34" rx="3" fill="#be185d" />
          {/* Lid */}
          <rect x="26" y="34" width="68" height="10" rx="5" fill="#fdf2f8" stroke="#be185d" strokeWidth="2.5" />
          {/* Cup Body */}
          <polygon points="30,44 90,44 80,108 40,108" fill="#f5d0a9" stroke="#92400e" strokeWidth="2.5" />
          {/* Brown Sugar Drizzle & Milk Tea Wave */}
          <path d="M33 52 Q44 64 52 54 Q60 66 70 54 Q80 64 87 52 V44 H33 Z" fill="#b45309" opacity="0.6" />
          <path d="M35 72 Q50 65 60 72 Q72 79 85 71" stroke="#fef3c7" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.55" />
          {/* Tapioca Pearls */}
          <circle cx="46" cy="96" r="5.5" fill="#292524" />
          <circle cx="59" cy="98" r="5.5" fill="#292524" />
          <circle cx="72" cy="96" r="5.5" fill="#292524" />
          <circle cx="52" cy="87" r="5" fill="#44403c" />
          <circle cx="66" cy="87" r="5" fill="#44403c" />
          <rect x="36" y="48" width="5.5" height="52" rx="2.75" fill="#ffffff" opacity="0.3" transform="rotate(-6 39 74)" />
        </svg>
      );

    case 'drink-iced-coffee':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Dome Lid & Straw */}
          <rect x="56" y="6" width="8" height="28" rx="3" fill="#16a34a" />
          <path d="M28 42 C28 20 92 20 92 42 Z" fill="#e2e8f0" opacity="0.85" stroke="#94a3b8" strokeWidth="2" />
          {/* Cup */}
          <polygon points="28,42 92,42 82,108 38,108" fill="#78350f" />
          {/* Cream Swirl */}
          <path d="M32 52 Q60 66 88 52 L85 74 Q60 86 35 74 Z" fill="#fef3c7" opacity="0.85" />
          <path d="M36 86 Q60 96 84 86" stroke="#d97706" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.65" />
          {/* Ice Cubes */}
          <rect x="40" y="45" width="13" height="12" rx="2.5" transform="rotate(-8 46 51)" fill="#ffffff" opacity="0.68" />
          <rect x="65" y="46" width="13" height="12" rx="2.5" transform="rotate(10 71 52)" fill="#ffffff" opacity="0.68" />
          <rect x="36" y="48" width="5.5" height="52" rx="2.75" fill="#ffffff" opacity="0.28" transform="rotate(-6 39 74)" />
        </svg>
      );

    case 'drink-root-beer':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Mug Handle */}
          <path d="M84 54 H98 A10 10 0 0 1 108 64 V82 A10 10 0 0 1 98 92 H84" stroke="#cbd5e1" strokeWidth="9" strokeLinecap="round" fill="none" />
          {/* Ice Cream Scoop & Foam */}
          <circle cx="56" cy="34" r="19" fill="#fef3c7" />
          <circle cx="40" cy="40" r="12" fill="#ffffff" />
          <circle cx="72" cy="40" r="12" fill="#ffffff" />
          <circle cx="58" cy="17" r="6" fill="#dc2626" />
          {/* Mug Body */}
          <rect x="26" y="42" width="60" height="66" rx="10" fill="#451a03" stroke="#e2e8f0" strokeWidth="3.5" />
          {/* Foam Drips */}
          <path d="M28 44 H84 V54 Q76 62 70 52 Q62 64 54 52 Q44 62 36 52 L28 56 Z" fill="#ffffff" />
          {/* Glass Mug Flutes & Fizz */}
          <rect x="35" y="64" width="7" height="34" rx="3.5" fill="#78350f" stroke="#92400e" strokeWidth="1.5" />
          <rect x="52" y="64" width="7" height="34" rx="3.5" fill="#78350f" stroke="#92400e" strokeWidth="1.5" />
          <rect x="69" y="64" width="7" height="34" rx="3.5" fill="#78350f" stroke="#92400e" strokeWidth="1.5" />
        </svg>
      );

    case 'drink-matcha':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Bamboo Straw */}
          <rect x="66" y="8" width="9" height="32" rx="3" transform="rotate(14 70 24)" fill="#84cc16" />
          {/* Matcha Foam Top */}
          <ellipse cx="60" cy="42" rx="33" ry="11" fill="#ecfccb" stroke="#65a30d" strokeWidth="2.5" />
          <path d="M52 42 Q60 35 68 42 Q60 49 52 42 Z" fill="#4d7c0f" />
          {/* Layered Matcha Cup */}
          <polygon points="28,42 92,42 82,108 38,108" fill="#65a30d" />
          <polygon points="34,76 86,76 82,108 38,108" fill="#fefce8" />
          <path d="M32 76 Q48 70 60 76 Q74 82 88 76" stroke="#84cc16" strokeWidth="5" fill="none" />
          {/* Subtle Tea Leaf Crest & Shine */}
          <path d="M53 60 C58 52 68 53 68 60 C63 64 57 63 53 60 Z" fill="#bef264" opacity="0.85" />
          <rect x="36" y="48" width="5.5" height="52" rx="2.75" fill="#ffffff" opacity="0.3" transform="rotate(-6 39 74)" />
        </svg>
      );

    case 'drink-slushie': {
      const gradId = `slushGrad-${uid}`;
      const shineMaskId = `slushMask-${uid}`;
      const shineGradId = `slushShine-${uid}`;
      return (
        <svg
          viewBox="0 0 120 120"
          className={`${className} ${shouldAnimateSpecial ? 'animate-chroma-move' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <mask id={shineMaskId}>
              <polygon points="28,42 92,42 82,108 38,108" fill="#ffffff" />
            </mask>
          </defs>
          {/* Neon Spoon Straw */}
          <rect x="66" y="6" width="9" height="36" rx="3" transform="rotate(14 70 24)" fill="#22d3ee" />
          {/* Slushie Dome */}
          <path d="M28 44 C28 16 92 16 92 44 Z" fill="#f472b6" />
          <path d="M36 44 C36 22 84 22 84 44 Z" fill="#38bdf8" opacity="0.7" />
          {/* Cup */}
          <polygon
            points="28,44 92,44 82,108 38,108"
            fill={`url(#${gradId})`}
          />
          {/* Neon Fizz Wave & Ice Crystals */}
          <path d="M34 68 Q48 60 60 68 Q72 76 86 68" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.45" />
          <circle cx="46" cy="86" r="3" fill="#ffffff" opacity="0.6" />
          <circle cx="72" cy="82" r="2.5" fill="#bae6fd" opacity="0.7" />
          <circle cx="60" cy="94" r="2" fill="#ffffff" opacity="0.65" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'drink-galaxy-soda': {
      const gradId = `galaxySodaGrad-${uid}`;
      const shineMaskId = `galaxySodaMask-${uid}`;
      const shineGradId = `galaxySodaShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#7e22ce" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <mask id={shineMaskId}>
              <rect x="28" y="24" width="64" height="84" rx="14" fill="#ffffff" />
            </mask>
          </defs>
          {/* Soda Can Rim */}
          <rect x="34" y="16" width="52" height="10" rx="5" fill="#cbd5e1" />
          <rect x="28" y="24" width="64" height="84" rx="14" fill={`url(#${gradId})`} />
          {/* Galaxy Planet Ring & Stars */}
          <ellipse cx="60" cy="66" rx="22" ry="7" transform="rotate(-18 60 66)" stroke="#67e8f9" strokeWidth="3" fill="none" opacity="0.85" />
          <circle cx="60" cy="66" r="10" fill="#fde047" opacity="0.9" />
          <circle cx="40" cy="40" r="2.2" fill="#fde047" />
          <circle cx="80" cy="44" r="2" fill="#ffffff" />
          <circle cx="60" cy="36" r="2.6" fill="#67e8f9" />
          <circle cx="42" cy="94" r="2" fill="#f9a8d4" />
          <circle cx="78" cy="92" r="2.2" fill="#fde047" />
          <rect x="34" y="32" width="6" height="68" rx="3" fill="#ffffff" opacity="0.22" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'drink-elixir': {
      const gradId = `elixirGrad-${uid}`;
      const shineMaskId = `elixirMask-${uid}`;
      const shineGradId = `elixirShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#4c1d95" />
            </linearGradient>
            <mask id={shineMaskId}>
              <circle cx="60" cy="72" r="36" fill="#ffffff" />
            </mask>
          </defs>
          {/* Cork & Flask Neck */}
          <rect x="49" y="10" width="22" height="14" rx="4" fill="#d97706" />
          <rect x="45" y="22" width="30" height="18" rx="4" fill="#e9d5ff" />
          {/* Potion Bulb */}
          <circle cx="60" cy="72" r="36" fill={`url(#${gradId})`} stroke="#f3e8ff" strokeWidth="3" />
          {/* Glowing Crescent & Arcane Star Crest */}
          <path d="M36 58 A26 26 0 0 1 56 42" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
          <polygon points="60,55 64,66 75,70 64,74 60,85 56,74 45,70 56,66" fill="#fef08a" opacity="0.9" />
          <circle cx="44" cy="84" r="3" fill="#e9d5ff" opacity="0.7" />
          <circle cx="76" cy="60" r="2.5" fill="#e9d5ff" opacity="0.7" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
          )}
        </svg>
      );
    }

    case 'drink-golden-nectar': {
      const gradId = `mangoSmoothieGrad-${uid}`;
      const shineMaskId = `mangoSmoothieMask-${uid}`;
      const shineGradId = `mangoSmoothieShine-${uid}`;
      const cupClipId = `mangoSmoothieCupClip-${uid}`;
      const liquidClipId = `mangoSmoothieLiquidClip-${uid}`;
      const whippedClipId = `mangoSmoothieWhippedClip-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <mask id={shineMaskId}>
              <polygon points="28,42 92,42 82,108 38,108" fill="#ffffff" />
            </mask>
            <clipPath id={cupClipId}>
              <polygon points="28,42 92,42 82,108 38,108" />
            </clipPath>
            <clipPath id={whippedClipId}>
              <rect x="0" y="0" width="120" height="43" />
              <polygon points="28,42 92,42 82,108 38,108" />
            </clipPath>
            <clipPath id={liquidClipId}>
              <rect x="20" y="42" width="80" height="72">
                {shouldAnimateSpecial && (
                  <animate
                    attributeName="y"
                    values="42; 42; 108; 108; 42"
                    keyTimes="0; 0.14; 0.52; 0.64; 1"
                    dur="4.2s"
                    repeatCount="indefinite"
                  />
                )}
              </rect>
            </clipPath>
          </defs>
          {/* Radiant Godly Mango Aura */}
          <circle cx="60" cy="64" r="50" fill="#fde047" opacity="0.22" />
          {/* Striped Coral Smoothie Straw */}
          <path d="M68 42 L80 10 L90 12 L78 44 Z" fill="#f97316" />
          <line x1="73" y1="26" x2="84" y2="29" stroke="#ffffff" strokeWidth="3.5" />
          <line x1="77" y1="17" x2="87" y2="20" stroke="#ffffff" strokeWidth="3.5" />
          {/* Fresh Mango Wedge & Mint Leaf on Rim */}
          <path d="M24 38 C16 26 26 14 40 20 C44 26 38 38 24 38 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="2.5" />
          <path d="M36 24 C42 12 56 12 56 22 C48 26 42 26 36 24 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.8" />
          {/* Frosted Empty Cup Backing + Submerged Straw + Draining & Refilling Smoothie */}
          <g clipPath={`url(#${cupClipId})`}>
            <polygon points="28,42 92,42 82,108 38,108" fill="#fffbeb" opacity="0.34" />
            <line x1="72" y1="42" x2="58" y2="105" stroke="#fb923c" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
            <g clipPath={`url(#${liquidClipId})`}>
              <polygon points="28,42 92,42 82,108 38,108" fill={`url(#${gradId})`} />
              {/* Creamy Mango Swirl Layers */}
              <path d="M33 62 Q48 54 60 62 Q72 70 87 60" stroke="#fef08a" strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.75" />
              <path d="M35 76 Q50 68 62 76 Q74 84 85 74" stroke="#fffbeb" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.55" />
              <path d="M37 90 Q50 84 62 90 Q74 96 83 88" stroke="#fed7aa" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.6" />
            </g>
            {shouldAnimateSpecial && (
              <ellipse cx="60" cy="42" rx="32" ry="4" fill="#fef08a" opacity="0.88">
                <animate
                  attributeName="cy"
                  values="42; 42; 108; 108; 42"
                  keyTimes="0; 0.14; 0.52; 0.64; 1"
                  dur="4.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0; 0.85; 0.35; 0; 0.85; 0"
                  keyTimes="0; 0.15; 0.5; 0.54; 0.66; 1"
                  dur="4.2s"
                  repeatCount="indefinite"
                />
              </ellipse>
            )}
          </g>
          {/* Whipped Cream Swirl moving down & refilling with the Mango Smoothie */}
          <g clipPath={`url(#${whippedClipId})`}>
            <g>
              {shouldAnimateSpecial && (
                <>
                  <animateTransform
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 0; 0 65; 0 65; 0 0"
                    keyTimes="0; 0.14; 0.52; 0.64; 1"
                    dur="4.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1; 1; 0.85; 0; 0; 0.85; 1"
                    keyTimes="0; 0.14; 0.48; 0.52; 0.64; 0.68; 1"
                    dur="4.2s"
                    repeatCount="indefinite"
                  />
                </>
              )}
              <g transform="translate(60 40)">
                <g>
                  {shouldAnimateSpecial && (
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="1 1; 1 1; 0.66 0.66; 0.66 0.66; 1 1"
                      keyTimes="0; 0.14; 0.52; 0.64; 1"
                      dur="4.2s"
                      repeatCount="indefinite"
                    />
                  )}
                  <ellipse cx="0" cy="0" rx="31" ry="11" fill="#fffbeb" />
                  <ellipse cx="0" cy="-9" rx="20" ry="9" fill="#ffffff" />
                  <circle cx="0" cy="-18" r="6" fill="#f59e0b" />
                </g>
              </g>
            </g>
          </g>
          {/* Smoothie Cup Outline */}
          <polygon points="28,42 92,42 82,108 38,108" fill="none" stroke="#b45309" strokeWidth="3" />
          {/* Glossy Highlight */}
          <rect x="36" y="48" width="6" height="50" rx="3" fill="#ffffff" opacity="0.35" transform="rotate(-7 39 73)" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
          )}
        </svg>
      );
    }

    /* ==================== BALL PACK ==================== */
    case 'ball-tennis':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="46" fill="#a3e635" stroke="#4d7c0f" strokeWidth="3.5" />
          <path d="M28 28 Q54 60 28 92" stroke="#fef9c3" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M92 28 Q66 60 92 92" stroke="#fef9c3" strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="44" cy="34" rx="12" ry="7" transform="rotate(-28 44 34)" fill="#ecfccb" opacity="0.55" />
        </svg>
      );

    case 'ball-basketball':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="46" fill="#ea580c" stroke="#7c2d12" strokeWidth="3.5" />
          <line x1="14" y1="60" x2="106" y2="60" stroke="#431407" strokeWidth="3.5" />
          <line x1="60" y1="14" x2="60" y2="106" stroke="#431407" strokeWidth="3.5" />
          <path d="M30 24 Q54 60 30 96" stroke="#431407" strokeWidth="3.5" fill="none" />
          <path d="M90 24 Q66 60 90 96" stroke="#431407" strokeWidth="3.5" fill="none" />
          <ellipse cx="42" cy="34" rx="11" ry="6.5" transform="rotate(-28 42 34)" fill="#fdba74" opacity="0.45" />
        </svg>
      );

    case 'ball-baseball':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="46" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3.5" />
          <path d="M32 24 Q54 60 32 96" stroke="#dc2626" strokeWidth="3.2" fill="none" />
          <path d="M88 24 Q66 60 88 96" stroke="#dc2626" strokeWidth="3.2" fill="none" />
          <path d="M28 28 Q50 60 28 92" stroke="#dc2626" strokeWidth="3.5" strokeDasharray="5 5" fill="none" />
          <path d="M92 28 Q70 60 92 92" stroke="#dc2626" strokeWidth="3.5" strokeDasharray="5 5" fill="none" />
          <ellipse cx="45" cy="34" rx="10" ry="6" transform="rotate(-25 45 34)" fill="#ffffff" opacity="0.75" />
        </svg>
      );

    case 'ball-beach':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="46" fill="#ffffff" stroke="#1e293b" strokeWidth="3.5" />
          <path d="M60 14 A46 46 0 0 0 18 78 L60 60 Z" fill="#ef4444" />
          <path d="M60 14 A46 46 0 0 1 102 78 L60 60 Z" fill="#3b82f6" />
          <path d="M18 78 A46 46 0 0 0 102 78 L60 60 Z" fill="#facc15" />
          <circle cx="60" cy="60" r="10" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
          <ellipse cx="42" cy="34" rx="10" ry="6" transform="rotate(-25 42 34)" fill="#ffffff" opacity="0.45" />
        </svg>
      );

    case 'ball-soccer':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="46" fill="#f8fafc" stroke="#0f172a" strokeWidth="4" />
          <line x1="60" y1="40" x2="60" y2="20" stroke="#1e293b" strokeWidth="3" />
          <line x1="76" y1="52" x2="96" y2="46" stroke="#1e293b" strokeWidth="3" />
          <line x1="44" y1="52" x2="24" y2="46" stroke="#1e293b" strokeWidth="3" />
          <line x1="70" y1="71" x2="84" y2="90" stroke="#1e293b" strokeWidth="3" />
          <line x1="50" y1="71" x2="36" y2="90" stroke="#1e293b" strokeWidth="3" />
          <polygon points="60,40 76,52 70,71 50,71 44,52" fill="#1e293b" />
          <polygon points="60,14 48,22 72,22" fill="#1e293b" />
          <polygon points="103,48 93,38 96,60" fill="#1e293b" />
          <polygon points="17,48 27,38 24,60" fill="#1e293b" />
          <polygon points="36,100 28,84 48,92" fill="#1e293b" />
          <polygon points="84,100 92,84 72,92" fill="#1e293b" />
        </svg>
      );

    case 'ball-volleyball':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="46" fill="#fef08a" stroke="#1e3a8a" strokeWidth="3.5" />
          <path d="M18 46 Q56 30 98 42" stroke="#2563eb" strokeWidth="8" fill="none" />
          <path d="M22 76 Q60 60 100 72" stroke="#eab308" strokeWidth="6" fill="none" />
          <path d="M46 16 Q60 58 48 104" stroke="#1e3a8a" strokeWidth="3" fill="none" />
          <path d="M74 18 Q84 58 72 102" stroke="#1e3a8a" strokeWidth="2.8" fill="none" />
        </svg>
      );

    case 'ball-bowling':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="46" fill="#4f46e5" stroke="#1e1b4b" strokeWidth="3.5" />
          <ellipse cx="40" cy="36" rx="13" ry="7.5" transform="rotate(-32 40 36)" fill="#a5b4fc" opacity="0.58" />
          {/* Three Finger Holes */}
          <circle cx="50" cy="48" r="5.8" fill="#1e1b4b" />
          <circle cx="68" cy="44" r="5.8" fill="#1e1b4b" />
          <circle cx="61" cy="62" r="6" fill="#1e1b4b" />
        </svg>
      );

    case 'ball-eight':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="46" fill="#18181b" stroke="#52525b" strokeWidth="3.5" />
          <ellipse cx="39" cy="33" rx="11" ry="6" transform="rotate(-30 39 33)" fill="#ffffff" opacity="0.22" />
          <circle cx="60" cy="60" r="24" fill="#ffffff" />
          <text
            x="60"
            y="71"
            textAnchor="middle"
            fill="#09090b"
            fontFamily="'Titan One', cursive, sans-serif"
            fontSize="31"
          >
            8
          </text>
        </svg>
      );

    case 'ball-disco': {
      const gradId = `discoGrad-${uid}`;
      const shineMaskId = `discoMask-${uid}`;
      const shineGradId = `discoShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0abfc" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <mask id={shineMaskId}>
              <circle cx="60" cy="60" r="46" fill="#ffffff" />
            </mask>
          </defs>
          <circle cx="60" cy="60" r="46" fill={`url(#${gradId})`} stroke="#ffffff" strokeWidth="3" />
          {/* Mirror Grid Lines */}
          <line x1="20" y1="42" x2="100" y2="42" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          <line x1="14" y1="60" x2="106" y2="60" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          <line x1="20" y1="78" x2="100" y2="78" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          <line x1="42" y1="18" x2="42" y2="102" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          <line x1="60" y1="14" x2="60" y2="106" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          <line x1="78" y1="18" x2="78" y2="102" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
          {/* Reflective Mirror Facets */}
          <rect x="43" y="43" width="16" height="16" fill="#ffffff" opacity="0.45" />
          <rect x="61" y="61" width="16" height="16" fill="#f0abfc" opacity="0.45" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'ball-crystal': {
      const gradId = `crystalOrbGrad-${uid}`;
      const shineMaskId = `crystalOrbMask-${uid}`;
      const shineGradId = `crystalOrbShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={gradId} cx="38%" cy="34%" r="68%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </radialGradient>
            <mask id={shineMaskId}>
              <circle cx="60" cy="56" r="42" fill="#ffffff" />
            </mask>
          </defs>
          {/* Pedestal */}
          <polygon points="34,106 86,106 76,90 44,90" fill="#a855f7" stroke="#581c87" strokeWidth="2.5" />
          {/* Orb */}
          <circle cx="60" cy="56" r="42" fill={`url(#${gradId})`} stroke="#e0f2fe" strokeWidth="3" />
          {/* Mystical Nebula Swirl & Specular Highlight */}
          <path d="M36 62 Q60 40 84 62 Q60 80 36 62 Z" fill="#c084fc" opacity="0.4" />
          <ellipse cx="44" cy="36" rx="10" ry="6" transform="rotate(-28 44 36)" fill="#ffffff" opacity="0.72" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'ball-plasma': {
      const gradId = `plasmaGrad-${uid}`;
      const shineMaskId = `plasmaMask-${uid}`;
      const shineGradId = `plasmaShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id={gradId} cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#f0abfc" />
              <stop offset="45%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>
            <mask id={shineMaskId}>
              <circle cx="60" cy="60" r="46" fill="#ffffff" />
            </mask>
          </defs>
          <circle cx="60" cy="60" r="46" fill={`url(#${gradId})`} stroke="#e879f9" strokeWidth="3.5" />
          {/* Glowing Plasma Core & Lightning Arcs */}
          <circle cx="60" cy="60" r="14" fill="#fef08a" opacity="0.45" />
          <circle cx="60" cy="60" r="7" fill="#ffffff" />
          <polyline points="60,16 50,36 62,42 58,54" stroke="#67e8f9" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <polyline points="20,70 38,64 44,76 56,64" stroke="#f0abfc" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <polyline points="100,66 82,62 76,74 64,64" stroke="#67e8f9" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <polyline points="58,104 66,86 54,78 60,67" stroke="#fef08a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
          )}
        </svg>
      );
    }

    case 'ball-super': {
      const gradId = `superBouncerGrad-${uid}`;
      const shineMaskId = `superBouncerMask-${uid}`;
      const shineGradId = `superBouncerShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#18181b" />
              <stop offset="35%" stopColor="#f43f5e" />
              <stop offset="68%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#09090b" />
            </linearGradient>
            <mask id={shineMaskId}>
              <circle cx="60" cy="60" r="46" fill="#ffffff" />
            </mask>
          </defs>
          {/* Secret Void Orbit Swirl */}
          <ellipse cx="60" cy="60" rx="54" ry="18" transform="rotate(-20 60 60)" stroke="#e2e8f0" strokeWidth="3.2" fill="none" opacity="0.8" />
          <circle cx="60" cy="60" r="44" fill={`url(#${gradId})`} stroke="#000000" strokeWidth="4" />
          <circle cx="60" cy="60" r="41" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.85" />
          {/* Bold Super Star Crest & Gloss */}
          <polygon points="60,34 67,50 84,52 71,63 75,80 60,71 45,80 49,63 36,52 53,50" fill="#ffffff" opacity="0.85" />
          <ellipse cx="42" cy="34" rx="9" ry="5" transform="rotate(-28 42 34)" fill="#ffffff" opacity="0.5" />
          {shouldAnimateSpecial && (
            <>
              <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
              <circle cx="16" cy="22" r="2.3" fill="#ffffff">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="104" cy="22" r="2.3" fill="#ffffff">
                <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </>
          )}
        </svg>
      );
    }

    /* ==================== DESSERT PACK ==================== */
    case 'dessert-donut':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Baked Dough Ring */}
          <circle cx="60" cy="62" r="44" fill="#f59e0b" stroke="#92400e" strokeWidth="3.5" />
          {/* Strawberry Pink Glaze with Scalloped Drips */}
          <path
            d="M60 18 A44 44 0 1 0 104 62 A44 44 0 0 0 60 18 Z"
            fill="#f472b6"
          />
          <path
            d="M22 68 Q30 78 38 69 Q46 79 54 70 Q62 80 70 70 Q78 80 86 69 Q94 78 100 66 A44 44 0 0 1 22 68 Z"
            fill="#f59e0b"
          />
          {/* Donut Center Hole */}
          <circle cx="60" cy="62" r="15" fill="#fffbeb" stroke="#92400e" strokeWidth="3" />
          <circle cx="60" cy="62" r="12" fill="rgba(0,0,0,0.08)" />
          {/* Rainbow Sprinkles */}
          <rect x="34" y="34" width="11" height="4.5" rx="2.2" fill="#fef08a" transform="rotate(-24 39 36)" />
          <rect x="66" y="28" width="11" height="4.5" rx="2.2" fill="#38bdf8" transform="rotate(28 71 30)" />
          <rect x="82" y="48" width="11" height="4.5" rx="2.2" fill="#4ade80" transform="rotate(-35 87 50)" />
          <rect x="26" y="54" width="10" height="4.5" rx="2.2" fill="#ffffff" transform="rotate(18 31 56)" />
          <rect x="44" y="84" width="11" height="4.5" rx="2.2" fill="#a855f7" transform="rotate(-15 49 86)" />
          <rect x="72" y="82" width="10" height="4.5" rx="2.2" fill="#ef4444" transform="rotate(24 77 84)" />
        </svg>
      );

    case 'dessert-cupcake':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Pleated Wrapper */}
          <polygon points="28,62 92,62 82,106 38,106" fill="#fbbf24" stroke="#b45309" strokeWidth="3.2" />
          <line x1="44" y1="62" x2="48" y2="105" stroke="#d97706" strokeWidth="2.5" />
          <line x1="60" y1="62" x2="60" y2="105" stroke="#d97706" strokeWidth="2.5" />
          <line x1="76" y1="62" x2="72" y2="105" stroke="#d97706" strokeWidth="2.5" />
          {/* Fluffy Swirled Frosting */}
          <ellipse cx="60" cy="57" rx="37" ry="15" fill="#fbcfe8" stroke="#db2777" strokeWidth="2.8" />
          <ellipse cx="60" cy="43" rx="28" ry="13" fill="#f9a8d4" stroke="#db2777" strokeWidth="2.5" />
          <ellipse cx="60" cy="31" rx="18" ry="10" fill="#fdf2f8" stroke="#db2777" strokeWidth="2.2" />
          {/* Glossy Cherry on Top */}
          <path d="M60 18 Q68 8 74 10" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="21" r="8.5" fill="#ef4444" stroke="#991b1b" strokeWidth="2.2" />
          <circle cx="57" cy="18.5" r="2.6" fill="#ffffff" opacity="0.75" />
          {/* Sprinkles */}
          <circle cx="38" cy="54" r="2.4" fill="#38bdf8" />
          <circle cx="78" cy="48" r="2.4" fill="#facc15" />
          <circle cx="48" cy="40" r="2.2" fill="#4ade80" />
        </svg>
      );

    case 'dessert-cookie':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Golden-Brown Baked Cookie Base */}
          <circle cx="60" cy="60" r="45" fill="#d97706" stroke="#78350f" strokeWidth="3.5" />
          <circle cx="60" cy="60" r="39" fill="#f59e0b" opacity="0.45" />
          {/* Bite Highlight & Crumb Texture */}
          <ellipse cx="42" cy="34" rx="14" ry="7" transform="rotate(-25 42 34)" fill="#fde68a" opacity="0.4" />
          {/* Melty Chocolate Chunks */}
          <circle cx="42" cy="44" r="7.5" fill="#451a03" />
          <circle cx="74" cy="38" r="6.5" fill="#451a03" />
          <circle cx="58" cy="62" r="8" fill="#451a03" />
          <circle cx="36" cy="72" r="6" fill="#451a03" />
          <circle cx="78" cy="74" r="7.5" fill="#451a03" />
          <circle cx="58" cy="88" r="5.5" fill="#451a03" />
        </svg>
      );

    case 'dessert-ice-cream':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Crisp Waffle Cone */}
          <polygon points="34,54 86,54 60,110" fill="#d97706" stroke="#78350f" strokeWidth="3.2" />
          <line x1="42" y1="68" x2="78" y2="68" stroke="#92400e" strokeWidth="2.2" />
          <line x1="49" y1="84" x2="71" y2="84" stroke="#92400e" strokeWidth="2.2" />
          <line x1="52" y1="54" x2="60" y2="108" stroke="#92400e" strokeWidth="2" />
          <line x1="68" y1="54" x2="60" y2="108" stroke="#92400e" strokeWidth="2" />
          {/* Bottom Mint Scoop */}
          <circle cx="60" cy="46" r="26" fill="#86efac" stroke="#15803d" strokeWidth="2.8" />
          <circle cx="42" cy="54" r="7" fill="#86efac" />
          <circle cx="78" cy="54" r="7" fill="#86efac" />
          {/* Top Strawberry Scoop */}
          <circle cx="60" cy="27" r="21" fill="#fda4af" stroke="#be123c" strokeWidth="2.8" />
          <ellipse cx="51" cy="19" rx="7" ry="4" transform="rotate(-25 51 19)" fill="#ffffff" opacity="0.5" />
          {/* Chocolate Drizzle */}
          <path d="M44 23 Q52 34 60 24 Q68 35 76 23" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'dessert-macaron':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Bottom Macaron Shell */}
          <path d="M22 72 H98 C98 92 80 100 60 100 C40 100 22 92 22 72 Z" fill="#a855f7" stroke="#581c87" strokeWidth="3" />
          <rect x="20" y="66" width="80" height="8" rx="4" fill="#c084fc" stroke="#581c87" strokeWidth="2.2" />
          {/* Whipped Vanilla Creme Filling */}
          <rect x="23" y="52" width="74" height="16" rx="7" fill="#fffbeb" stroke="#e2e8f0" strokeWidth="2.2" />
          {/* Top Macaron Shell */}
          <rect x="20" y="46" width="80" height="8" rx="4" fill="#c084fc" stroke="#581c87" strokeWidth="2.2" />
          <path d="M22 47 C22 26 40 20 60 20 C80 20 98 26 98 47 Z" fill="#a855f7" stroke="#581c87" strokeWidth="3" />
          {/* Gloss Highlight */}
          <ellipse cx="44" cy="31" rx="14" ry="4.5" transform="rotate(-12 44 31)" fill="#f3e8ff" opacity="0.65" />
        </svg>
      );

    case 'dessert-cheesecake':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Cheesecake Wedge */}
          <polygon points="18,54 98,38 98,86 18,96" fill="#fef3c7" stroke="#92400e" strokeWidth="3" />
          {/* Top Cream Wedge */}
          <polygon points="18,54 78,24 98,38" fill="#fffbeb" stroke="#92400e" strokeWidth="2.8" />
          {/* Golden Graham Cracker Crust */}
          <polygon points="18,86 98,76 98,88 18,98" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
          {/* Strawberry Topping Glaze & Drips */}
          <polygon points="22,52 78,25 96,38 72,44" fill="#ef4444" opacity="0.92" />
          <path d="M36 52 Q40 68 46 50 Q56 72 62 47 Q72 66 78 43" fill="#ef4444" />
          {/* Fresh Berry On Top */}
          <circle cx="62" cy="33" r="9" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
          <path d="M56 26 L62 22 L68 26 Z" fill="#22c55e" />
        </svg>
      );

    case 'dessert-cinnamon-roll':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Warm Golden Pastry Base */}
          <ellipse cx="60" cy="64" rx="44" ry="38" fill="#d97706" stroke="#78350f" strokeWidth="3.5" />
          <ellipse cx="60" cy="58" rx="40" ry="33" fill="#f59e0b" />
          {/* Cinnamon Swirl */}
          <path
            d="M60 56 C66 56 68 49 60 47 C48 45 45 60 56 66 C71 73 80 57 73 43 C64 28 38 33 34 52 C30 74 52 86 73 80"
            stroke="#78350f"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Glossy White Vanilla Icing Drizzle */}
          <path
            d="M28 48 Q44 36 58 50 Q74 64 92 44"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity="0.92"
          />
          <path
            d="M36 70 Q54 58 72 72"
            stroke="#fffbeb"
            strokeWidth="6.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.88"
          />
        </svg>
      );

    case 'dessert-lava-cake':
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Rich Chocolate Sponge */}
          <polygon points="24,48 96,48 88,102 32,102" fill="#451a03" stroke="#1c1917" strokeWidth="3.5" />
          <ellipse cx="60" cy="48" rx="36" ry="12" fill="#572409" stroke="#1c1917" strokeWidth="3" />
          {/* Oozing Molten Chocolate Lava */}
          <path
            d="M32 48 Q42 84 48 54 Q58 92 66 52 Q76 80 86 48 Z"
            fill="#92400e"
          />
          <path
            d="M38 48 Q45 76 52 52 Q60 84 68 50 Q75 70 82 48 Z"
            fill="#f97316"
            opacity="0.35"
          />
          {/* Vanilla Ice Cream Scoop on Top */}
          <circle cx="60" cy="33" r="18" fill="#fffbeb" stroke="#d6d3d1" strokeWidth="2.5" />
          <path d="M46 28 Q54 38 60 27 Q68 38 74 28" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="14" r="5.5" fill="#ef4444" />
        </svg>
      );

    case 'dessert-aurora-parfait': {
      const gradId = `auroraParfaitGrad-${uid}`;
      const shineMaskId = `auroraParfaitMask-${uid}`;
      const shineGradId = `auroraParfaitShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f0abfc" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <mask id={shineMaskId}>
              <polygon points="32,36 88,36 74,92 46,92" fill="#ffffff" />
            </mask>
          </defs>
          {/* Parfait Glass Stem & Base */}
          <rect x="55" y="90" width="10" height="14" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <ellipse cx="60" cy="106" rx="22" ry="6" fill="#bae6fd" stroke="#0284c7" strokeWidth="2.2" />
          {/* Parfait Glass Cup */}
          <polygon points="32,36 88,36 74,92 46,92" fill={`url(#${gradId})`} stroke="#e0f2fe" strokeWidth="3" />
          {/* Cream Layer Bands */}
          <path d="M36 52 Q60 60 84 52" stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.85" />
          <path d="M41 70 Q60 78 79 70" stroke="#fef08a" strokeWidth="4.5" fill="none" opacity="0.8" />
          {/* Whipped Cream Dome & Star */}
          <ellipse cx="60" cy="34" rx="27" ry="11" fill="#ffffff" />
          <ellipse cx="60" cy="24" rx="18" ry="9" fill="#fdf4ff" />
          <polygon points="60,8 63,16 71,16 65,21 67,29 60,24 53,29 55,21 49,16 57,16" fill="#facc15" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'dessert-crystal-candy': {
      const gradId = `crystalCandyGrad-${uid}`;
      const shineMaskId = `crystalCandyMask-${uid}`;
      const shineGradId = `crystalCandyShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <mask id={shineMaskId}>
              <rect x="20" y="12" width="80" height="72" fill="#ffffff" />
            </mask>
          </defs>
          {/* Wooden Candy Stick */}
          <rect x="56" y="72" width="8" height="36" rx="4" fill="#fde68a" stroke="#b45309" strokeWidth="2.2" />
          {/* Prismatic Sugar Crystals */}
          <polygon points="60,12 78,32 72,76 48,76 42,32" fill={`url(#${gradId})`} stroke="#ffffff" strokeWidth="2.5" />
          <polygon points="34,34 48,46 46,74 30,66 26,44" fill="#38bdf8" stroke="#e0f2fe" strokeWidth="2.2" />
          <polygon points="86,34 94,44 90,66 74,74 72,46" fill="#f472b6" stroke="#fdf2f8" strokeWidth="2.2" />
          {/* Facet Highlights */}
          <polygon points="60,12 70,32 60,54 50,32" fill="#ffffff" opacity="0.32" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
          )}
        </svg>
      );
    }

    case 'dessert-mystic-souffle': {
      const gradId = `mysticSouffleGrad-${uid}`;
      const shineMaskId = `mysticSouffleMask-${uid}`;
      const shineGradId = `mysticSouffleShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>
            <mask id={shineMaskId}>
              <ellipse cx="60" cy="48" rx="34" ry="26" fill="#ffffff" />
            </mask>
          </defs>
          {/* Orbiting Arcane Ring */}
          <ellipse cx="60" cy="52" rx="52" ry="15" transform="rotate(-12 60 52)" stroke="#e9d5ff" strokeWidth="2.8" fill="none" opacity="0.8" />
          {/* Risen Soufflé Crown */}
          <path d="M26 58 C24 28 42 18 60 18 C78 18 96 28 94 58 Z" fill={`url(#${gradId})`} stroke="#fef08a" strokeWidth="2.8" />
          {/* Powdered Sugar Dusting */}
          <ellipse cx="60" cy="28" rx="18" ry="6" fill="#ffffff" opacity="0.55" />
          {/* Porcelain Ramekin Cup */}
          <polygon points="24,56 96,56 86,100 34,100" fill="#f8fafc" stroke="#581c87" strokeWidth="3" />
          <line x1="36" y1="62" x2="40" y2="96" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="48" y1="62" x2="50" y2="96" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="60" y1="62" x2="60" y2="96" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="72" y1="62" x2="70" y2="96" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="84" y1="62" x2="80" y2="96" stroke="#cbd5e1" strokeWidth="3" />
          {shouldAnimateSpecial && (
            <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} isMystic />
          )}
        </svg>
      );
    }

    case 'dessert-nebula-cake': {
      const gradId = `nebulaCakeGrad-${uid}`;
      const shineMaskId = `nebulaCakeMask-${uid}`;
      const shineGradId = `nebulaCakeShine-${uid}`;
      return (
        <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#09090b" />
              <stop offset="48%" stopColor="#581c87" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <mask id={shineMaskId}>
              <polygon points="20,66 100,66 100,104 20,104" fill="#ffffff" />
              <polygon points="34,36 86,36 86,66 34,66" fill="#ffffff" />
            </mask>
          </defs>
          {/* Secret Halo */}
          <ellipse cx="60" cy="40" rx="50" ry="16" transform="rotate(-14 60 40)" stroke="#fde047" strokeWidth="2.8" fill="none" opacity="0.85" />
          {/* Bottom Obsidian Cake Tier */}
          <rect x="20" y="66" width="80" height="36" rx="10" fill={`url(#${gradId})`} stroke="#fde047" strokeWidth="3" />
          {/* Top Obsidian Cake Tier */}
          <rect x="34" y="36" width="52" height="32" rx="8" fill={`url(#${gradId})`} stroke="#fde047" strokeWidth="2.8" />
          {/* Golden Starlight Frosting Drips */}
          <path
            d="M34 38 Q42 52 50 40 Q60 55 68 40 Q78 52 86 38 V36 H34 Z"
            fill="#facc15"
          />
          <path
            d="M20 68 Q30 82 40 70 Q50 84 60 70 Q70 84 80 70 Q90 82 100 68 V66 H20 Z"
            fill="#facc15"
          />
          {/* Radiant Star Topper */}
          <polygon points="60,8 65,20 78,21 68,29 71,41 60,34 49,41 52,29 42,21 55,20" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.8" />
          {shouldAnimateSpecial && (
            <>
              <SvgShineSweep maskId={shineMaskId} gradId={shineGradId} width={120} height={120} />
              <circle cx="16" cy="24" r="2.2" fill="#ffffff">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="104" cy="22" r="2.2" fill="#fde047">
                <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />
              </circle>
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
