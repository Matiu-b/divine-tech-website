/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
      screens: {
        xs: '430px',
        '3xl': '1680px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Divine Tech AI design tokens (mirrored as CSS variables in src/index.css)
        paper: { DEFAULT: '#F6F5F1', 2: '#EEECE6', 3: '#E4E1D9' },
        ink: { DEFAULT: '#0A0F0E', 2: '#111716', 3: '#1A2120', 4: '#252D2C' },
        graphite: '#49504E',
        slate: '#656B69',
        mute: '#868986',
        brand: {
          DEFAULT: '#14A36B',
          ink: '#0B6E4A',
          glow: '#3CE09A',
          teal: '#13A89C',
          mint: '#DDF3E8',
          sage: '#DCE4DB',
          sand: '#E9E0D1',
        },
        // shadcn/ui tokens used by the template UI (auth pages, toasts)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        heading: ['var(--font-sans)'],
        body: ['var(--font-sans)'],
        display: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.25' } },
        'pulse-soft': { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '0.55', transform: 'scale(0.82)' } },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '33%': { transform: 'translate3d(3%,-4%,0) scale(1.06)' },
          '66%': { transform: 'translate3d(-3%,3%,0) scale(0.97)' },
        },
        breathe: { '0%,100%': { opacity: '0.75', transform: 'scale(1)' }, '50%': { opacity: '1', transform: 'scale(1.06)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        blink: 'blink 1.2s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        drift: 'drift 24s ease-in-out infinite',
        'drift-slow': 'drift 34s ease-in-out infinite',
        breathe: 'breathe 9s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
