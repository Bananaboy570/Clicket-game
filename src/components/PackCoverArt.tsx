import React from 'react';

/**
 * Metallic crimp foil top for Circus pack
 */
const FoilSealTop: React.FC = () => (
  <g>
    <polygon
      points="10,20 15,6 21,20 27,6 33,20 39,6 45,20 51,6 57,20 63,6 69,20 75,6 81,20 87,6 93,20 99,6 105,20 111,6 117,20 123,6 129,20 135,6 141,20 147,6 153,20 159,6 165,20 171,6 177,20 183,6 190,20"
      fill="#b4b8bf"
    />
    <polygon
      points="12,20 15,10 19,20 27,10 31,20 39,10 43,20 51,10 55,20 63,10 67,20 75,10 79,20 87,10 91,20 99,10 103,20 111,10 115,20 123,10 127,20 135,10 139,20 147,10 151,20 159,10 163,20 171,10 175,20 183,10 188,20"
      fill="#dcdfe4"
    />
    <rect x="10" y="20" width="180" height="22" fill="#d1d5db" />
    <rect x="10" y="22" width="180" height="4" fill="#9ca3af" />
    <rect x="10" y="28" width="180" height="3" fill="#f3f4f6" />
    <rect x="10" y="33" width="180" height="4" fill="#9ca3af" />
    <rect x="10" y="39" width="180" height="3" fill="#e5e7eb" />
    <polygon points="35,20 65,20 50,42 20,42" fill="#ffffff" opacity="0.45" />
    <polygon points="125,20 145,20 130,42 110,42" fill="#ffffff" opacity="0.35" />
  </g>
);

/**
 * Metallic crimp foil bottom for Circus pack
 */
const FoilSealBottom: React.FC = () => (
  <g transform="translate(0, 200)">
    <rect x="10" y="0" width="180" height="20" fill="#d1d5db" />
    <rect x="10" y="2" width="180" height="3" fill="#f3f4f6" />
    <rect x="10" y="7" width="180" height="4" fill="#9ca3af" />
    <rect x="10" y="13" width="180" height="3" fill="#e5e7eb" />
    <rect x="10" y="17" width="180" height="3" fill="#9ca3af" />
    <polygon
      points="10,20 15,34 21,20 27,34 33,20 39,34 45,20 51,34 57,20 63,34 69,20 75,34 81,20 87,34 93,20 99,34 105,20 111,34 117,20 123,34 129,20 135,34 141,20 147,34 153,20 159,34 165,20 171,34 177,20 183,34 190,20"
      fill="#b4b8bf"
    />
    <polygon
      points="12,20 15,30 19,20 27,30 31,20 39,30 43,20 51,30 55,20 63,30 67,20 75,30 79,20 87,30 91,20 99,30 103,20 111,30 115,20 123,30 127,20 135,30 139,20 147,30 151,20 159,30 163,20 171,30 175,20 183,30 188,20"
      fill="#dcdfe4"
    />
    <polygon points="45,0 75,0 60,20 30,20" fill="#ffffff" opacity="0.4" />
  </g>
);

/**
 * Exact Circus Pack Cover from 1.png
 */
