import React from 'react';

interface BrandBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({
  className = '',
  size = 'md',
}) => {
  // Dimensions for responsive banner badge
  const dimensions = {
    sm: 'w-[105px] h-[95px] sm:w-[125px] sm:h-[112px]',
    md: 'w-[120px] h-[108px] sm:w-[155px] sm:h-[140px] lg:w-[170px] lg:h-[152px]',
    lg: 'w-[160px] h-[144px] sm:w-[190px] sm:h-[170px]',
  }[size];

  return (
    <div className={`relative inline-block transition-transform duration-300 hover:scale-[1.02] ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 220 200"
        className="w-full h-full filter drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pennant Drop Shadow */}
          <filter id="badgeShadow" x="-15%" y="0%" width="130%" height="135%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Hanging White Pennant / Ribbon Shield with Pointed Chevron Bottom */}
        <path
          d="M 3 0 L 217 0 L 217 152 L 110 194 L 3 152 Z"
          fill="#FFFFFF"
          filter="url(#badgeShadow)"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />

        {/* Top Golden Trim Line */}
        <line x1="3" y1="1.5" x2="217" y2="1.5" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />

        {/* 1. EMBLEM: House + Skyscraper Building (Gold & Navy) */}
        <g transform="translate(110, 42) scale(0.22)">
          {/* Tower Body (Navy with Gold Outline) */}
          <path
            d="M -10 -40 L -10 -145 L 60 -168 L 60 120 L -10 120 Z"
            fill="#1B2653"
            stroke="#FFB800"
            strokeWidth="12"
            strokeLinejoin="round"
          />

          {/* House Body & Gable Roof (Navy with Gold Outline) */}
          <path
            d="M -125 0 L -40 -90 L 20 -35 L 20 120 L -125 120 Z"
            fill="#1B2653"
            stroke="#FFB800"
            strokeWidth="12"
            strokeLinejoin="round"
          />

          {/* Inner Navy Fill to merge seams */}
          <path
            d="M -120 0 L -40 -84 L 54 -160 L 54 114 L -120 114 Z"
            fill="#1B2653"
          />

          {/* Overhanging Gable Roof Trim */}
          <path
            d="M -145 15 L -40 -95 L 25 -38"
            fill="none"
            stroke="#FFB800"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Tower Slanted Roof Peak Trim */}
          <path
            d="M -15 -144 L 65 -170"
            fill="none"
            stroke="#FFB800"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Curved Swoosh Foundation Beam */}
          <path
            d="M -150 140 Q -30 100 100 112 L 100 118 Q -30 106 -150 146 Z"
            fill="#FFB800"
          />

          {/* 4-Pane Square Window in House */}
          <rect x="-90" y="10" width="22" height="22" rx="2" fill="#FFB800" />
          <rect x="-62" y="10" width="22" height="22" rx="2" fill="#FFB800" />
          <rect x="-90" y="38" width="22" height="22" rx="2" fill="#FFB800" />
          <rect x="-62" y="38" width="22" height="22" rx="2" fill="#FFB800" />

          {/* 4 Vertical Windows in Tower */}
          <rect x="15" y="-125" width="22" height="30" rx="3" fill="#FFB800" transform="skewY(-6)" />
          <rect x="15" y="-82" width="22" height="30" rx="3" fill="#FFB800" transform="skewY(-6)" />
          <rect x="15" y="-39" width="22" height="30" rx="3" fill="#FFB800" transform="skewY(-6)" />
          <rect x="15" y="4" width="22" height="30" rx="3" fill="#FFB800" transform="skewY(-6)" />
        </g>

        {/* 2. BRAND NAME: Banashankari® (Luxury Serif) */}
        <text
          x="110"
          y="98"
          textAnchor="middle"
          fill="#1B2653"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="700"
          fontSize="23.5"
          letterSpacing="-0.3"
        >
          Banashankari
        </text>

        {/* Registered Trademark Circle Symbol */}
        <circle cx="199" cy="85" r="4.2" fill="none" stroke="#1B2653" strokeWidth="0.8" />
        <text
          x="199"
          y="87.5"
          textAnchor="middle"
          fontSize="5"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fill="#1B2653"
        >
          R
        </text>

        {/* 3. SUBTITLE: E N T E R P R I S E S */}
        <text
          x="110"
          y="115"
          textAnchor="middle"
          fill="#1B2653"
          fontFamily="'Outfit', system-ui, sans-serif"
          fontWeight="800"
          fontSize="11.5"
          letterSpacing="4.5"
        >
          ENTERPRISES
        </text>

        {/* 4. SLANTED RIBBON: REAL ESTATE & CONSTRUCTION */}
        <path
          d="M 16 127 L 204 127 L 194 148 L 26 148 Z"
          fill="#1B2653"
        />

        <text
          x="110"
          y="141"
          textAnchor="middle"
          fill="#FFFFFF"
          fontFamily="'Outfit', system-ui, sans-serif"
          fontWeight="800"
          fontSize="8.5"
          letterSpacing="1.5"
        >
          REAL ESTATE &amp; CONSTRUCTION
        </text>
      </svg>
    </div>
  );
};
