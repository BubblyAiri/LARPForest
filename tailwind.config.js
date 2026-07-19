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
          bg:      '#fcf8fa', // Лайт-палитра: нежный жемчужно-светлый фон
          panel:   '#ffffff', // Чисто белые карточки-блоки
          border:  '#d6c5cb', // Аккуратные пастельные границы
          red:     '#ff0040', // Яркий красный акцент (сохранен из оригинального клипа)
          pink:    '#ff1493', // Насыщенный розовый неон для ховеров
          crimson: '#e6003a', // Чуть более читаемый красный для светлого фона
          glow:    '#ff69b4', // Розовое свечение элементов
          dim:     '#f0e2e6', // Мягкая подложка для активных элементов
          text:    '#1a1a24', // Глубокий темный текст как на larping.ru
          muted:   '#6b525b', // Читаемый приглушенный текст
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
          '0%,100%': { boxShadow: '0 0 8px #ff004022, 0 0 20px #ff004011' },
          '50%':     { boxShadow: '0 0 16px #ff004044, 0 0 40px #ff004022' },
        },
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.92' },
        },
        gridFlash: {
          '0%,100%': { opacity: '0.02' }, // Приглушили вспышки сетки под светлый фон
          '50%':     { opacity: '0.04' },
        },
      },
    },
  },
  plugins: [],
};