export const CircusPackCoverSVG: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="circusPackBodyClip">
        <rect x="10" y="42" width="180" height="158" />
      </clipPath>
      <linearGradient id="stageBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="35%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
    </defs>

    <FoilSealTop />

    <g clipPath="url(#circusPackBodyClip)">
      <rect x="10" y="42" width="180" height="158" fill="url(#stageBackGrad)" />

      {[15, 32, 49, 66, 83, 100, 117, 134, 151, 168].map((x, idx) => (
        <rect
          key={x}
          x={x}
          y="46"
          width="17"
          height="105"
          fill={idx % 2 === 0 ? '#d97706' : '#b45309'}
          opacity="0.55"
        />
      ))}

      <rect x="10" y="135" width="180" height="18" fill="#78350f" />
      <rect x="10" y="135" width="180" height="4" fill="#92400e" />

      {/* Drapes */}
      <path d="M10 42 H72 C58 75 44 102 36 142 H10 Z" fill="#b91c1c" />
      <path d="M10 42 H54 C44 75 34 102 26 142 H10 Z" fill="#dc2626" />
      <path d="M10 42 H34 C28 75 22 102 16 142 H10 Z" fill="#991b1b" />
      <path d="M10 64 L44 74 L40 84 L10 76 Z" fill="#eab308" />

      <path d="M190 42 H128 C142 75 156 102 164 142 H190 Z" fill="#b91c1c" />
      <path d="M190 42 H146 C156 75 166 102 174 142 H190 Z" fill="#dc2626" />
      <path d="M190 42 H166 C172 75 178 102 184 142 H190 Z" fill="#991b1b" />
      <path d="M190 64 L156 74 L160 84 L190 76 Z" fill="#eab308" />

      {/* Top valance */}
      <path d="M10 42 Q55 60 100 44 Q145 60 190 42 V50 Q145 66 100 48 Q55 66 10 50 Z" fill="#facc15" />
      <path d="M10 42 Q55 56 100 42 Q145 56 190 42 Z" fill="#dc2626" />

      {/* Tightrope */}
      <line x1="20" y1="95" x2="178" y2="95" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" />
      <line x1="20" y1="95" x2="178" y2="95" stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Tightrope Walker on rope */}
      <g transform="translate(27, 56) scale(0.36)">
        <rect x="10" y="10" width="100" height="100" rx="18" fill="#ffcc00" />
        <path d="M10 86 H38 C42 86 45 89 45 93 V110 H28 C18.059 110 10 101.941 10 92 V86 Z" fill="#5e439c" />
        <path d="M110 86 H82 C78 86 75 89 75 93 V110 H92 C101.941 110 110 101.941 110 92 V86 Z" fill="#5e439c" />
        <ellipse cx="24" cy="81" rx="7" ry="3.5" fill="#9a68c7" />
        <ellipse cx="96" cy="81" rx="7" ry="3.5" fill="#9a68c7" />
        <circle cx="31" cy="67" r="11.5" fill="#ffffff" />
        <circle cx="33" cy="67" r="7.5" fill="#3a3a3c" />
        <circle cx="29" cy="64" r="3" fill="#ffffff" />
        <circle cx="89" cy="67" r="11.5" fill="#ffffff" />
        <circle cx="87" cy="67" r="7.5" fill="#3a3a3c" />
        <circle cx="83" cy="64" r="3" fill="#ffffff" />
        <rect x="52" y="79" width="16" height="3.5" rx="1.75" fill="#d99b00" />
        <path d="M28 10 H92 C101.941 10 110 18.059 110 28 V48 C90 48 68 38 60 24 C52 38 30 48 10 48 V28 C10 18.059 18.059 10 28 10 Z" fill="#7d5636" />
        <ellipse cx="30" cy="44" rx="9" ry="4" fill="#634126" />
        <ellipse cx="90" cy="44" rx="9" ry="4" fill="#634126" />
      </g>

      {/* Circus Ball */}
      <g transform="translate(88, 52)">
        <circle cx="8" cy="8" r="7.5" fill="#fdf8f2" stroke="#1e293b" strokeWidth="1.2" />
        <path d="M2 5 Q8 2 14 5 L12 13 Q8 15 4 13 Z" fill="#2b59c3" />
        <path d="M1 8 H15" stroke="#facc15" strokeWidth="2.5" />
        <circle cx="5" cy="8" r="1.2" fill="#dc2626" />
        <circle cx="8" cy="8" r="1.2" fill="#dc2626" />
        <circle cx="11" cy="8" r="1.2" fill="#dc2626" />
      </g>

      {/* CIRCUS */}
      <g>
        <text
          x="67"
          y="91"
          fill="#ffffff"
          stroke="#431407"
          strokeWidth="5"
          paintOrder="stroke fill"
          fontFamily="'Titan One', cursive, sans-serif"
          fontSize="27"
        >
          C
        </text>
        <rect x="92" y="69" width="6.5" height="23" rx="3" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
        <line x1="93" y1="74" x2="98" y2="77" stroke="#92400e" strokeWidth="1.5" />
        <line x1="93" y1="80" x2="98" y2="83" stroke="#92400e" strokeWidth="1.5" />
        <line x1="93" y1="86" x2="98" y2="89" stroke="#92400e" strokeWidth="1.5" />
        <text
          x="102"
          y="91"
          fill="#ffffff"
          stroke="#431407"
          strokeWidth="5"
          paintOrder="stroke fill"
          fontFamily="'Titan One', cursive, sans-serif"
          fontSize="26"
        >
          RCUS
        </text>
      </g>

      {/* PACK */}
      <g transform="translate(74, 100)">
        <rect x="0" y="0" width="68" height="28" rx="4" fill="#92400e" stroke="#451a03" strokeWidth="2" />
        <rect x="3" y="3" width="62" height="22" rx="2" fill="#b45309" />
        <circle cx="6" cy="6" r="1.5" fill="#fde68a" />
        <circle cx="62" cy="6" r="1.5" fill="#fde68a" />
        <circle cx="6" cy="22" r="1.5" fill="#fde68a" />
        <circle cx="62" cy="22" r="1.5" fill="#fde68a" />
        <text
          x="34"
          y="21"
          textAnchor="middle"
          fill="#ffffff"
          stroke="#431407"
          strokeWidth="4.5"
          paintOrder="stroke fill"
          fontFamily="'Titan One', cursive, sans-serif"
          fontSize="20"
        >
          PACK
        </text>
      </g>

      {/* Magician Bottom Left */}
      <g transform="translate(34, 98) rotate(-14) scale(0.35)">
        <rect x="10" y="15" width="100" height="100" rx="18" fill="#fcc96b" />
        <path d="M10 92 H110 V97 C110 106.941 101.941 115 92 115 H28 C18.059 115 10 106.941 10 97 V92 Z" fill="#ff1a1a" />
        <polygon points="36,92 60,115 84,92" fill="#141414" />
        <polygon points="46,92 60,112 74,92" fill="#ffffff" />
        <path d="M28 15 H92 C101.941 15 110 23.059 110 33 V44 C95 44 85 32 75 26 C65 38 40 46 10 42 V33 C10 23.059 18.059 15 28 15 Z" fill="#b36b2c" />
        <circle cx="31" cy="68" r="11" fill="#ffffff" />
        <circle cx="34" cy="68" r="7.5" fill="#3a3a3c" />
        <circle cx="89" cy="68" r="11" fill="#ffffff" />
        <circle cx="91" cy="68" r="7.5" fill="#3a3a3c" />
        <path d="M52 84 L74 80 C75 90 67 95 58 94 C53 93 51 89 52 84 Z" fill="#6e1414" />
        <g transform="translate(92, 18) rotate(24)">
          <ellipse cx="0" cy="12" rx="22" ry="7" fill="#1a1a1a" />
          <path d="M-14 10 L-16 -14 C-16 -18 16 -18 16 -14 L14 10 Z" fill="#262626" />
          <path d="M-14.5 4 H14.5 L14 10 H-14 Z" fill="#ff1a1a" />
        </g>
      </g>

      {/* Jester Bottom Right */}
      <g transform="translate(148, 92) rotate(15) scale(0.35)">
        <rect x="10" y="20" width="100" height="100" rx="18" fill="#ffcc00" />
        <path d="M10 95 L28 104 L45 96 L60 105 L75 96 L92 104 L110 95 V102 C110 111.941 101.941 120 92 120 H28 C18.059 120 10 111.941 10 102 V95 Z" fill="#c9182b" />
        <path d="M28 20 H92 C101.941 20 110 28.059 110 38 V49 H10 V38 C10 28.059 18.059 20 28 20 Z" fill="#734f32" />
        <circle cx="31" cy="73" r="11.5" fill="#ffffff" />
        <circle cx="33" cy="73" r="7.5" fill="#3a3a3c" />
        <circle cx="89" cy="73" r="11.5" fill="#ffffff" />
        <circle cx="87" cy="73" r="7.5" fill="#3a3a3c" />
        <path d="M49 82 H71 V92 C71 98 66 103 60 103 C54 103 49 98 49 92 V82 Z" fill="#8f111d" />
        <rect x="49" y="82" width="22" height="5.5" fill="#ffffff" />
        <g transform="translate(36, 2)">
          <path d="M25 26 C18 10 6 12 4 22 C10 19 16 22 18 28 Z" fill="#299c52" />
          <path d="M24 26 C22 10 30 2 38 6 C33 12 32 19 34 26 Z" fill="#1f874c" />
          <path d="M33 26 C40 12 52 14 55 24 C48 20 42 23 39 28 Z" fill="#1e5bb8" />
          <path d="M16 28 L20 22 L25 27 L30 21 L35 27 L40 22 L43 28 Q30 31 16 28 Z" fill="#ffd900" />
        </g>
      </g>

      {/* Theatre Seats */}
      {[12, 34, 56, 78, 100, 122, 144, 166].map((x) => (
        <rect key={`r1-${x}`} x={x} y="145" width="21" height="16" rx="6" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
      ))}
      {[2, 24, 46, 68, 90, 112, 134, 156, 178].map((x) => (
        <rect key={`r2-${x}`} x={x} y="155" width="22" height="18" rx="6" fill="#991b1b" stroke="#450a0a" strokeWidth="1" />
      ))}
      {[10, 34, 58, 82, 106, 130, 154, 176].map((x) => (
        <rect key={`r3-${x}`} x={x} y="167" width="24" height="20" rx="7" fill="#b91c1c" stroke="#450a0a" strokeWidth="1" />
      ))}
      {[0, 26, 52, 78, 104, 130, 156, 180].map((x) => (
        <g key={`r4-${x}`}>
          <rect x={x} y="180" width="25" height="22" rx="7" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.2" />
          <path d={`M${x + 4} 184 Q${x + 12.5} 181 ${x + 21} 184`} stroke="#f87171" strokeWidth="2" fill="none" />
        </g>
      ))}
    </g>

    <FoilSealBottom />
  </svg>
);

