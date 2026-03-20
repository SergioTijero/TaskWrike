const colorTokens = [
  'secondary-container',
  'tertiary',
  'on-primary-fixed',
  'on-tertiary-fixed-variant',
  'on-secondary-fixed',
  'on-error',
  'surface-container-low',
  'error-dim',
  'surface',
  'secondary',
  'on-tertiary',
  'inverse-surface',
  'on-tertiary-container',
  'on-surface',
  'on-secondary-container',
  'on-secondary-fixed-variant',
  'error',
  'primary-container',
  'on-primary-fixed-variant',
  'on-tertiary-fixed',
  'primary-fixed',
  'surface-container',
  'tertiary-container',
  'primary-fixed-dim',
  'inverse-primary',
  'on-background',
  'on-primary',
  'on-error-container',
  'secondary-fixed',
  'primary-dim',
  'surface-container-lowest',
  'tertiary-dim',
  'surface-dim',
  'primary',
  'on-surface-variant',
  'background',
  'surface-container-highest',
  'secondary-fixed-dim',
  'outline-variant',
  'surface-tint',
  'error-container',
  'inverse-on-surface',
  'surface-bright',
  'outline',
  'surface-container-high',
  'tertiary-fixed-dim',
  'tertiary-fixed',
  'surface-variant',
  'on-secondary',
  'secondary-dim',
  'on-primary-container',
];

const colors = Object.fromEntries(
  colorTokens.map((token) => [token, `rgb(var(--color-${token}) / <alpha-value>)`]),
);

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors,
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
