/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            keyframes: {
                "slide-in-out": {
                    "0%": { transform: "translateX(-100%)" },
                    "45%": { transform: "translateX(100%)" },
                    "55%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(-100%)" },
                },
                "fade-in": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                "fade-out": {
                    "0%": { opacity: 1 },
                    "100%": { opacity: 0 },
                },
                "scale-in": {
                    "0%": { transform: "scale(0.95)", opacity: 0 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                },
            },
            animation: {
                "slide-in-out": "slide-in-out 4s cubic-bezier(0.45, 0, 0.55, 1) infinite",
                "fade-in": "fade-in 0.5s ease-out forwards",
                "fade-out": "fade-out 0.5s ease-in forwards",
                "scale-in": "scale-in 0.5s ease-out forwards",
            },
            transitionProperty: {
                'height': 'height',
                'spacing': 'margin, padding',
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true, // Better performance for mobile
    },
    plugins: [],
} 