export const FruitPackCoverSVG: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="fruitPackBodyClip">
        <rect x="10" y="42" width="180" height="158" />
      </clipPath>
      <linearGradient id="fruitPackSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="45%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
      <linearGradient id="fruitPackAppleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="55%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="fruitPackPearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="55%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>
    </defs>

    <FoilSealTop />

    <g clipPath="url(#fruitPackBodyClip)">
      <rect x="10" y="42" width="180" height="158" fill="url(#fruitPackSkyGrad)" />

      {/* Sunburst Radial Stripes */}
      <g opacity="0.22" transform="translate(100, 118)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <polygon
            key={deg}
            points="0,0 -14,-130 14,-130"
            fill="#ffffff"
            transform={`rotate(${deg})`}
          />
        ))}
      </g>

      {/* Lush Orchard Grass Hills */}
      <path d="M10 165 Q55 142 105 162 Q155 146 190 164 V200 H10 Z" fill="#16a34a" />
      <path d="M10 178 Q70 160 130 176 Q168 166 190 178 V200 H10 Z" fill="#15803d" />

      {/* Top Left Apple */}
      <g transform="translate(22, 114) rotate(-14) scale(0.5)">
        <path
          d="M50 18 C32 10 12 20 12 46 C12 78 30 98 46 96 C50 95 54 95 58 96 C74 98 92 78 92 46 C92 20 72 10 54 18 Z"
          fill="url(#fruitPackAppleGrad)"
        />
        <ellipse cx="32" cy="40" rx="8" ry="15" transform="rotate(-18 32 40)" fill="#fca5a5" opacity="0.5" />
        <path d="M51 20 Q55 6 62 4" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>

      {/* Top Right Pear */}
      <g transform="translate(132, 110) rotate(12) scale(0.5)">
        <path
          d="M50 14 C62 14 68 34 76 52 C86 72 80 96 50 96 C20 96 14 72 24 52 C32 34 38 14 50 14 Z"
          fill="url(#fruitPackPearGrad)"
        />
        <ellipse cx="40" cy="48" rx="8" ry="18" transform="rotate(-10 40 48)" fill="#dcfce7" opacity="0.55" />
        <path d="M50 16 Q52 4 58 3" stroke="#92400e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Center Kiwi Slice */}
      <g transform="translate(76, 136) scale(0.48)">
        <circle cx="50" cy="50" r="42" fill="#92400e" />
        <circle cx="50" cy="50" r="37" fill="#a3e635" />
        <circle cx="50" cy="50" r="14" fill="#fefce8" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <ellipse
            key={a}
            cx="50"
            cy="28"
            rx="2.3"
            ry="4.2"
            fill="#1c1917"
            transform={`rotate(${a} 50 50)`}
          />
        ))}
      </g>

      {/* Bold FRUIT Title */}
      <text
        x="100"
        y="90"
        textAnchor="middle"
        fill="#ffffff"
        stroke="#7c2d12"
        strokeWidth="6"
        paintOrder="stroke fill"
        fontFamily="'Titan One', cursive, sans-serif"
        fontSize="33"
        letterSpacing="1.5"
      >
        FRUIT
      </text>

      {/* Wooden Orchard PACK Banner */}
      <g transform="translate(62, 98)">
        <rect x="0" y="0" width="76" height="28" rx="6" fill="#9a3412" stroke="#431407" strokeWidth="2.5" />
        <rect x="3" y="3" width="70" height="22" rx="4" fill="#c2410c" />
        <text
          x="38"
          y="21"
          textAnchor="middle"
          fill="#fef08a"
          stroke="#431407"
          strokeWidth="4"
          paintOrder="stroke fill"
          fontFamily="'Titan One', cursive, sans-serif"
          fontSize="20"
        >
          PACK
        </text>
      </g>
    </g>

    <FoilSealBottom />
  </svg>
);

