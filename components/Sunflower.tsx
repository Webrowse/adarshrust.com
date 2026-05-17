'use client';

type Props = {
  rotation: number;
  className?: string;
};

export function Sunflower({ rotation, className = '' }: Props) {
  return (
    <div
      className={`relative ${className}`}
      style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center' }}
    >
      <svg viewBox="-50 -50 100 100" className="w-full h-full">
        <g filter="url(#wobble-soft)">
          {/* 12 petals */}
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="-32"
              rx="7"
              ry="20"
              transform={`rotate(${i * 30})`}
              fill="var(--gear-base)"
              stroke="var(--gear-shadow)"
              strokeWidth="0.8"
            />
          ))}
          {/* brown center */}
          <circle cx="0" cy="0" r="14" fill="var(--gear-shadow)" />
          {/* seed dot detail */}
          <g fill="color-mix(in srgb, var(--gear-shadow) 70%, black)">
            <circle cx="-5" cy="-3" r="1.5" />
            <circle cx="5" cy="-3" r="1.5" />
            <circle cx="-3" cy="4" r="1.4" />
            <circle cx="4" cy="3" r="1.4" />
            <circle cx="0" cy="-7" r="1.2" />
          </g>
        </g>
      </svg>
    </div>
  );
}
