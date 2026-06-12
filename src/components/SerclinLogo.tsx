import { SVGProps } from "react";

interface SerclinLogoProps {
  variant?: "horizontal" | "vertical" | "symbol";
  hideText?: boolean;
  isDarkBg?: boolean;
  className?: string;
  [key: string]: any;
}

export default function SerclinLogo({
  variant = "horizontal",
  hideText = false,
  isDarkBg = false,
  className = "",
  ...props
}: SerclinLogoProps) {
  // SVG Symbol only
  const symbolWidth = 100;
  const symbolHeight = 100;

  const renderSymbol = () => (
    <svg
      viewBox="0 0 100 100"
      className="w-12 h-12 flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        {/* Navy Blue Brand Gradient */}
        <linearGradient id="brandBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a2d54" />
          <stop offset="50%" stopColor="#124578" />
          <stop offset="100%" stopColor="#0a2a4c" />
        </linearGradient>

        {/* Gold Brand Gradient */}
        <linearGradient id="brandGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bfa571" />
          <stop offset="50%" stopColor="#dfca9e" />
          <stop offset="100%" stopColor="#9e814d" />
        </linearGradient>

        <filter id="gentle-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Main Container */}
      <g filter="url(#gentle-shadow)" transform="translate(0, -2)">
        {/* 1. LEFT SIDE: THE NAVY BLUE BRAIN (Mental / Neurological Health) */}
        <g id="brain-left">
          {/* Main Hemisphere Base */}
          <path
            d="M 48,22 C 38,22 28,26 26,35 C 24,42 28,47 26,53 C 24,60 21,62 25,69 C 28,75 35,76 43,76 C 45,76 47,74 48,73 L 48,22 Z"
            fill="url(#brandBlueGrad)"
            stroke="#dfca9e"
            strokeWidth="0.75"
          />
          {/* Internal Brain Sulci / Ribbons */}
          <path
            d="M 48,30 C 42,30 38,26 34,31 C 32,34 35,38 32,41 C 30,43 27,41 27,45"
            fill="none"
            stroke="#dfca9e"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M 48,46 C 40,46 38,42 34,46 C 31,49 33,54 30,57 C 28,59 26,56 26,61"
            fill="none"
            stroke="#dfca9e"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M 48,58 C 42,58 40,62 36,60 C 33,59 34,66 31,67 C 29,68 28,71 34,72"
            fill="none"
            stroke="#dfca9e"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <path
            d="M 48,39 C 44,39 42,42 41,45 C 40,48 45,51 43,55"
            fill="none"
            stroke="#dfca9e"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </g>

        {/* 2. RIGHT SIDE: THE GOLDEN TREE WITH HUMAN FIGURE & 'S' BRAND GYLPH */}
        <g id="tree-human-right">
          {/* Trunk and Main right branches */}
          <path
            d="M 52,73 C 52,62 55,56 52,48 C 50,44 54,39 53,30 C 52,26 56,21 64,21 C 70,21 72,25 76,21 C 78,19 75,17 73,15 C 68,13 60,15 54,20 C 50,23 49,20 49,21"
            fill="none"
            stroke="url(#brandGoldGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Golden human curve stretching out like branches */}
          <path
            d="M 52,60 C 54,55 58,52 60,46 C 62,39 58,35 62,31 C 65,27 68,28 72,29 M 57,44 C 61,42 66,43 70,39 C 74,35 72,25 78,25"
            fill="none"
            stroke="url(#brandGoldGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Human head (circle) */}
          <circle cx="62" cy="35" r="2.5" fill="url(#brandGoldGrad)" />

          {/* Leaves */}
          {/* Branch 1 Leaves */}
          <path d="M 72,29 C 75,27 77,29 75,31 C 73,33 70,31 72,29" fill="url(#brandGoldGrad)" />
          <path d="M 70,39 C 73,37 75,39 73,41 C 71,43 68,41 70,39" fill="url(#brandGoldGrad)" />
          <path d="M 78,25 C 81,23 83,25 81,27 C 79,29 76,27 78,25" fill="url(#brandGoldGrad)" />
          
          {/* Upper branch Leaves */}
          <path d="M 64,21 C 66,18 69,19 67,22 C 65,25 62,23 64,21" fill="url(#brandGoldGrad)" />
          <path d="M 76,21 C 78,18 81,19 79,22 C 77,25 74,23 76,21" fill="url(#brandGoldGrad)" />
          <path d="M 73,15 C 75,12 77,13 75,16 C 73,19 71,17 73,15" fill="url(#brandGoldGrad)" />

          {/* 3. THE DISTINCTIVE "S" EMBEDDED IN THE RIGHT PANEL */}
          <g transform="translate(4, -1)">
            <text
              x="57"
              y="59"
              fontFamily="Cinzel, Georgia, 'Times New Roman', serif"
              fontWeight="bold"
              fontSize="24"
              fill="url(#brandGoldGrad)"
              textAnchor="middle"
              className="select-none"
            >
              S
            </text>
          </g>
        </g>

        {/* 4. SYMMETRICAL ROOTS SPREADING FROM THE BASE */}
        <g id="roots">
          {/* Left Navy Blue Roots */}
          <path
            d="M 47,73 C 45,76 43,78 38,79 C 32,80 29,83 26,81 C 24,80 26,79 28,79 C 33,79 38,76 41,75"
            fill="none"
            stroke="#0a2d54"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 48,74 C 47,78 45,82 41,84 C 36,86 33,89 29,88 C 27,87 30,86 33,85 C 38,84 41,81 44,76"
            fill="none"
            stroke="#0a2d54"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 48,73 C 48,78 47,83 45,87 C 43,91 40,93 36,94 C 34,94 37,92 39,90 C 43,87 45,81 46,75"
            fill="none"
            stroke="#0a2d54"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Right Gold Roots */}
          <path
            d="M 53,73 C 55,76 57,78 62,79 C 68,80 71,83 74,81 C 76,80 74,79 72,79 C 67,79 62,76 59,75"
            fill="none"
            stroke="url(#brandGoldGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 52,74 C 53,78 55,82 59,84 C 64,86 67,89 71,88 C 73,87 70,86 67,85 C 62,84 59,81 56,76"
            fill="none"
            stroke="url(#brandGoldGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 52,73 C 52,78 53,83 55,87 C 57,91 60,93 64,94 C 66,94 63,92 61,90 C 57,87 55,81 54,75"
            fill="none"
            stroke="url(#brandGoldGrad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );

  if (variant === "symbol" || hideText) {
    return renderSymbol();
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        {renderSymbol()}
        <div className="flex flex-col items-center">
          <span className={`text-xl sm:text-2xl font-serif font-bold tracking-widest uppercase leading-tight ${isDarkBg ? "text-white" : "text-[#0a2d54]"}`}>
            Instituto SerClin
          </span>
          <span className="text-[10px] sm:text-xs font-sans font-bold tracking-[0.3em] text-[#bfa571] uppercase">
            SAÚDE E BEM ESTAR
          </span>
        </div>
      </div>
    );
  }

  // Horizontal layout (default for headers, cards, footers)
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {renderSymbol()}
      <div className="flex flex-col text-left">
        <span className={`text-lg sm:text-xl font-serif font-extrabold tracking-wider uppercase leading-none ${isDarkBg ? "text-white" : "text-[#0a2d54]"}`}>
          Instituto SerClin
        </span>
        <span className="text-[9px] sm:text-[10px] font-sans font-black tracking-[0.25em] text-[#bfa571] uppercase leading-tight mt-1">
          SAÚDE E BEM ESTAR
        </span>
      </div>
    </div>
  );
}