export const ChessPackCoverSVG: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="chessPackBodyClip">
        <rect x="10" y="42" width="180" height="158" />
      </clipPath>
      <linearGradient id="chessPackSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e1b4b" />
        <stop offset="52%" stopColor="#312e81" />
        <stop offset="100%" stopColor="#4338ca" />
      </linearGradient>
      <linearGradient id="chessPackIvoryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor="#f1f5f9" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="chessPackObsidianGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="55%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>

    <FoilSealTop />

    <g clipPath="url(#chessPackBodyClip)">
      <rect x="10" y="42" width="180" height="158" fill="url(#chessPackSkyGrad)" />

      {/* Grandmaster Spotlight Glow */}
      <polygon points="100,42 22,200 178,200" fill="#818cf8" opacity="0.18" />
      <circle cx="100" cy="110" r="56" fill="#c7d2fe" opacity="0.14" />

      {/* Perspective Checkered Chessboard Floor */}
      <g>
        <rect x="10" y="156" width="180" height="44" fill="#1e293b" />
        {[0, 1, 2, 3, 4, 5].map((col) => (
          <React.Fragment key={col}>
            <polygon
              points={`${10 + col * 30},156 ${40 + col * 30},156 ${36 + col * 32},178 ${4 + col * 32},178`}
              fill={col % 2 === 0 ? '#e2e8f0' : '#334155'}
            />
            <polygon
              points={`${4 + col * 32},178 ${36 + col * 32},178 ${32 + col * 34},200 ${-2 + col * 34},200`}
              fill={col % 2 === 1 ? '#e2e8f0' : '#1e293b'}
            />
          </React.Fragment>
        ))}
        <rect x="10" y="154" width="180" height="4" fill="#facc15" opacity="0.8" />
      </g>

      {/* Left Obsidian Knight Silhouette */}
      <g transform="translate(18, 114) rotate(-8) scale(0.5)">
        <path
          d="M28 84 L32 54 C20 50 18 36 28 24 L36 12 L48 16 L60 8 L58 24 C74 32 76 58 64 84 Z"
          fill="url(#chessPackObsidianGrad)"
        />
        <rect x="22" y="82" width="48" height="12" rx="5" fill="#0f172a" />
        <path d="M40 24 C48 32 50 44 44 54" stroke="#64748b" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* Right White Pawn Silhouette */}
      <g transform="translate(136, 122) rotate(8) scale(0.48)">
        <circle cx="50" cy="30" r="16" fill="url(#chessPackIvoryGrad)" />
        <rect x="34" y="45" width="32" height="7" rx="3.5" fill="#e2e8f0" />
        <path d="M38 52 L28 84 H72 L62 52 Z" fill="url(#chessPackIvoryGrad)" />
        <rect x="22" y="82" width="56" height="12" rx="5" fill="#cbd5e1" />
      </g>

      {/* Center Royal King Piece */}
      <g transform="translate(74, 124) scale(0.52)">
        <rect x="46" y="4" width="8" height="22" rx="3" fill="#facc15" />
        <rect x="39" y="10" width="22" height="7" rx="3" fill="#facc15" />
        <path d="M34 32 L40 24 H60 L66 32 L62 78 H38 Z" fill="url(#chessPackIvoryGrad)" />
        <rect x="32" y="34" width="36" height="8" rx="4" fill="#fde047" />
        <rect x="24" y="78" width="52" height="14" rx="6" fill="#e2e8f0" />
      </g>

      {/* Bold CHESS Title */}
      <text
        x="100"
        y="88"
        textAnchor="middle"
        fill="#ffffff"
        stroke="#0f172a"
        strokeWidth="6"
        paintOrder="stroke fill"
        fontFamily="'Titan One', cursive, sans-serif"
        fontSize="32"
        letterSpacing="1.5"
      >
        CHESS
      </text>

      {/* Royal Slate & Gold PACK Banner */}
      <g transform="translate(62, 96)">
        <rect x="0" y="0" width="76" height="28" rx="6" fill="#0f172a" stroke="#facc15" strokeWidth="2.5" />
        <rect x="3" y="3" width="70" height="22" rx="4" fill="#312e81" />
        <text
          x="38"
          y="21"
          textAnchor="middle"
          fill="#fef08a"
          stroke="#0f172a"
          strokeWidth="4"
          paintOrder="stroke fill"
          fontFamily="'Titan One', cursive, sans-serif"
          fontSize="20"
        >
          PACK
        </text>
      </g>
    </g>

    <FoilSealBottom />
  </svg>
);

