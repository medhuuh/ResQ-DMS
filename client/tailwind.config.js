/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#65a30d', // Lime 600 - Keeping fixed for brand identity
                background: 'var(--bg-background)',
                surface: 'var(--bg-surface)',
                'text-main': 'var(--text-main)',
                'text-muted': 'var(--text-muted)',
                'border-color': 'var(--border-color)',
                'neon': '#39ff14', // Neon Green
                'dark-green': '#064e3b',
                'soft-glow': '#dcfce7',
                // Remap indigo to green to instantly theme the app without breaking styles
                indigo: {
                    50: '#ecfccb',
                    100: '#d9f99d',
                    200: '#bef264',
                    300: '#a3e635',
                    400: '#84cc16',
                    500: '#65a30d',
                    600: '#4d7c0f',
                    700: '#3f6212',
                    800: '#365314',
                    900: '#1a2e05',
                    950: '#0f1f03'
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}
