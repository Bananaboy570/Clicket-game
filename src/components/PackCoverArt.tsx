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

export const DeepSeaPackCoverSVG: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="deepSeaPackBodyClip">
        <rect x="10" y="42" width="180" height="158" />
      </clipPath>
      <linearGradient id="deepSeaWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="45%" stopColor="#0369a1" />
        <stop offset="100%" stopColor="#082f49" />
      </linearGradient>
      <linearGradient id="deepSeaBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
      </linearGradient>
    </defs>

    <FoilSealTop />

    <g clipPath="url(#deepSeaPackBodyClip)">
      <rect x="10" y="42" width="180" height="158" fill="url(#deepSeaWaterGrad)" />

      {/* Ocean Sunbeams */}
      <polygon points="48,42 78,42 108,200 28,200" fill="url(#deepSeaBeamGrad)" />
      <polygon points="118,42 152,42 184,200 112,200" fill="url(#deepSeaBeamGrad)" />

      {/* Rising Bubbles */}
      <circle cx="34" cy="126" r="4.5" fill="#e0f2fe" opacity="0.5" />
      <circle cx="44" cy="108" r="2.8" fill="#e0f2fe" opacity="0.6" />
      <circle cx="164" cy="116" r="4" fill="#e0f2fe" opacity="0.5" />
      <circle cx="154" cy="96" r="2.5" fill="#e0f2fe" opacity="0.6" />

      {/* Ocean Trench Seabed & Coral */}
      <path d="M10 172 Q55 156 100 170 Q150 154 190 172 V200 H10 Z" fill="#0c4a6e" />
      <path d="M10 184 Q70 172 130 184 Q165 176 190 186 V200 H10 Z" fill="#082f49" />
      <path d="M22 184 V162 M22 172 L15 164 M22 170 L29 162" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M174 184 V160 M174 170 L167 162 M174 168 L181 161" stroke="#fb923c" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Shark Silhouette Left */}
      <g transform="translate(22, 128) rotate(-8) scale(0.46)">
        <path d="M12 52 Q52 24 88 46 L108 32 L100 54 L110 72 L88 60 Q52 80 12 52 Z" fill="#64748b" />
        <path d="M46 34 L58 10 L66 36 Z" fill="#475569" />
        <circle cx="28" cy="49" r="4" fill="#0f172a" />
      </g>

      {/* Glowing Moon Jellyfish Right */}
      <g transform="translate(132, 118) rotate(8) scale(0.46)">
        <path d="M20 50 C20 20 80 20 80 50 Z" fill="#a5f3fc" opacity="0.9" />
        <path d="M32 50 Q28 72 34 90 M46 50 Q50 74 44 92 M60 50 Q56 72 62 90 M70 50 Q74 70 68 88" stroke="#67e8f9" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* Center Clownfish */}
      <g transform="translate(74, 134) scale(0.5)">
        <ellipse cx="52" cy="50" rx="34" ry="24" fill="#f97316" />
        <path d="M36 27 Q44 50 36 73" stroke="#ffffff" strokeWidth="9" fill="none" />
        <path d="M62 28 Q68 50 62 72" stroke="#ffffff" strokeWidth="7" fill="none" />
        <polygon points="82,50 102,34 102,66" fill="#ea580c" />
        <circle cx="30" cy="45" r="5" fill="#ffffff" />
        <circle cx="30" cy="45" r="3" fill="#0f172a" />
      </g>

      {/* Bold DEEP SEA Title */}
      <text
        x="100"
        y="84"
        textAnchor="middle"
        fill="#ffffff"
        stroke="#082f49"
        strokeWidth="6"
        paintOrder="stroke fill"
        fontFamily="'Titan One', cursive, sans-serif"
        fontSize="26"
        letterSpacing="1"
      >
        DEEP SEA
      </text>

      {/* Abyssal PACK Banner */}
      <g transform="translate(62, 92)">
        <rect x="0" y="0" width="76" height="28" rx="6" fill="#082f49" stroke="#38bdf8" strokeWidth="2.5" />
        <rect x="3" y="3" width="70" height="22" rx="4" fill="#0369a1" />
        <text
          x="38"
          y="21"
          textAnchor="middle"
          fill="#e0f2fe"
          stroke="#082f49"
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