export const PackCoverArt: React.FC<{ packId?: string; className?: string }> = ({
  packId = 'circus',
  className = 'w-36 h-44',
}) => {
  if (packId === 'athletes') {
    return (
      <div className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 flex items-center justify-center`}>
        <img
          src="assets/aistudio/Pack_Designs__2_-removebg-preview_c4530e10.png"
          alt="Athletes Pack"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </div>
    );
  }

  if (packId === 'fruit') {
    return (
      <div className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 flex items-center justify-center`}>
        <img
          src="assets/aistudio/Pack_Designs__5_-removebg-preview__1__16e42f7f.png"
          alt="Fruit Pack"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </div>
    );
  }

  if (packId === 'chess') {
    return (
      <div className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 flex items-center justify-center`}>
        <img
          src="assets/aistudio/Pack_Designs__7_-removebg-preview_b259eceb.png"
          alt="Chess Pack"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 flex items-center justify-center`}>
      <img
        src="assets/aistudio/Pack_Designs__4_-removebg-preview_40ec04e2.png"
        alt="Circus Pack"
        className="w-full h-full object-contain select-none"
        draggable={false}
      />
    </div>
  );
};

/**
 * Clown face icon for the bottom-right corner of the Circus Pack card
 */
export const CircusClownFaceIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Fluffy curly clown hair puffs */}
    <circle cx="20" cy="44" r="13" fill="#b91c1c" />
    <circle cx="17" cy="57" r="11" fill="#dc2626" />
    <circle cx="25" cy="33" r="10" fill="#ef4444" />
    <circle cx="80" cy="44" r="13" fill="#b91c1c" />
    <circle cx="83" cy="57" r="11" fill="#dc2626" />
    <circle cx="75" cy="33" r="10" fill="#ef4444" />

    {/* Clown face base */}
    <circle cx="50" cy="54" r="30" fill="#fff7ed" stroke="#450a0a" strokeWidth="3.5" />

    {/* Tiny tilted circus hat */}
    <g transform="translate(50, 21) rotate(-8)">
      <ellipse cx="0" cy="7" rx="18" ry="4.5" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
      <path d="M-11 6 L-9 -10 H9 L11 6 Z" fill="#facc15" stroke="#0f172a" strokeWidth="2" />
      <rect x="-10" y="1" width="20" height="4" fill="#dc2626" />
      <circle cx="0" cy="-12" r="4" fill="#ef4444" stroke="#0f172a" strokeWidth="1.5" />
    </g>

    {/* Painted eyebrow arches & eyes */}
    <path d="M31 40 Q38 34 44 40" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <path d="M56 40 Q62 34 69 40" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <ellipse cx="38" cy="48" rx="4.5" ry="5.5" fill="#1e293b" />
    <circle cx="36.5" cy="46" r="1.6" fill="#ffffff" />
    <ellipse cx="62" cy="48" rx="4.5" ry="5.5" fill="#1e293b" />
    <circle cx="60.5" cy="46" r="1.6" fill="#ffffff" />

    {/* Rosy cheeks */}
    <circle cx="29" cy="60" r="5.5" fill="#fca5a5" />
    <circle cx="71" cy="60" r="5.5" fill="#fca5a5" />

    {/* Big cheerful clown smile */}
    <path
      d="M33 65 Q50 81 67 65"
      stroke="#dc2626"
      strokeWidth="4.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Classic big red clown nose */}
    <circle cx="50" cy="56" r="8" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2.2" />
    <circle cx="47.5" cy="53.5" r="2.3" fill="#ffffff" opacity="0.85" />
  </svg>
);

