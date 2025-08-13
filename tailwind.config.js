/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'serif': ['Times New Roman', 'Times', 'serif'],
            },
            fontSize: {
                '12pt': '12pt',
                '14pt': '14pt',
                '18pt': '18pt',
            },
            spacing: {
                'page-width': '8.27in',
                'page-height': '11.69in',
                'page-margin': '1in',
            },
            screens: {
                'print': { 'raw': 'print' },
            }
        },
    },
    plugins: [],
}