const DrinksPackCoverSVG: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="drinksPackBodyClip">
        <rect x="10" y="42" width="180" height="158" />
      </clipPath>
      <linearGradient id="drinksPackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbcfe8" />
        <stop offset="42%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#9d174d" />
      </linearGradient>
    </defs>

    <FoilSealTop />

    <g clipPath="url(#drinksPackBodyClip)">
      <rect x="10" y="42" width="180" height="158" fill="url(#drinksPackGrad)" />

      {/* Diagonal Fizz Stripes */}
      <polygon points="10,42 46,42 10,96" fill="#ffffff" opacity="0.18" />
      <polygon points="190,42 152,42 190,98" fill="#ffffff" opacity="0.16" />

      {/* Fizzy Soda Bubbles */}
      <circle cx="38" cy="112" r="6" fill="#fdf2f8" opacity="0.6" />
      <circle cx="52" cy="96" r="3.5" fill="#fdf2f8" opacity="0.7" />
      <circle cx="158" cy="108" r="5" fill="#fdf2f8" opacity="0.55" />
      <circle cx="166" cy="92" r="3" fill="#fdf2f8" opacity="0.7" />
      <circle cx="98" cy="134" r="4" fill="#fef08a" opacity="0.65" />

      {/* Café Counter Bottom */}
      <rect x="10" y="170" width="180" height="30" fill="#831843" />
      <rect x="10" y="166" width="180" height="7" fill="#fbcfe8" />

      {/* Left Boba Cup Mini */}
      <g transform="translate(22, 122) rotate(-10) scale(0.45)">
        <rect x="34" y="6" width="10" height="34" rx="4" fill="#db2777" />
        <polygon points="20,34 80,34 72,96 28,96" fill="#fef3c7" />
        <ellipse cx="50" cy="34" rx="34" ry="8" fill="#ffffff" />
        <circle cx="38" cy="84" r="6" fill="#292524" />
        <circle cx="54" cy="86" r="6" fill="#292524" />
        <circle cx="64" cy="80" r="6" fill="#292524" />
      </g>

      {/* Right Lemonade Pitcher Mini */}
      <g transform="translate(132, 120) rotate(8) scale(0.45)">
        <rect x="52" y="4" width="10" height="32" rx="4" fill="#22c55e" />
        <rect x="22" y="30" width="56" height="66" rx="12" fill="#fef08a" />
        <circle cx="68" cy="32" r="14" fill="#facc15" stroke="#ffffff" strokeWidth="3" />
      </g>

      {/* Center Ice Cream Float Mini */}
      <g transform="translate(76, 124) scale(0.48)">
        <circle cx="50" cy="34" r="22" fill="#ffffff" />
        <polygon points="26,44 74,44 68,94 32,94" fill="#7c2d12" />
        <circle cx="50" cy="14" r="7" fill="#ef4444" />
      </g>

      {/* Bold DRINKS Title */}
      <text
        x="100"
        y="84"
        textAnchor="middle"
        fill="#ffffff"
        stroke="#831843"
        strokeWidth="6"
        paintOrder="stroke fill"
        fontFamily="'Titan One', cursive, sans-serif"
        fontSize="28"
        letterSpacing="1"
      >
        DRINKS
      </text>

      {/* Berry PACK Banner */}
      <g transform="translate(62, 92)">
        <rect x="0" y="0" width="76" height="28" rx="6" fill="#831843" stroke="#fbcfe8" strokeWidth="2.5" />
        <rect x="3" y="3" width="70" height="22" rx="4" fill="#db2777" />
        <text
          x="38"
          y="21"
          textAnchor="middle"
          fill="#fdf2f8"
          stroke="#831843"
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