/**
 * Classic soccer ball icon for the bottom-right corner of the Athletes Pack card
 */
export const AthletesSoccerBallIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="soccerBallClip">
        <circle cx="50" cy="50" r="42" />
      </clipPath>
    </defs>

    {/* White leather sphere */}
    <circle cx="50" cy="50" r="42" fill="#f8fafc" stroke="#0f172a" strokeWidth="4.5" />

    <g clipPath="url(#soccerBallClip)">
      {/* Subtle shading crescent */}
      <path d="M62 10 A42 42 0 0 1 20 88 A46 46 0 0 0 62 10 Z" fill="#cbd5e1" opacity="0.65" />

      {/* Connecting panel seams */}
      <line x1="50" y1="35" x2="50" y2="14" stroke="#1e293b" strokeWidth="3.2" />
      <line x1="65" y1="45" x2="86" y2="38" stroke="#1e293b" strokeWidth="3.2" />
      <line x1="59" y1="63" x2="73" y2="84" stroke="#1e293b" strokeWidth="3.2" />
      <line x1="41" y1="63" x2="27" y2="84" stroke="#1e293b" strokeWidth="3.2" />
      <line x1="35" y1="45" x2="14" y2="38" stroke="#1e293b" strokeWidth="3.2" />

      {/* Center pentagon */}
      <polygon points="50,34 66,45 60,64 40,64 34,45" fill="#1e293b" />

      {/* Outer edge pentagon patches */}
      <polygon points="50,15 39,7 61,7" fill="#1e293b" />
      <polygon points="84,38 94,28 96,49" fill="#1e293b" />
      <polygon points="72,83 88,78 78,94" fill="#1e293b" />
      <polygon points="28,83 12,78 22,94" fill="#1e293b" />
      <polygon points="16,38 6,28 4,49" fill="#1e293b" />
    </g>

    {/* Outer outline crispness */}
    <circle cx="50" cy="50" r="42" fill="none" stroke="#0f172a" strokeWidth="4.5" />
  </svg>
);

/**
 * Glossy apple & leaf icon for the bottom-right corner of the Fruit Pack card
 */
export const FruitBasketCornerIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M52 24 C62 12 78 14 78 24 C66 28 58 28 52 24 Z" fill="#22c55e" />
    <path d="M48 26 Q46 12 40 10" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path
      d="M50 26 C31 18 14 30 14 54 C14 82 32 95 47 93 C50 92 52 92 55 93 C70 95 86 82 86 54 C86 30 69 18 50 26 Z"
      fill="#dc2626"
    />
    <ellipse cx="32" cy="46" rx="8" ry="15" transform="rotate(-18 32 46)" fill="#fca5a5" opacity="0.55" />
  </svg>
);

/**
 * Glossy knight silhouette icon for the bottom-right corner of the Chess Pack card
 */
export const ChessKnightCornerIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32 76 L37 52 C24 49 20 35 30 22 L42 12 L52 16 L66 10 L63 26 C78 34 80 56 68 76 Z"
      fill="#f8fafc"
    />
    <path
      d="M44 26 C53 34 55 46 48 56"
      stroke="#cbd5e1"
      strokeWidth="4.5"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="24" y="75" width="52" height="12" rx="6" fill="#cbd5e1" />
  </svg>
);

