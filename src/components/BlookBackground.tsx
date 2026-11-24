import React, { useId } from 'react';

interface BlookBackgroundProps {
  className?: string;
  animated?: boolean;
}

/**
 * BlookBackground renders an infinite tiled pattern of authentic Blook silhouettes
 * in light red over a cheerful lighter red background.
 * Includes classic Blooks, Magician, King (Crown), Animal (Bear/Lion), Jester,
 * Astronaut, Dragon (Horns), Ghost, Party Hat, and Fox Blook silhouettes.
 */
export const BlookBackground: React.FC<BlookBackgroundProps> = ({
  className = '',
  animated = true,
}) => {
  const rawId = useId();
  const patternId = `blook-silhouettes-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <div
      className={`pointer-events-none fixed inset-0 overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <defs>
          <pattern
            id={patternId}
            width="280"
            height="280"
            patternUnits="userSpaceOnUse"
          >
            {animated && (
              <animateTransform
                attributeName="patternTransform"
                type="translate"
                from="0,0"
                to="280,280"
                dur="50s"
                repeatCount="indefinite"
              />
            )}

            {/* 1. Magician Blook (Top-Left) */}
            <g transform="translate(45, 45) rotate(-12)">
              <rect x="-18" y="-12" width="36" height="42" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
              <ellipse cx="0" cy="-12" rx="20" ry="3.5" fill="#ffb8b8" fillOpacity="0.55" />
              <path d="M -13 -12 L 0 -30 L 13 -12 Z" fill="#ffb8b8" fillOpacity="0.55" />
              <circle cx="0" cy="-30" r="2.5" fill="#ffb8b8" fillOpacity="0.55" />
            </g>

            {/* 2. King Blook with Crown (Top-Right) */}
            <g transform="translate(185, 40) rotate(14)">
              <rect x="-18" y="-10" width="36" height="42" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
              <path
                d="M -15 -10 L -15 -21 L -8 -16 L 0 -24 L 8 -16 L 15 -21 L 15 -10 Z"
                fill="#ffb8b8"
                fillOpacity="0.55"
              />
            </g>

            {/* 3. Animal / Bear Blook with Round Ears (Center-Left) */}
            <g transform="translate(115, 115) rotate(-6)">
              <circle cx="-13" cy="-11" r="6.5" fill="#ffb8b8" fillOpacity="0.55" />
              <circle cx="13" cy="-11" r="6.5" fill="#ffb8b8" fillOpacity="0.55" />
              <rect x="-18" y="-9" width="36" height="42" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
            </g>

            {/* 4. Jester / Clown Blook (Bottom-Left) */}
            <g transform="translate(40, 185) rotate(15)">
              <rect x="-18" y="-10" width="36" height="42" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
              <path
                d="M -16 -10 C -22 -18 -20 -25 -12 -23 C -8 -20 -4 -10 -4 -10 M 0 -10 C -3 -24 3 -24 0 -27 C -3 -24 3 -24 0 -10 M 4 -10 C 4 -10 8 -20 12 -23 C 20 -25 22 -18 16 -10 Z"
                fill="#ffb8b8"
                fillOpacity="0.55"
              />
              <circle cx="-12" cy="-23" r="2.2" fill="#ffb8b8" fillOpacity="0.55" />
              <circle cx="0" cy="-27" r="2.2" fill="#ffb8b8" fillOpacity="0.55" />
              <circle cx="12" cy="-23" r="2.2" fill="#ffb8b8" fillOpacity="0.55" />
            </g>

            {/* 5. Astronaut / Robot Blook (Center-Right) */}
            <g transform="translate(250, 120) rotate(-14)">
              <rect x="-1.5" y="-21" width="3" height="9" rx="1" fill="#ffb8b8" fillOpacity="0.55" />
              <circle cx="0" cy="-22" r="3" fill="#ffb8b8" fillOpacity="0.55" />
              <rect x="-21" y="2" width="3.5" height="13" rx="1.5" fill="#ffb8b8" fillOpacity="0.55" />
              <rect x="17.5" y="2" width="3.5" height="13" rx="1.5" fill="#ffb8b8" fillOpacity="0.55" />
              <rect x="-18" y="-12" width="36" height="42" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
            </g>

            {/* 6. Dragon / Horns Blook (Middle-Bottom) */}
            <g transform="translate(180, 185) rotate(-10)">
              <path d="M -12 -9 C -17 -16 -17 -24 -9 -25 C -7 -22 -7 -15 -8 -9 Z" fill="#ffb8b8" fillOpacity="0.55" />
              <path d="M 12 -9 C 17 -16 17 -24 9 -25 C 7 -22 7 -15 8 -9 Z" fill="#ffb8b8" fillOpacity="0.55" />
              <rect x="-18" y="-9" width="36" height="42" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
            </g>

            {/* 7. Ghost Blook with Wavy Skirt (Bottom-Center) */}
            <g transform="translate(110, 250) rotate(8)">
              <path
                d="M -18 4 C -18 -18 18 -18 18 4 L 18 20 C 14 17 11 23 8 20 C 5 17 2 23 0 20 C -2 17 -5 23 -8 20 C -11 17 -14 23 -18 20 Z"
                fill="#ffb8b8"
                fillOpacity="0.55"
              />
            </g>

            {/* 8. Classic Standard Blook (Far-Right Bottom) */}
            <g transform="translate(250, 245) rotate(12)">
              <rect x="-17" y="-19" width="34" height="40" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
            </g>

            {/* 9. Party Hat Blook (Top-Center) */}
            <g transform="translate(120, 25) rotate(9)">
              <path d="M -9 -11 L 0 -28 L 9 -11 Z" fill="#ffb8b8" fillOpacity="0.55" />
              <circle cx="0" cy="-29" r="3" fill="#ffb8b8" fillOpacity="0.55" />
              <rect x="-17" y="-11" width="34" height="40" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
            </g>

            {/* 10. Cat / Fox Blook with Pointy Ears (Far-Right Top) */}
            <g transform="translate(255, 35) rotate(-16)">
              <polygon points="-16,-9 -14,-22 -6,-9" fill="#ffb8b8" fillOpacity="0.55" />
              <polygon points="6,-9 14,-22 16,-9" fill="#ffb8b8" fillOpacity="0.55" />
              <rect x="-18" y="-9" width="36" height="42" rx="7" fill="#ffb8b8" fillOpacity="0.55" />
            </g>
          </pattern>
        </defs>

        {/* Tiled Pattern Rect filling the entire viewport */}
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};
