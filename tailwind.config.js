/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Fredoka', 'sans-serif'],
            },
            colors: {
                sky: {
                    400: '#38BDF8',
                    500: '#0EA5E9',
                    600: '#0284C7',
                },
                grass: {
                    400: '#4ADE80',
                    500: '#22C55E',
                    600: '#16A34A',
                },
                sun: {
                    400: '#FACC15',
                    500: '#EAB308',
                    600: '#CA8A04',
                },
                berry: {
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',
                },
            },
            animation: {
                'bounce-short': 'bounce 0.5s infinite',
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
            },
            keyframes: {
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
                }
            }
        },
    },
    plugins: [],
}
