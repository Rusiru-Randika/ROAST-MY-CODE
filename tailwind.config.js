/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pixel: {
          bg: '#0b0b1a',
          card: '#14142b',
          header: '#1c1c3a',
          border: '#333366',
          neonCyan: '#00f0ff',
          neonPink: '#ff2e93',
          neonYellow: '#ffe600',
          neonGreen: '#39ff14',
          fireOrange: '#ff5500',
        }
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive', 'monospace'],
        retro: ['"Silkscreen"', 'monospace'],
        vt: ['"VT323"', 'monospace'],
        mono: ['"Fira Code"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'pixel-sm': '2px 2px 0px 0px #000000',
        'pixel': '4px 4px 0px 0px #000000',
        'pixel-lg': '6px 6px 0px 0px #000000',
        'pixel-cyan': '4px 4px 0px 0px #00f0ff',
        'pixel-pink': '4px 4px 0px 0px #ff2e93',
        'pixel-orange': '4px 4px 0px 0px #ff5500',
        'pixel-yellow': '4px 4px 0px 0px #ffe600',
      }
    },
  },
  plugins: [],
}