const BallPackCoverSVG: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="ballPackBodyClip">
        <rect x="10" y="42" width="180" height="158" />
      </clipPath>
      <linearGradient id="ballPackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="48%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
    </defs>

    <FoilSealTop />

    <g clipPath="url(#ballPackBodyClip)">
      <rect x="10" y="42" width="180" height="158" fill="url(#ballPackGrad)" />

      {/* Sunburst Arcade Rays */}
      <polygon points="100,120 10,42 50,42" fill="#ffffff" opacity="0.16" />
      <polygon points="100,120 150,42 190,42" fill="#ffffff" opacity="0.16" />
      <polygon points="100,120 85,42 115,42" fill="#ffffff" opacity="0.2" />

      {/* Arcade Court Floor */}
      <rect x="10" y="168" width="180" height="32" fill="#713f12" />
      <rect x="10" y="164" width="180" height="6" fill="#fef9c3" />

      {/* Left Basketball Mini */}
      <g transform="translate(22, 126) rotate(-10) scale(0.45)">
        <circle cx="50" cy="50" r="42" fill="#ea580c" stroke="#7c2d12" strokeWidth="5" />
        <line x1="8" y1="50" x2="92" y2="50" stroke="#7c2d12" strokeWidth="4" />
        <line x1="50" y1="8" x2="50" y2="92" stroke="#7c2d12" strokeWidth="4" />
      </g>

      {/* Center Soccer Ball Mini */}
      <g transform="translate(76, 126) scale(0.48)">
        <circle cx="50" cy="50" r="42" fill="#ffffff" stroke="#0f172a" strokeWidth="5" />
        <polygon points="50,30 66,42 60,62 40,62 34,42" fill="#0f172a" />
      </g>

      {/* Right Beach Ball Mini */}
      <g transform="translate(134, 128) rotate(12) scale(0.45)">
        <circle cx="50" cy="50" r="42" fill="#38bdf8" stroke="#0f172a" strokeWidth="4" />
        <path d="M50 8 A42 42 0 0 1 92 50 L50 50 Z" fill="#ef4444" />
        <path d="M8 50 A42 42 0 0 1 50 8 L50 50 Z" fill="#facc15" />
        <circle cx="50" cy="50" r="10" fill="#ffffff" />
      </g>

      {/* Bold BALL Title */}
      <text
        x="100"
        y="84"
        textAnchor="middle"
        fill="#ffffff"
        stroke="#713f12"
        strokeWidth="6"
        paintOrder="stroke fill"
        fontFamily="'Titan One', cursive, sans-serif"
        fontSize="32"
        letterSpacing="1.5"
      >
        BALL
      </text>

      {/* Court PACK Banner */}
      <g transform="translate(62, 92)">
        <rect x="0" y="0" width="76" height="28" rx="6" fill="#713f12" stroke="#fef08a" strokeWidth="2.5" />
        <rect x="3" y="3" width="70" height="22" rx="4" fill="#ca8a04" />
        <text
          x="38"
          y="21"
          textAnchor="middle"
          fill="#fef9c3"
          stroke="#713f12"
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

