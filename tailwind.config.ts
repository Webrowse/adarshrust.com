import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          ember: '#ff6a1a',
          glow: '#ffa14a',
          oxide: '#aa5533',
          soot: '#1a1612',
          steel: '#0a0807',
          ash: '#3a2d22',
          bone: '#d4c5b0',
          dim: '#665544',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui'],
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'flicker': 'flicker 3s steps(8, end) infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '0.85', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.15)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '23%': { opacity: '0.7' },
          '47%': { opacity: '1' },
          '71%': { opacity: '0.85' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
