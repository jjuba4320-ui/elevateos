import React from 'react';

interface MadakLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
  variant?: 'full' | 'glyph-only';
}

export const MadakLogo: React.FC<MadakLogoProps> = ({
  size = 32,
  className = '',
  showText = false,
  textClassName = '',
  variant = 'full',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div
        className="relative shrink-0 flex items-center justify-center rounded-xl overflow-hidden shadow-xs"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 512 512"
          width={size}
          height={size}
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="madakLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14162e" />
              <stop offset="100%" stopColor="#0b0d1e" />
            </linearGradient>
            <linearGradient id="madakLogoArc" x1="10%" y1="15%" x2="90%" y2="85%">
              <stop offset="0%" stopColor="#607cf8" />
              <stop offset="30%" stopColor="#38bdf8" />
              <stop offset="65%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Midnight Squircle Container */}
          <rect width="512" height="512" rx="120" fill="url(#madakLogoBg)" />

          {/* Orbiting Arc */}
          <path
            d="M 108 162 A 184 184 0 1 0 436 270"
            fill="none"
            stroke="url(#madakLogoArc)"
            strokeWidth="32"
            strokeLinecap="round"
          />

          {/* Golden Goal / Beacon Dot */}
          <circle cx="256" cy="152" r="23" fill="#fbbf24" />

          {/* Madak 'M' Peak Shape */}
          <path
            d="M 152 328 L 222 196 L 256 268 L 290 196 L 360 328"
            fill="none"
            stroke="#ffffff"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-start leading-none min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`font-black text-sm tracking-tight text-white font-cairo ${textClassName}`}>
              مَداك
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold uppercase tracking-wider">
              OS
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 font-medium truncate">
            MadakOS
          </span>
        </div>
      )}
    </div>
  );
};
