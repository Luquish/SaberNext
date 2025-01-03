const primary = {
    DEFAULT: "#00D18C",
    50: "#8AFFD8",
    100: "#75FFD2",
    200: "#4CFFC4",
    300: "#24FFB7",
    400: "#00FAA7",
    500: "#00D18C",
    600: "#009966",
    700: "#006141",
    800: "#00291B",
    900: "#000000",
  };
  
  const accent = {
    DEFAULT: "#9945FF",
    50: "#FEFDFF",
    100: "#F2E8FF",
    200: "#DCBFFF",
    300: "#C697FF",
    400: "#AF6EFF",
    500: "#9945FF",
    600: "#7A0DFF",
    700: "#6000D4",
    800: "#46009C",
    900: "#2D0064",
  };
  
  const coolGray = {
    DEFAULT: "#6e7582",
    50: "#f9fafb",
    100: "#f0f1f3",
    150: "#eff1f4",
    200: "#d9dbdf",
    300: "#AAB8C1",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#161E26",
    900: "#050505",
  };
  
  const warmGray = {
    DEFAULT: "#6e7582",
    50: "#f9fafb",
    100: "#f0f1f3",
    150: "#eff1f4",
    200: "#d9dbdf",
    300: "#b7bbc2",
    400: "#8f959f",
    500: "#6e7582",
    600: "#555e6e",
    700: "#3e4859",
    800: "#222222",
    850: "#181818",
    900: "#050505",
  };
  
  const grays = {
    DEFAULT: "#6e7582",
    50: "#f9fafb",
    100: "#f0f1f3",
    150: "#eff1f4",
    200: "#d9dbdf",
    300: "#b7bbc2",
    400: "#8f959f",
    500: "#6e7582",
    600: "#555e6e",
    700: "#3e4859",
    800: "#283242",
    850: "#1f2023",
    900: "#131f30",
  };
  
  const textColor = {
    DEFAULT: grays[800],
    secondary: grays[500],
  };
  
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        './src/hoc/**/*.{js,jsx,ts,tsx}',
        './src/pages/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
        './src/**/*.{html,ts,tsx}',
    ],
    darkMode: "class",
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1220px',
        },
        fontFamily: {
            display: ['Inter', 'sans-serif'],
            body: ['Inter', 'sans-serif'],
            sans: ['Inter', 'sans-serif'],
            serif: ['Inter', 'sans-serif'],
            mono: ['monospace'],
        },
        extend: {
            colors: {
                secondary: '#666',
                saber: {
                    light: '#6966FB',
                    dark: '#3D42CE',
                    darker: '#181a52',
                    modelBg: '#111827',
                },
                primary,
                accent,
                coolGray,
                warmGray,
                grays,
                textColor,
            },
            boxShadow: {
                '3xl': 'rgba(82, 82, 82, 0.25) 10px 10px 20px, rgba(82, 82, 82, 0.25) -10px -10px  20px',
            },
            keyframes: {
                'fade-in-down': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-10px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    },
                }
            },
            animation: {
                'fade-in-down': 'fade-in-down 1.5s ease-out forwards',
                'fade-in-down-delayed': 'fade-in-down 1.5s 0.2s ease-out forwards',
                'fade-in-down-delayed-2': 'fade-in-down 1.5s 0.4s ease-out forwards',
                'fade-in-down-delayed-3': 'fade-in-down 1.5s 0.6s ease-out forwards',
            }
        },
    },
    plugins: [],
};