const DessertPackCoverSVG: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="dessertPackBodyClip">
        <rect x="10" y="42" width="180" height="158" />
      </clipPath>
      <linearGradient id="dessertPackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f3e8ff" />
        <stop offset="46%" stopColor="#c084fc" />
        <stop offset="100%" stopColor="#6b21a8" />
      </linearGradient>
    </defs>

    <FoilSealTop />

    <g clipPath="url(#dessertPackBodyClip)">
      <rect x="10" y="42" width="180" height="158" fill="url(#dessertPackGrad)" />

      {/* Frosting Scallop Awning Top */}
      <path
        d="M10 42 H190 V54 Q175 64 160 54 Q145 64 130 54 Q115 64 100 54 Q85 64 70 54 Q55 64 40 54 Q25 64 10 54 Z"
        fill="#fdf4ff"
        opacity="0.85"
      />

      {/* Confetti Sprinkles */}
      <rect x="30" y="102" width="10" height="4" rx="2" fill="#f43f5e" transform="rotate(-25 35 104)" />
      <rect x="160" y="96" width="10" height="4" rx="2" fill="#facc15" transform="rotate(28 165 98)" />
      <rect x="150" y="114" width="9" height="4" rx="2" fill="#38bdf8" transform="rotate(-15 154 116)" />
      <rect x="42" y="118" width="9" height="4" rx="2" fill="#4ade80" transform="rotate(22 46 120)" />

      {/* Bakery Counter Bottom */}
      <rect x="10" y="170" width="180" height="30" fill="#581c87" />
      <rect x="10" y="166" width="180" height="6" fill="#fae8ff" />

      {/* Left Glazed Donut Mini */}
      <g transform="translate(22, 126) rotate(-10) scale(0.45)">
        <circle cx="50" cy="50" r="38" fill="#f59e0b" stroke="#92400e" strokeWidth="4" />
        <circle cx="50" cy="46" r="33" fill="#f472b6" />
        <circle cx="50" cy="48" r="13" fill="#c084fc" />
        <rect x="30" y="30" width="8" height="3.5" rx="1.5" fill="#fef08a" transform="rotate(-20 34 32)" />
        <rect x="64" y="34" width="8" height="3.5" rx="1.5" fill="#38bdf8" transform="rotate(25 68 36)" />
      </g>

      {/* Center Frosted Cupcake Mini */}
      <g transform="translate(76, 122) scale(0.48)">
        <polygon points="28,54 72,54 66,94 34,94" fill="#fbbf24" stroke="#92400e" strokeWidth="3" />
        <ellipse cx="50" cy="48" rx="30" ry="14" fill="#fdf2f8" />
        <ellipse cx="50" cy="34" rx="22" ry="12" fill="#f9a8d4" />
        <circle cx="50" cy="18" r="8" fill="#ef4444" />
      </g>

      {/* Right Ice Cream Cone Mini */}
      <g transform="translate(134, 122) rotate(10) scale(0.45)">
        <polygon points="28,48 72,48 50,98" fill="#d97706" stroke="#78350f" strokeWidth="3.5" />
        <circle cx="50" cy="40" r="21" fill="#86efac" />
        <circle cx="50" cy="22" r="17" fill="#fda4af" />
      </g>

      {/* Bold DESSERT Title */}
      <text
        x="100"
        y="84"
        textAnchor="middle"
        fill="#ffffff"
        stroke="#581c87"
        strokeWidth="6"
        paintOrder="stroke fill"
        fontFamily="'Titan One', cursive, sans-serif"
        fontSize="26"
        letterSpacing="1"
      >
        DESSERT
      </text>

      {/* Frosting PACK Banner */}
      <g transform="translate(62, 92)">
        <rect x="0" y="0" width="76" height="28" rx="6" fill="#581c87" stroke="#f3e8ff" strokeWidth="2.5" />
        <rect x="3" y="3" width="70" height="22" rx="4" fill="#9333ea" />
        <text
          x="38"
          y="21"
          textAnchor="middle"
          fill="#fdf4ff"
          stroke="#581c87"
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
          className="w-full h-full object-contain select-none scale-[1.32]"
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

  if (packId === 'deep-sea') {
    return (
      <div className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 flex items-center justify-center`}>
        <img
          src="/assets/aistudio/Pack_Designs__1_-removebg-preview_15cd2098.png"
          alt="Deep Sea Pack"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </div>
    );
  }

  if (packId === 'drinks') {
    return (
      <div className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 flex items-center justify-center`}>
        <img
          src="/assets/aistudio/Pack_Designs__2_-removebg-preview_0608ced4.png"
          alt="Drinks Pack"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </div>
    );
  }

  if (packId === 'ball') {
    return (
      <div className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 flex items-center justify-center`}>
        <img
          src="/assets/aistudio/Pack_Designs__3_-removebg-preview_c408895e.png"
          alt="Ball Pack"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </div>
    );
  }

  if (packId === 'dessert') {
    return (
      <div className={`${className} drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)] transition-transform duration-200 flex items-center justify-center`}>
        <img
          src="/assets/aistudio/Pack_Designs__4_-removebg-preview_b0f95d90.png"
          alt="Desserts Pack"
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

/**
 * Octopus silhouette icon for the bottom-right corner of the Deep Sea Pack card
 */
export const DeepSeaOctopusCornerIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="40" r="24" fill="#e0f2fe" />
    <path
      d="M28 52 Q16 68 22 82 M40 58 Q34 74 38 86 M52 60 Q50 76 54 88 M64 58 Q68 74 64 86 M74 52 Q84 68 78 82"
      stroke="#bae6fd"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="41" cy="40" r="5" fill="#0c4a6e" />
    <circle cx="59" cy="40" r="5" fill="#0c4a6e" />
  </svg>
);

/**
 * Boba cup icon for the bottom-right corner of the Drinks Pack card
 */
export const DrinksCupCornerIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="46" y="10" width="9" height="28" rx="4" fill="#9d174d" />
    <ellipse cx="50" cy="36" rx="26" ry="7" fill="#fdf2f8" />
    <polygon points="26,36 74,36 67,88 33,88" fill="#fbcfe8" />
    <circle cx="40" cy="78" r="5" fill="#831843" />
    <circle cx="52" cy="80" r="5" fill="#831843" />
    <circle cx="60" cy="74" r="5" fill="#831843" />
  </svg>
);

/**
 * Glossy basketball/bouncer icon for the bottom-right corner of the Ball Pack card
 */
export const BallCornerIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="38" fill="#fef08a" stroke="#713f12" strokeWidth="5" />
    <line x1="12" y1="50" x2="88" y2="50" stroke="#713f12" strokeWidth="4.5" />
    <line x1="50" y1="12" x2="50" y2="88" stroke="#713f12" strokeWidth="4.5" />
    <path d="M25 22 Q45 50 25 78" stroke="#713f12" strokeWidth="4" fill="none" />
    <path d="M75 22 Q55 50 75 78" stroke="#713f12" strokeWidth="4" fill="none" />
  </svg>
);

/**
 * Faceless cupcake icon for the bottom-right corner of the Dessert Pack card
 */
export const DessertCupcakeCornerIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,52 76,52 67,88 33,88" fill="#fde68a" stroke="#78350f" strokeWidth="4" />
    <ellipse cx="50" cy="48" rx="30" ry="15" fill="#fdf4ff" />
    <ellipse cx="50" cy="35" rx="22" ry="12" fill="#f5d0fe" />
    <circle cx="50" cy="20" r="8" fill="#f43f5e" />
  </svg>
);

