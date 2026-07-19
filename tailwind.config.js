/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        gothic: ['Cinzel', 'Noto Serif JP', 'serif'],
        mono: ['Share Tech Mono', 'VT323', 'monospace'],
      },
      colors: {
        forest: {
          bg:      '#080810',
          panel:   '#0d0d1a',
          border:  '#1a0a14',
          red:     '#ff0040',
          pink:    '#ff1493',
          crimson: '#8b0000',
          glow:    '#ff69b4',
          dim:     '#2a0a1a',
          text:    '#e8d5d5',
          muted:   '#7a5a65',
        },
      },
      animation: {
        'scanline':       'scanline 8s linear infinite',
        'glitch':         'glitch 0.3s ease-in-out',
        'particle-fall':  'particleFall 6s linear infinite',
        'pulse-red':      'pulseRed 2s ease-in-out infinite',
        'flicker':        'flicker 0.15s ease-in-out infinite',
        'grid-flash':     'gridFlash 4s ease-in-out infinite',
      },
      keyframes: {
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glitch: {
          '0%,100%': { clipPath: 'inset(0 0 100% 0)', transform: 'translateX(0)' },
          '20%':     { clipPath: 'inset(20% 0 60% 0)', transform: 'translateX(-4px)' },
          '40%':     { clipPath: 'inset(40% 0 20% 0)', transform: 'translateX(4px)' },
          '60%':     { clipPath: 'inset(0% 0 80% 0)', transform: 'translateX(-2px)' },
          '80%':     { clipPath: 'inset(60% 0 0% 0)', transform: 'translateX(2px)' },
        },
        pulseRed: {
          '0%,100%': { boxShadow: '0 0 8px #ff004044, 0 0 20px #ff004022' },
          '50%':     { boxShadow: '0 0 16px #ff004088, 0 0 40px #ff004044' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.92' },
        },
        gridFlash: {
          '0%,100%': { opacity: '0.04' },
          '50%':     { opacity: '0.08' },
        },
      },
    },
  },
  plugins: [],
};
